import { CustomerRole, Prisma } from '@prisma/client';

export const customers: Prisma.CustomerUpsertArgs['create'][] = [
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd3',
    email: 'user@gmail.com',
    password: 'randow-password',
    role: {
      create: {
        role: CustomerRole.ADMIN,
      },
    },
    verify: {
      create: {
        token: '123456',
      },
    },
  },
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd4',
    email: 'user2@gmail.com',
    password: 'randow-password',
    role: {
      create: {
        role: CustomerRole.USER,
      },
    },
    verify: {
      create: {
        token: 'ABCDEF',
      },
    },
  },
];
