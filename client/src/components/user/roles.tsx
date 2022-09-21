import { pascalCase } from 'change-case';

import { User } from 'types';

export enum USER_ROLE {
  SALES_ASSOC = 'sales_assoc',
  ORDER_ENTRY = 'order_entry',
}

export const getUserRoles = (user: User) => {
  return user.userRoles.nodes.reduce((acc, userRole) => {
    const roleName = userRole?.roleName;
    if (!roleName) {
      return acc;
    }
    return { ...acc, [`is${pascalCase(roleName)}`]: true };
  }, {} as { [index: string]: boolean });
};
