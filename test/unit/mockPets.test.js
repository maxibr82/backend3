import { expect } from 'chai';
import { generateMockPets } from '../../src/utils/mockPets.js';

describe('Generador de Mascotas Mock', () => {
    describe('generateMockPets', () => {
        it('debería generar una mascota por defecto', () => {
            const pets = generateMockPets();
            
            expect(pets).to.be.an('array');
            expect(pets).to.have.lengthOf(1);
        });

        it('debería generar el número especificado de mascotas', () => {
            const numPets = 7;
            const pets = generateMockPets(numPets);
            
            expect(pets).to.be.an('array');
            expect(pets).to.have.lengthOf(numPets);
        });

        it('debería generar mascotas con propiedades requeridas', () => {
            const pets = generateMockPets(1);
            const pet = pets[0];
            
            expect(pet).to.have.property('name');
            expect(pet).to.have.property('specie');
            expect(pet).to.have.property('birthDate');
            expect(pet).to.have.property('adopted');
            expect(pet).to.have.property('image');
            expect(pet).to.have.property('owner');

            expect(pet.name).to.be.a('string');
            expect(pet.specie).to.be.a('string');
            expect(pet.birthDate).to.be.a('date');
            expect(pet.adopted).to.be.a('boolean');
            expect(pet.image).to.be.a('string');
            expect(pet.owner).to.be.null;
        });

        it('debería generar mascotas con fechas de nacimiento válidas', () => {
            const pets = generateMockPets(10);
            const currentYear = new Date().getFullYear();
            
            pets.forEach(pet => {
                const birthYear = pet.birthDate.getFullYear();
                expect(birthYear).to.be.at.least(2015);
                expect(birthYear).to.be.at.most(2023);
            });
        });

        it('debería generar mascotas con adoptado establecido en falso por defecto', () => {
            const pets = generateMockPets(5);
            
            pets.forEach(pet => {
                expect(pet.adopted).to.be.false;
            });
        });

        it('debería generar mascotas con cadena de imagen vacía', () => {
            const pets = generateMockPets(3);
            
            pets.forEach(pet => {
                expect(pet.image).to.equal('');
            });
        });

        it('debería generar mascotas con propietario nulo', () => {
            const pets = generateMockPets(4);
            
            pets.forEach(pet => {
                expect(pet.owner).to.be.null;
            });
        });

        it('debería generar mascotas con nombres no vacíos', () => {
            const pets = generateMockPets(5);
            
            pets.forEach(pet => {
                expect(pet.name).to.not.be.empty;
                expect(pet.name.length).to.be.greaterThan(0);
            });
        });

        it('debería generar mascotas con especies no vacías', () => {
            const pets = generateMockPets(5);
            
            pets.forEach(pet => {
                expect(pet.specie).to.not.be.empty;
                expect(pet.specie.length).to.be.greaterThan(0);
            });
        });

        it('debería manejar cero mascotas', () => {
            const pets = generateMockPets(0);
            
            expect(pets).to.be.an('array');
            expect(pets).to.have.lengthOf(0);
        });

        it('debería generar mascotas diferentes', () => {
            const pets = generateMockPets(5);
            const names = pets.map(pet => pet.name);
            
            // Al menos algunos nombres deberían ser diferentes (faker genera variedad)
            const uniqueNames = [...new Set(names)];
            expect(uniqueNames.length).to.be.greaterThan(1);
        });

        it('debería generar estructura consistente para todas las mascotas', () => {
            const pets = generateMockPets(8);
            const expectedKeys = ['name', 'specie', 'birthDate', 'adopted', 'image', 'owner'];
            
            pets.forEach(pet => {
                expect(Object.keys(pet)).to.deep.equal(expectedKeys);
            });
        });
    });
});
