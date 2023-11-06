const glob = require('glob');
const ASTQ = require("astq");

const acorn = require('acorn');
const fs = require('fs');
const util = require('util');

const astq = new ASTQ();
astq.adapter("mozast");

const processSourceCode = (path) => {
  const sourceCode = fs.readFileSync(path, 'utf8');

  let ast = acorn.parse(sourceCode, { ecmaVersion: 2020 });

  let exportName = astq.query(ast, `
    // AssignmentExpression [
         /:left * [
              /:object * [ @name == "module" ]
           && /:property * [ @name == "exports" ]
         ]
      && /:right Identifier [@name]
    ]
  `)[0]?.right?.name;

  if (!exportName) {
    return;
  }

  const exportProperties = astq.query(ast, `
     // VariableDeclarator [
          /:id Identifier [@name == "${exportName}"]
       && /:init ObjectExpression [ /:properties * ]
     ]
   `)[0]?.init?.properties?.reduce(reduceProperties, {});

  if (!exportProperties) {
    return;
  }

  const { db2Query, getDB2Items, itemName, itemQueryName, getUpdatedItem, idKey, getId } = exportProperties;

  const getUpdatedItemMethod = astq.query(ast, `
     // VariableDeclarator [
          /:id Identifier [@name == "${getUpdatedItem.identifier}"]
       && /:init  ArrowFunctionExpression [ /:body * ]
     ]
   `)[0];

  const objectMapping = astq.query(getUpdatedItemMethod, `
     // ObjectExpression /:properties Property
   `).reduce(reduceProperties, {});

  if (itemQueryName) {
    console.log(`  ${valueToText(itemQueryName)} {`);
    console.log(`    string _query "${valueToText(db2Query || getDB2Items)}"`);
    console.log(`    string id PK "${valueToText(idKey || getId)}"`)
    Object.entries(objectMapping).forEach(([key, value]) => {
      if (key === 'id') {
        return;
      }
      console.log(`    string ${key} "${valueToText(value)}"`);
    });
    console.log("  }");
  }
  // console.log({ db2Query, getDB2Items, itemName, itemQueryName, idKey, getId });
  // console.log(objectMapping);
};

const isEmpty = (value) => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  return false;
}

const valueToText = (value) => {
  switch (typeof value) {
    case 'undefined':
      return '';
    case 'boolean':
      return value ? 'true' : 'false';
    case 'string':
      return value;
    case 'number':
      return value.toString();
    case 'object':
      if (Array.isArray(value)) {
        return value.filter(s => !isEmpty(s)).map(valueToText).join(' ');
      }
      if (value.value) {
        return valueToText(value.value);
      }
      if (value.values) {
        return valueToText(value.values);
      }
      if (value.queries) {
        return valueToText(value.queries);
      }
      if (value.identifier) {
        // TODO: rewrite this
        return valueToText(value.identifier);
      }
      if (value.quasis) {
        return (value.expressions || []).map(valueToText).join(' ') + (value.quasis || []).map(valueToText).join(' ');
      }
      if (value.left != null && value.right != null) {
        return `${valueToText(value.left)} ${value.operator} ${valueToText(value.right)}`;
      }
      if (value.callee) {
        return `${valueToText(value.callee)}(${value.arguments.map(valueToText).join(', ')})`;
      }
      if (value.consequent != null && value.alternate != null) {
        return `${valueToText(value.test)} ? ${valueToText(value.consequent)} : ${valueToText(value.alternate)}`;
      }

      throw new Error(`Unhandled type in valueToText. ${util.inspect(value)}`);
      // return Object.entries(value).map(([key, value]) => `${key} ${valueToText(value)}`).join(' ');
    default:
      console.log("Unhandled type in valueToText ", typeof value);
      throw new Error(`Unhandled type in valueToText. ${typeof value}`);
  }
};

const mapTemplateLiteralExpressions = (node) => {
  switch (node.type) {
    case 'MemberExpression':
      return node.property.value || node.property.name;
    case 'UnaryExpression':
      return [node.operator, mapTemplateLiteralExpressions(node.argument)].flat()
    case 'CallExpression':
      return mapExpression(node);
    default:
      console.log("Unhandled type in mapTemplateLiteralExpressions ", node);
      throw new Error(`Unhandled type in mapExpression. ${node}`)
  }
};

const mapExpression = (node) => {
  switch (node.type) {
    case 'Literal':
      return node.value;
    case 'BinaryExpression':
    case 'LogicalExpression':
      return {
        left: mapExpression(node.left),
        operator: node.operator,
        right: mapExpression(node.right),
      };
    case 'CallExpression':
      const callee = node.callee.name || mapExpression(node.callee);
      if (!callee) {
        console.log(node);
      }
      return {
        callee,
        arguments: node.arguments.map(mapExpression),
      };
    case 'ChainExpression':
      return mapExpression(node.expression);
    case 'MemberExpression':
      return node.property.value || node.property.name;
    case 'UnaryExpression':
      return [node.operator, mapExpression(node.argument)].flat();
    case 'ConditionalExpression':
      return {
        test: mapExpression(node.test),
        consequent: mapExpression(node.consequent),
        alternate: mapExpression(node.alternate),
      };
    case 'TemplateLiteral':
      const expressions = (node.expressions || []).map(mapTemplateLiteralExpressions)
      const quasis = node.quasis.map(q => q.value.raw)
      return {
        expressions,
        quasis,
      };
    default:
      console.log("Unhandled type in mapExpression", node);
      throw new Error(`Unhandled type in mapExpression. ${node}`)
  }
};

const reduceProperties = (acc, { key: { name }, value }) => {
  switch (value.type) {
    case 'ExpressionStatement':
      acc[name] = {
        value: value.expression.value
      };
      break;
    case 'MemberExpression':
      acc[name] = {
        value: value.property.value || value.property.name,
      };
      break;
    case 'TemplateLiteral':
    case 'CallExpression':
    case 'LogicalExpression':
    case 'BinaryExpression':
    case 'ConditionalExpression':
      acc[name] = mapExpression(value);
      break;
    case 'Literal':
      acc[name] = {
        value: value.value,
      };
      break;
    case 'Identifier':
      acc[name] = {
        identifier: value.name,
      };
      break;
    case 'UnaryExpression':
      acc[name] = {
        values: mapExpression(value),
      };
      break;
    case 'ArrowFunctionExpression':
      const queries = astq.query(value, `
        // CallExpression [
             // Identifier [ @name == 'query' ]
          && /:arguments Literal
        ]
      `).map(node => node.arguments[0].value);
      acc[name] = {
        queries,
      };
      break;
    default:
      console.log("Unhandled type in reduceProperties", value);
      throw new Error(`Unhandled type in reduceProperties. ${value.type}`)
  }
  return acc;
};

console.log("erDiagram");
const files = glob.globSync("src/db2-connect/**/*.js");
files.forEach(file => processSourceCode(file));
