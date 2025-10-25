import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';

// Nota: Este archivo requiere que la aplicación esté configurada para testing
// y que se use una base de datos de prueba

describe('Tests de Integración de API', () => {
    describe('GET /', () => {
        it('debería retornar mensaje de bienvenida e información de endpoints', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);

            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('description');
            expect(response.body).to.have.property('documentation');
            expect(response.body).to.have.property('endpoints');
            
            expect(response.body.endpoints).to.have.property('users', '/api/users');
            expect(response.body.endpoints).to.have.property('pets', '/api/pets');
            expect(response.body.endpoints).to.have.property('adoptions', '/api/adoptions');
            expect(response.body.endpoints).to.have.property('sessions', '/api/sessions');
            expect(response.body.endpoints).to.have.property('mocks', '/api/mocks');
        });
    });

    describe('GET /apidocs', () => {
        it('debería servir la documentación de Swagger', async () => {
            const response = await request(app)
                .get('/apidocs/')
                .expect(200);

            expect(response.text).to.include('Swagger UI');
        });
    });

    describe('Endpoints de API de Usuarios', () => {
        describe('GET /api/users', () => {
            it('debería retornar lista de usuarios con estado de éxito', async () => {
                const response = await request(app)
                    .get('/api/users')
                    .expect(200);

                expect(response.body).to.have.property('status', 'success');
                expect(response.body).to.have.property('payload');
                expect(response.body.payload).to.be.an('array');
            });
        });

        // Nota: Los siguientes tests necesitarían datos de prueba específicos
        // o mocks más elaborados para funcionar correctamente
        describe('GET /api/users/:uid', () => {
            it('should return 404 for non-existent user', async () => {
                const fakeUserId = '64a1b2c3d4e5f678901234ff';
                const response = await request(app)
                    .get(`/api/users/${fakeUserId}`)
                    .expect(404);

                expect(response.body).to.have.property('status', 'error');
                expect(response.body).to.have.property('error', 'User not found');
            });
        });
    });

    describe('API Pets Endpoints', () => {
        describe('GET /api/pets', () => {
            it('should return pets list with success status', async () => {
                const response = await request(app)
                    .get('/api/pets')
                    .expect(200);

                expect(response.body).to.have.property('status', 'success');
                expect(response.body).to.have.property('payload');
                expect(response.body.payload).to.be.an('array');
            });
        });
    });

    describe('API Mocks Endpoints', () => {
        describe('GET /api/mocks/mockingpets', () => {
            it('should generate mock pets', async () => {
                const response = await request(app)
                    .get('/api/mocks/mockingpets')
                    .expect(200);

                expect(response.body).to.have.property('status', 'success');
                expect(response.body).to.have.property('payload');
                expect(response.body.payload).to.be.an('array');
                
                if (response.body.payload.length > 0) {
                    const pet = response.body.payload[0];
                    expect(pet).to.have.property('name');
                    expect(pet).to.have.property('specie');
                    expect(pet).to.have.property('birthDate');
                    expect(pet).to.have.property('adopted');
                    expect(pet).to.have.property('image');
                    expect(pet).to.have.property('owner');
                }
            });
        });

        describe('GET /api/mocks/mockingusers', () => {
            it('should generate mock users', async () => {
                const response = await request(app)
                    .get('/api/mocks/mockingusers')
                    .expect(200);

                expect(response.body).to.have.property('status', 'success');
                expect(response.body.payload).to.be.an('array');
                
                if (response.body.payload.length > 0) {
                    const user = response.body.payload[0];
                    expect(user).to.have.property('first_name');
                    expect(user).to.have.property('last_name');
                    expect(user).to.have.property('email');
                    expect(user).to.have.property('role');
                    expect(user).to.have.property('pets');
                }
            });
        });

        describe('POST /api/mocks/generateData', () => {
            it('should generate and insert users and pets', async () => {
                const requestData = {
                    users: 2,
                    pets: 3
                };

                const response = await request(app)
                    .post('/api/mocks/generateData')
                    .send(requestData)
                    .expect(200);

                expect(response.body).to.have.property('status', 'success');
                expect(response.body).to.have.property('message');
                expect(response.body).to.have.property('payload');
                expect(response.body.payload).to.have.property('users');
                expect(response.body.payload).to.have.property('pets');
            });

            it('should handle missing request body', async () => {
                const response = await request(app)
                    .post('/api/mocks/generateData')
                    .send({})
                    .expect(400);

                expect(response.body).to.have.property('status', 'error');
            });
        });
    });

    describe('Error Handling', () => {
        it('should return 404 for non-existent routes', async () => {
            const response = await request(app)
                .get('/api/nonexistent')
                .expect(404);
        });
    });
});
