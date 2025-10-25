# 🐾 Adoptme API - Sistema de Adopción de Mascotas

Una API RESTful completa para la gestión de adopciones de mascotas, desarrollada con Node.js, Express y MongoDB.

## 📖 Documentación de la API

### 🔗 **URL de Documentación Swagger**
```
http://localhost:8080/apidocs
```

La documentación interactiva está disponible a través de Swagger UI, donde puedes:
- Explorar todos los endpoints disponibles
- Probar las funcionalidades directamente desde el navegador
- Ver ejemplos de requests y responses
- Consultar los schemas de datos

### 🏠 **Página de Inicio**
```
http://localhost:8080
```
Página de bienvenida con información general y enlaces rápidos a todos los endpoints.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Navegar al directorio
cd backend3-main

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones
```

### Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
MONGODB_URI=mongodb://localhost:27017/adoptme
PORT=8080
JWT_SECRET=tu_jwt_secret_aqui
```

### Ejecutar la Aplicación
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start

# Ejecutar tests
npm test
```

## 📚 Estructura de la API

### 🐾 **Pets - Mascotas**
Gestión completa de mascotas disponibles para adopción.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/pets` | Obtener todas las mascotas |
| `POST` | `/api/pets` | Crear nueva mascota |
| `PUT` | `/api/pets/{pid}` | Actualizar mascota |
| `DELETE` | `/api/pets/{pid}` | Eliminar mascota |
| `POST` | `/api/pets/withimage` | Crear mascota con imagen |

**Ejemplo de uso:**
```javascript
// Crear una nueva mascota
POST /api/pets
{
  "name": "Max",
  "specie": "dog",
  "birthDate": "2020-05-15"
}
```

### 👥 **Users - Usuarios**
Administración de usuarios del sistema.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/users` | Obtener todos los usuarios |
| `GET` | `/api/users/{uid}` | Obtener usuario específico |
| `PUT` | `/api/users/{uid}` | Actualizar usuario |
| `DELETE` | `/api/users/{uid}` | Eliminar usuario |

### 🔐 **Sessions - Autenticación**
Sistema de autenticación y gestión de sesiones.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/sessions/register` | Registrar nuevo usuario |
| `POST` | `/api/sessions/login` | Iniciar sesión |
| `GET` | `/api/sessions/current` | Obtener usuario actual |

**Ejemplo de registro:**
```javascript
POST /api/sessions/register
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "user"
}
```

### ❤️ **Adoptions - Adopciones**
Gestión del proceso de adopción.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/adoptions` | Obtener todas las adopciones |
| `GET` | `/api/adoptions/{aid}` | Obtener adopción específica |
| `POST` | `/api/adoptions/{uid}/{pid}` | Crear nueva adopción |

**Proceso de adopción:**
```javascript
// Adoptar una mascota
POST /api/adoptions/{userId}/{petId}
// No requiere body - los IDs van en la URL
```

### 🎭 **Mocks - Datos de Prueba**
Generación de datos ficticios para testing y desarrollo.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/mocks/mockingpets` | Generar 100 mascotas ficticias |
| `GET` | `/api/mocks/mockingusers` | Generar 50 usuarios ficticios |
| `POST` | `/api/mocks/generateData` | Insertar datos en la base de datos |

**Generar datos de prueba:**
```javascript
// Insertar datos ficticios en la BD
POST /api/mocks/generateData
{
  "users": 10,
  "pets": 15
}
```

## 🔧 Características Técnicas

### Tecnologías Utilizadas
- **Backend**: Node.js con Express
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT + bcrypt
- **Documentación**: Swagger/OpenAPI 3.0
- **Testing**: Mocha + Chai + Supertest
- **Upload de Archivos**: Multer

### Arquitectura del Proyecto
```
src/
├── app.js                 # Configuración principal
├── controllers/           # Lógica de controladores
│   ├── pets.controller.js
│   ├── users.controller.js
│   ├── adoptions.controller.js
│   └── sessions.controller.js
├── dao/                   # Data Access Objects
├── docs/                  # Documentación Swagger
│   ├── Pets.yaml
│   ├── Users.yaml
│   ├── Adoptions.yaml
│   ├── Sessions.yaml
│   └── Mocks.yaml
├── dto/                   # Data Transfer Objects
├── models/                # Modelos de MongoDB
├── repository/            # Capa de repositorio
├── routes/                # Definición de rutas
├── services/              # Lógica de negocio
└── utils/                 # Utilidades y helpers
```

## 🧪 Testing

### Ejecutar Tests
```bash
npm test
```

### Endpoints de Testing
Para facilitar las pruebas, la API incluye endpoints sin protección:
- `GET /api/sessions/unprotectedLogin`
- `GET /api/sessions/unprotectedCurrent`

## 📊 Modelos de Datos

### Pet (Mascota)
```javascript
{
  "_id": "ObjectId",
  "name": "String",
  "specie": "String",
  "birthDate": "Date",
  "adopted": "Boolean",
  "owner": "ObjectId | null",
  "image": "String"
}
```

### User (Usuario)
```javascript
{
  "_id": "ObjectId",
  "first_name": "String",
  "last_name": "String",
  "email": "String",
  "password": "String (encriptada)",
  "role": "String [user|admin]",
  "pets": ["ObjectId"]
}
```

### Adoption (Adopción)
```javascript
{
  "_id": "ObjectId",
  "owner": "ObjectId",
  "pet": "ObjectId"
}
```

## 🚦 Códigos de Respuesta HTTP

| Código | Descripción |
|--------|-------------|
| `200` | Operación exitosa |
| `400` | Solicitud incorrecta (datos faltantes o inválidos) |
| `401` | No autorizado |
| `404` | Recurso no encontrado |
| `500` | Error interno del servidor |

## 📝 Formato de Respuestas

### Respuesta Exitosa
```javascript
{
  "status": "success",
  "payload": { /* datos */ }
}
```

### Respuesta de Error
```javascript
{
  "status": "error",
  "error": "Descripción del error"
}
```

## 🛠️ Desarrollo y Contribución

### Scripts Disponibles
- `npm start` - Ejecutar en producción
- `npm run dev` - Ejecutar en desarrollo con nodemon
- `npm test` - Ejecutar tests

### Flujo de Desarrollo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Realizar cambios y commits
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📞 Soporte

Para soporte técnico o preguntas sobre la API:
- **Email**: support@adoptme.com
- **Documentación**: http://localhost:8080/apidocs

## 📄 Licencia

Este proyecto está bajo la licencia ISC.

---

**¡Adoptme API - Conectando mascotas con familias amorosas! 🐾❤️**