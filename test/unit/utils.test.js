import { expect } from 'chai';
import { createHash, passwordValidation } from '../../src/utils/index.js';

describe('Utilidades - Gestión de Contraseñas', () => {
    describe('createHash', () => {
        it('debería crear un hash a partir de una contraseña en texto plano', async () => {
            const password = 'testPassword123';
            const hash = await createHash(password);
            
            expect(hash).to.be.a('string');
            expect(hash).to.not.equal(password);
            expect(hash.length).to.be.greaterThan(50); // bcrypt hashes are typically 60 chars
        });

        it('debería crear hashes diferentes para la misma contraseña', async () => {
            const password = 'testPassword123';
            const hash1 = await createHash(password);
            const hash2 = await createHash(password);
            
            expect(hash1).to.not.equal(hash2);
        });

        it('debería manejar contraseñas vacías', async () => {
            const password = '';
            const hash = await createHash(password);
            
            expect(hash).to.be.a('string');
            expect(hash.length).to.be.greaterThan(50);
        });
    });

    describe('passwordValidation', () => {
        it('debería validar contraseñas correctas', async () => {
            const password = 'testPassword123';
            const hash = await createHash(password);
            const user = { password: hash };
            
            const isValid = await passwordValidation(user, password);
            expect(isValid).to.be.true;
        });

        it('debería rechazar contraseñas incorrectas', async () => {
            const password = 'testPassword123';
            const wrongPassword = 'wrongPassword456';
            const hash = await createHash(password);
            const user = { password: hash };
            
            const isValid = await passwordValidation(user, wrongPassword);
            expect(isValid).to.be.false;
        });

        it('debería rechazar contraseñas vacías contra hash válido', async () => {
            const password = 'testPassword123';
            const hash = await createHash(password);
            const user = { password: hash };
            
            const isValid = await passwordValidation(user, '');
            expect(isValid).to.be.false;
        });
    });
});
