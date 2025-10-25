import { expect } from 'chai';
import UserDTO from '../../src/dto/User.dto.js';

describe('DTO de Usuario', () => {
    describe('getUserTokenFrom', () => {
        it('debería crear un objeto token desde un usuario con todos los campos', () => {
            const user = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                role: 'user',
                password: 'hashedPassword'
            };

            const token = UserDTO.getUserTokenFrom(user);

            expect(token).to.be.an('object');
            expect(token).to.have.property('name', 'John Doe');
            expect(token).to.have.property('email', 'john.doe@example.com');
            expect(token).to.have.property('role', 'user');
            expect(token).to.not.have.property('password');
            expect(token).to.not.have.property('first_name');
            expect(token).to.not.have.property('last_name');
        });

        it('debería manejar usuarios con nombres vacíos', () => {
            const user = {
                first_name: '',
                last_name: '',
                email: 'test@example.com',
                role: 'admin'
            };

            const token = UserDTO.getUserTokenFrom(user);

            expect(token.name).to.equal(' ');
            expect(token.email).to.equal('test@example.com');
            expect(token.role).to.equal('admin');
        });

        it('debería manejar usuarios con nombres indefinidos', () => {
            const user = {
                first_name: undefined,
                last_name: undefined,
                email: 'test@example.com',
                role: 'user'
            };

            const token = UserDTO.getUserTokenFrom(user);

            expect(token.name).to.equal('undefined undefined');
            expect(token.email).to.equal('test@example.com');
            expect(token.role).to.equal('user');
        });

        it('debería manejar usuarios con solo nombre', () => {
            const user = {
                first_name: 'Jane',
                last_name: '',
                email: 'jane@example.com',
                role: 'user'
            };

            const token = UserDTO.getUserTokenFrom(user);

            expect(token.name).to.equal('Jane ');
            expect(token.email).to.equal('jane@example.com');
            expect(token.role).to.equal('user');
        });

        it('debería retornar todas las propiedades requeridas', () => {
            const user = {
                first_name: 'Test',
                last_name: 'User',
                email: 'test@example.com',
                role: 'admin'
            };

            const token = UserDTO.getUserTokenFrom(user);

            expect(Object.keys(token)).to.have.lengthOf(3);
            expect(token).to.have.all.keys('name', 'email', 'role');
        });
    });
});
