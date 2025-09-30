import { fakerES as faker } from '@faker-js/faker';

export const generateMockPets = (num = 1) => {
  const pets = [];
  for (let i = 0; i < num; i++) {
    pets.push({
      name: faker.animal.dog(),
      specie: faker.animal.type(),
      birthDate: faker.date.birthdate({ min: 2015, max: 2023, mode: 'year' }),
      adopted: false,
      image: '',
      owner: null
    });
  }
  return pets;
};
