import { fakerES as faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js';

export const generateMockUsers = async (num = 1) => {
  const users = [];
  for (let i = 0; i < num; i++) {
    const role = faker.helpers.arrayElement(['user', 'admin']);
    const password = await createHash('coder123');
    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password,
      role,
      pets: []
    });
  }
  return users;
};
