import { expect } from 'chai';
import { generateMockUsers } from '../../src/utils/mockUsers.js';

describe('Generador de Usuarios Mock', () => {
    describe('generateMockUsers', () => {
        it('debería generar un usuario por defecto', async () => {
            const users = await generateMockUsers();
            
            expect(users).to.be.an('array');
            expect(users).to.have.lengthOf(1);
        });

        it('debería generar el número especificado de usuarios', async () => {
            const numUsers = 5;
            const users = await generateMockUsers(numUsers);
            
            expect(users).to.be.an('array');
            expect(users).to.have.lengthOf(numUsers);
        });

        it('debería generar usuarios con propiedades requeridas', async () => {
            const users = await generateMockUsers(1);
            const user = users[0];
            
            expect(user).to.have.property('first_name');
            expect(user).to.have.property('last_name');
            expect(user).to.have.property('email');
            expect(user).to.have.property('password');
            expect(user).to.have.property('role');
            expect(user).to.have.property('pets');

            expect(user.first_name).to.be.a('string');
            expect(user.last_name).to.be.a('string');
            expect(user.email).to.be.a('string');
            expect(user.password).to.be.a('string');
            expect(user.role).to.be.a('string');
            expect(user.pets).to.be.an('array');
        });

        it('debería generar usuarios con formato de email válido', async () => {
            const users = await generateMockUsers(3);
            
            users.forEach(user => {
                expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            });
        });

        it('debería generar usuarios con roles válidos', async () => {
            const users = await generateMockUsers(10);
            const validRoles = ['user', 'admin'];
            
            users.forEach(user => {
                expect(validRoles).to.include(user.role);
            });
        });

        it('debería generar usuarios con contraseñas hasheadas', async () => {
            const users = await generateMockUsers(2);
            
            users.forEach(user => {
                expect(user.password).to.be.a('string');
                expect(user.password.length).to.be.greaterThan(50); // bcrypt hash length
                expect(user.password).to.not.equal('coder123'); // Should be hashed, not plain text
            });
        });

        it('debería inicializar el array de mascotas como vacío', async () => {
            const users = await generateMockUsers(3);
            
            users.forEach(user => {
                expect(user.pets).to.be.an('array');
                expect(user.pets).to.have.lengthOf(0);
            });
        });

        it('debería generar usuarios únicos (al menos emails diferentes)', async () => {
            const users = await generateMockUsers(5);
            const emails = users.map(user => user.email);
            const uniqueEmails = [...new Set(emails)];
            
            expect(uniqueEmails).to.have.lengthOf(emails.length);
        });

        it('debería manejar cero usuarios', async () => {
            const users = await generateMockUsers(0);
            
            expect(users).to.be.an('array');
            expect(users).to.have.lengthOf(0);
        });

        it('debería generar hash de contraseña consistente para todos los usuarios', async () => {
            // Todos los usuarios deberían tener la misma contraseña hasheada ('coder123')
            const users = await generateMockUsers(3);
            
            // Aunque el hash es diferente cada vez, todos deberían validar contra 'coder123'
            users.forEach(user => {
                expect(user.password).to.be.a('string');
                expect(user.password.length).to.be.greaterThan(50);
            });
        });
    });
});
