
import { Router } from 'express';
import { fakerES as faker } from '@faker-js/faker';
import { generateMockUsers } from '../utils/mockUsers.js';
import { generateMockPets } from '../utils/mockPets.js';
import { usersService, petsService } from '../services/index.js';

const router = Router();

// Endpoint GET /mockingpets
router.get('/mockingpets', (req, res) => {
	const pets = generateMockPets(100); // Genera 100 mascotas mock
	// Simular formato de respuesta de Mongo
	const petsWithId = pets.map(pet => ({ ...pet, _id: faker.database.mongodbObjectId() }));
	res.send({ status: 'success', payload: petsWithId });
});

// Endpoint GET /mockingusers
router.get('/mockingusers', async (req, res) => {
	const users = await generateMockUsers(50);
	// Simular formato de respuesta de Mongo
	const usersWithId = users.map(user => ({ ...user, _id: faker.database.mongodbObjectId() }));
	res.send({ status: 'success', payload: usersWithId });
});

// Endpoint POST /generateData
router.post('/generateData', async (req, res) => {
	try {
		const { users = 0, pets = 0 } = req.body;
		const usersArr = await generateMockUsers(Number(users));
		const petsArr = generateMockPets(Number(pets));
		const insertedUsers = await Promise.all(usersArr.map(u => usersService.create(u)));
		const insertedPets = await Promise.all(petsArr.map(p => petsService.create(p)));
		res.send({ status: 'success', users: insertedUsers.length, pets: insertedPets.length });
	} catch (err) {
		res.status(500).send({ status: 'error', error: err.message });
	}
});

export default router;
