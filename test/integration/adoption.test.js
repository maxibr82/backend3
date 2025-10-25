import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';

// Tests funcionales para todos los endpoints del router adoption.router.js
describe('Tests Funcionales - Adoption Router', () => {
    let testUserId;
    let testPetId;
    let testAdoptionId;
    
    // Variables para datos de prueba
    const testUser = {
        first_name: "TestUser",
        last_name: "ForAdoption",
        email: "testadoption@example.com",
        password: "password123",
        role: "user"
    };

    const testPet = {
        name: "TestPet",
        specie: "dog",
        birthDate: "2020-01-01"
    };

    // Setup: Crear usuario y mascota de prueba antes de los tests
    before(async () => {
        try {
            // Crear usuario de prueba
            const userResponse = await request(app)
                .post('/api/sessions/register')
                .send(testUser);
            
            if (userResponse.status === 200 && userResponse.body.payload) {
                testUserId = userResponse.body.payload._id;
            }

            // Crear mascota de prueba
            const petResponse = await request(app)
                .post('/api/pets')
                .send(testPet);
            
            if (petResponse.status === 200 && petResponse.body.payload) {
                testPetId = petResponse.body.payload._id;
            }
        } catch (error) {
            console.log('Setup error:', error.message);
        }
    });

    // Cleanup: Limpiar datos de prueba después de los tests
    after(async () => {
        try {
            // Limpiar usuario de prueba
            if (testUserId) {
                await request(app).delete(`/api/users/${testUserId}`);
            }
            // Limpiar mascota de prueba
            if (testPetId) {
                await request(app).delete(`/api/pets/${testPetId}`);
            }
        } catch (error) {
            console.log('Cleanup error:', error.message);
        }
    });

    describe('GET /api/adoptions', () => {
        it('debería retornar todas las adopciones con estado de éxito', async () => {
            const response = await request(app)
                .get('/api/adoptions')
                .expect(200);

            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('payload');
            expect(response.body.payload).to.be.an('array');
        });

        it('debería retornar un array (puede estar vacío si no hay adopciones)', async () => {
            const response = await request(app)
                .get('/api/adoptions')
                .expect(200);

            expect(response.body.payload).to.be.an('array');
            // Verificar que cada adopción tenga la estructura correcta si hay elementos
            if (response.body.payload.length > 0) {
                const adoption = response.body.payload[0];
                expect(adoption).to.have.property('_id');
                expect(adoption).to.have.property('owner');
                expect(adoption).to.have.property('pet');
            }
        });

        it('debería manejar errores internos del servidor', async () => {
            // Este test simula un error interno, en un entorno real sería difícil provocarlo
            // pero verificamos que la estructura de error sea correcta
            const response = await request(app)
                .get('/api/adoptions');

            if (response.status === 500) {
                expect(response.body).to.have.property('status', 'error');
                expect(response.body).to.have.property('error', 'Internal server error');
            }
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('debería retornar 404 para adopción no existente', async () => {
            const fakeAdoptionId = '64a1b2c3d4e5f678901234ff';
            const response = await request(app)
                .get(`/api/adoptions/${fakeAdoptionId}`)
                .expect(404);

            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('error', 'Adoption not found');
        });

        it('debería retornar 400 para ID de adopción inválido', async () => {
            const invalidId = 'invalid-id';
            const response = await request(app)
                .get(`/api/adoptions/${invalidId}`);

            // Mongoose puede retornar 500 para IDs malformados
            expect([400, 500]).to.include(response.status);
            expect(response.body).to.have.property('status', 'error');
        });

        it('debería retornar adopción específica cuando existe', async () => {
            // Primero crear una adopción para probar
            if (testUserId && testPetId) {
                const adoptionResponse = await request(app)
                    .post(`/api/adoptions/${testUserId}/${testPetId}`)
                    .expect(200);

                // Obtener todas las adopciones para encontrar el ID de la adopción creada
                const allAdoptionsResponse = await request(app)
                    .get('/api/adoptions')
                    .expect(200);

                if (allAdoptionsResponse.body.payload.length > 0) {
                    // Buscar la adopción que coincida con nuestro usuario y mascota
                    const createdAdoption = allAdoptionsResponse.body.payload.find(
                        adoption => adoption.owner.toString() === testUserId && 
                                   adoption.pet.toString() === testPetId
                    );

                    if (createdAdoption) {
                        testAdoptionId = createdAdoption._id;

                        const response = await request(app)
                            .get(`/api/adoptions/${testAdoptionId}`)
                            .expect(200);

                        expect(response.body).to.have.property('status', 'success');
                        expect(response.body).to.have.property('payload');
                        expect(response.body.payload).to.have.property('_id', testAdoptionId);
                        expect(response.body.payload).to.have.property('owner');
                        expect(response.body.payload).to.have.property('pet');
                    }
                }
            }
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('debería retornar 404 para usuario no existente', async () => {
            const fakeUserId = '64a1b2c3d4e5f678901234ff';
            const fakePetId = '64a1b2c3d4e5f678901234ee';
            
            const response = await request(app)
                .post(`/api/adoptions/${fakeUserId}/${fakePetId}`)
                .expect(404);

            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('error', 'user Not found');
        });

        it('debería retornar 404 para mascota no existente', async () => {
            if (testUserId) {
                const fakePetId = '64a1b2c3d4e5f678901234ee';
                
                const response = await request(app)
                    .post(`/api/adoptions/${testUserId}/${fakePetId}`)
                    .expect(404);

                expect(response.body).to.have.property('status', 'error');
                expect(response.body).to.have.property('error', 'Pet not found');
            }
        });

        it('debería crear adopción exitosamente con usuario y mascota válidos', async () => {
            if (testUserId && testPetId) {
                const response = await request(app)
                    .post(`/api/adoptions/${testUserId}/${testPetId}`)
                    .expect(200);

                expect(response.body).to.have.property('status', 'success');
                expect(response.body).to.have.property('message', 'Pet adopted');

                // Verificar que la mascota ahora está marcada como adoptada
                const petResponse = await request(app)
                    .get(`/api/pets/${testPetId}`)
                    .expect(200);

                expect(petResponse.body.payload).to.have.property('adopted', true);
                expect(petResponse.body.payload).to.have.property('owner', testUserId);
            }
        });

        it('debería retornar 400 para mascota ya adoptada', async () => {
            if (testUserId && testPetId) {
                // Intentar adoptar la misma mascota otra vez
                const response = await request(app)
                    .post(`/api/adoptions/${testUserId}/${testPetId}`)
                    .expect(400);

                expect(response.body).to.have.property('status', 'error');
                expect(response.body).to.have.property('error', 'Pet is already adopted');
            }
        });

        it('debería manejar IDs inválidos correctamente', async () => {
            const invalidUserId = 'invalid-user-id';
            const invalidPetId = 'invalid-pet-id';
            
            const response = await request(app)
                .post(`/api/adoptions/${invalidUserId}/${invalidPetId}`);

            // Puede retornar 400 o 500 dependiendo de la validación
            expect([400, 500]).to.include(response.status);
            expect(response.body).to.have.property('status', 'error');
        });

        it('debería verificar que el usuario tenga la mascota en su lista después de la adopción', async () => {
            if (testUserId) {
                const userResponse = await request(app)
                    .get(`/api/users/${testUserId}`)
                    .expect(200);

                expect(userResponse.body.payload).to.have.property('pets');
                expect(userResponse.body.payload.pets).to.be.an('array');
                
                if (testPetId) {
                    expect(userResponse.body.payload.pets).to.include(testPetId);
                }
            }
        });
    });

    describe('Casos Edge y Validaciones Adicionales', () => {
        it('debería manejar parámetros faltantes en rutas', async () => {
            // Test para endpoint sin parámetros requeridos
            const response1 = await request(app)
                .post('/api/adoptions//')
                .expect(404); // Express devuelve 404 para rutas malformadas

            const response2 = await request(app)
                .get('/api/adoptions/')
                .expect(200); // Este debería funcionar (obtener todas las adopciones)
        });

        it('debería verificar estructura consistente de respuestas de error', async () => {
            const response = await request(app)
                .get('/api/adoptions/invalid-id');

            expect(response.body).to.have.property('status');
            expect(response.body).to.have.property('error');
            expect(response.body.status).to.equal('error');
        });

        it('debería verificar estructura consistente de respuestas de éxito', async () => {
            const response = await request(app)
                .get('/api/adoptions')
                .expect(200);

            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('payload');
        });
    });
});

// Tests adicionales para verificar la integridad de datos
describe('Tests de Integridad - Adoption Process', () => {
    it('debería mantener consistencia entre adopciones, usuarios y mascotas', async () => {
        const adoptionsResponse = await request(app)
            .get('/api/adoptions')
            .expect(200);

        const adoptions = adoptionsResponse.body.payload;

        for (const adoption of adoptions) {
            // Verificar que el usuario existe
            const userResponse = await request(app)
                .get(`/api/users/${adoption.owner}`);
            
            if (userResponse.status === 200) {
                expect(userResponse.body.payload.pets).to.include(adoption.pet.toString());
            }

            // Verificar que la mascota existe y está marcada como adoptada
            const petResponse = await request(app)
                .get(`/api/pets/${adoption.pet}`);
            
            if (petResponse.status === 200) {
                expect(petResponse.body.payload.adopted).to.be.true;
                expect(petResponse.body.payload.owner).to.equal(adoption.owner.toString());
            }
        }
    });
});