import { snakeCase } from 'change-case';

export const getOrderByString = (sortBy: string, sortOrder: string) =>
  `${snakeCase(sortBy).toUpperCase()}_${sortOrder}`;
