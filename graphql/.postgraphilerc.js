module.exports = {
  options: {
    connection: process.env.DATABASE_URL,
    schema: ['public', 'inspection', 'directory', 'sales', 'product'],
    port: 5433,
    appendPlugins:
      'postgraphile-plugin-connection-filter,postgraphile-plugin-nested-mutations,@graphile-contrib/pg-simplify-inflector,@graphile-contrib/pg-many-to-many,graphile-upsert-plugin,@graphile-contrib/pg-order-by-related,custom-plugin',
    watch: true,
    dynamicJson: true,
    enhanceGraphiql: true,
    graphiql: '/',
    extendedErrors: 'hint,detail,errcode',
    cors: true,
    graphileBuildOptions: {
      connectionFilterRelations: true,
      orderByNullsLast: true,
      retryOnInitFail: true,
      connectionFilterAllowNullInput: true,
    },
  },
};
