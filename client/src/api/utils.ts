import { snakeCase } from 'change-case';

export const getOrderByString = (sortBy: string, sortOrder: string) =>
  `${snakeCase(sortBy).toUpperCase()}_${sortOrder}`;

export const getSearchArray = (search?: string | null) =>
  search
    ? search.split(' ').map((s) => ({ searchText: { includesInsensitive: s } }))
    : { searchText: { includesInsensitive: '' } };
