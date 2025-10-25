import dotenv from 'dotenv';

// Cargar variables de entorno para tests
dotenv.config();

// Configurar timeout global si es necesario
process.env.NODE_ENV = 'test';
