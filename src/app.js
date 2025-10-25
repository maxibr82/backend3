import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Cargar variables de entorno
dotenv.config();

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

const app = express();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI no está definida en las variables de entorno');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
	.then(() => console.log('Conexión exitosa a MongoDB'))
	.catch(err => console.error('Error al conectar a MongoDB:', err));

app.use(express.json());
app.use(cookieParser());

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Adoptme API',
            description: 'API para gestión de adopciones de mascotas. Sistema completo de usuarios, mascotas, adopciones y generación de datos ficticios para testing.',
            version: '1.0.0',
            contact: {
                name: 'API Support',
                email: 'support@adoptme.com'
            }
        },
        // Usar URL relativa para que Swagger apunte siempre al mismo origen/puerto donde corre la app
        servers: [
            {
                url: '/',
                description: 'Servidor actual'
            }
        ]
    },
    // Especificar el orden de carga: Mocks primero, luego Users, Pets, Sessions, y Adoptions al final
    apis: [
        join(__dirname, './docs/Mocks.yaml'),
        join(__dirname, './docs/Users.yaml'),
        join(__dirname, './docs/Pets.yaml'),
        join(__dirname, './docs/Sessions.yaml'),
        join(__dirname, './docs/Adoptions.yaml')
    ]
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: '¡Bienvenido a Adoptme API!',
        description: 'API para gestión de adopciones de mascotas',
        documentation: '/apidocs',
        endpoints: {
            users: '/api/users',
            pets: '/api/pets',
            adoptions: '/api/adoptions',
            sessions: '/api/sessions',
            mocks: '/api/mocks'
        }
    });
});

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks', mocksRouter);

// Solo iniciar el servidor si no estamos en modo de test
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT,()=>{
        console.log(`Listening on ${PORT}`);
        console.log(`📚 Documentación Swagger disponible en: http://localhost:${PORT}/apidocs`);
    });
}

// Exportar la app para testing
export default app;
