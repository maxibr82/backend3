# 🐳 Docker & Tests - Proyecto Adoptme API

Este proyecto está **dockerizado** para fácil despliegue e incluye una suite completa de **tests unitarios e integración** usando **Mocha** y **Chai**, todos traducidos al español para mayor comprensión.

## 🐳 Docker - Imagen Dockerizada

### **📦 Descargar Imagen desde Docker Hub**

https://hub.docker.com/repository/docker/maxibr82/maxibackend3final/general

#### **Versión 1.0 (Estable)**
```bash
docker pull maxibr82/maxibackend3final:v1.0
```

#### **Versión Latest (Más Reciente)**
```bash
docker pull maxibr82/maxibackend3final:latest
```

### **🚀 Ejecutar Contenedor Docker**

#### **Configuración Básica**
```bash
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://localhost:27017/adoptme \
  maxilbr82/maxibackend3final:v1.0
```

#### **Configuración Detallada**
```bash
docker run -d \
  --name adoptme-api \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e MONGODB_URI=tu_url_de_mongodb_aqui \
  -e PORT=3001 \
  -e JWT_SECRET=tu_jwt_secret_aqui \
  maxilbr82/maxibackend3final:v1.0
```

### **⚙️ Variables de Entorno Requeridas**

| Variable | Descripción | Ejemplo | Requerida |
|----------|-------------|---------|-----------|
| `NODE_ENV` | Entorno de ejecución | `production` | ✅ |
| `MONGODB_URI` | URL de conexión a MongoDB | `mongodb://localhost:27017/adoptme` | ✅ |
| `PORT` | Puerto del servidor | `3001` | ❌ (default: 3001) |
| `JWT_SECRET` | Secreto para JWT | `tu_secreto_jwt` | ✅ |

### **🌐 Acceder a la Aplicación**

Una vez ejecutado el contenedor:

- **API**: http://localhost:3001
- **Documentación Swagger**: http://localhost:3001/apidocs
- **Health Check**: http://localhost:3001/api/health

### **🔧 Comandos Docker Básicos**

```bash
# Ver contenedores ejecutándose
docker ps

# Ver logs del contenedor
docker logs adoptme-api

# Detener contenedor
docker stop adoptme-api

# Eliminar contenedor
docker rm adoptme-api
```

### **📋 Configuración Importante**

**⚠️ IMPORTANTE**: 
- **Puerto**: `3001` (tanto host como contenedor)
- **Variable de Entorno**: `NODE_ENV=production`
- **MongoDB URI**: Configurar tu URL de conexión a MongoDB

---

## 🧪 Tests - Suite Completa de Testing

### **📁 Estructura de Tests**

```
test/
├── unit/                           # Tests unitarios
│   ├── utils.test.js              # ✅ Tests de utilidades (hash, validación)
│   ├── dto.test.js                # ✅ Tests de DTOs (transformación de datos)
│   ├── repository.test.js         # ✅ Tests de repositorio genérico
│   ├── userRepository.test.js     # ✅ Tests específicos del repositorio de usuarios
│   ├── controllers.test.js        # ✅ Tests de controladores de usuarios
│   ├── mockUsers.test.js          # ✅ Tests del generador de usuarios ficticios
│   └── mockPets.test.js           # ✅ Tests del generador de mascotas ficticias
├── integration/                    # Tests de integración
│   ├── api.test.js                # 🔄 Tests de endpoints de API
│   └── adoption.test.js           # ✅ Tests funcionales de adoption router
├── setup.js                       # Configuración global de tests
└── README.md                      # Esta documentación
```

### **🚀 Comandos de Ejecución de Tests**

#### **1. Todos los Tests (Unitarios + Integración)**
```bash
npx mocha
```
**Qué hace**: Ejecuta TODOS los tests del proyecto, incluyendo unitarios e integración.

**Resultado esperado**: ~85 tests pasando (incluyendo 16 tests de adoption router)

#### **2. Solo Tests Unitarios (Mayoría en Español)**
```bash
npx mocha "test/unit/**/*.test.js"
```
**Qué hace**: Ejecuta todos los tests unitarios del proyecto. Incluye validación de funciones, repositorios, controladores y generadores mock.

**Resultado esperado**: ~60+ tests pasando en español

#### **3. Solo Tests de Integración**
```bash
npx mocha "test/integration/**/*.test.js"
```
**Qué hace**: Ejecuta todos los tests de integración, incluyendo los nuevos tests funcionales del router de adoption.

**Resultado esperado**: ~30+ tests pasando, incluyendo 16 tests de adoption router

#### **4. Solo Tests de Adoption Router (Entrega Final)**
```bash
npx mocha --grep "Tests Funcionales - Adoption Router"
```
**Qué hace**: Ejecuta ÚNICAMENTE los 16 tests de adoption router implementados para la entrega final.

**Resultado esperado**: 16 tests pasando ✅

#### **5. Ejecución Individual por Filtros**
```bash
# Solo tests de adoption (16 tests)
npx mocha --grep "adoption"

# Solo tests en español
npx mocha --grep "debería"

# Solo tests de casos exitosos
npx mocha --grep "éxito|exitosa|success"

# Solo tests de validación de errores
npx mocha --grep "404|400|500|error"
```
**Qué hace**: Permite ejecutar subconjuntos específicos de tests usando patrones de texto.

---

### **📋 Tests Específicos por Archivo**

#### **Tests de Utilidades**
```bash
npx mocha test/unit/utils.test.js
```
**Qué testea**:
- ✅ `createHash`: Creación de hash de contraseñas con bcrypt
- ✅ `passwordValidation`: Validación de contraseñas contra hash

**Tests incluidos**:
- Crear hash a partir de contraseña en texto plano
- Crear hashes diferentes para la misma contraseña
- Manejar contraseñas vacías
- Validar contraseñas correctas
- Rechazar contraseñas incorrectas

#### **Tests de DTOs (Data Transfer Objects)**
```bash
npx mocha test/unit/dto.test.js
```
**Qué testea**:
- ✅ `UserDTO.getUserTokenFrom`: Transformación de datos de usuario para tokens

**Tests incluidos**:
- Crear objeto token desde usuario con todos los campos
- Manejar usuarios con nombres vacíos
- Manejar usuarios con nombres indefinidos
- Manejar usuarios con solo nombre
- Retornar todas las propiedades requeridas

#### **Tests de Generador de Usuarios Mock**
```bash
npx mocha test/unit/mockUsers.test.js
```
**Qué testea**:
- ✅ `generateMockUsers`: Generación de usuarios ficticios con Faker

**Tests incluidos**:
- Generar un usuario por defecto
- Generar número especificado de usuarios
- Generar usuarios con propiedades requeridas
- Generar usuarios con formato de email válido
- Generar usuarios con roles válidos
- Generar usuarios con contraseñas hasheadas
- Inicializar array de mascotas como vacío
- Generar usuarios únicos
- Manejar cero usuarios

#### **Tests de Generador de Mascotas Mock**
```bash
npx mocha test/unit/mockPets.test.js
```
**Qué testea**:
- ✅ `generateMockPets`: Generación de mascotas ficticias con Faker

**Tests incluidos**:
- Generar una mascota por defecto
- Generar número especificado de mascotas
- Generar mascotas con propiedades requeridas
- Generar mascotas con fechas de nacimiento válidas
- Generar mascotas con adoptado establecido en falso
- Generar mascotas con cadena de imagen vacía
- Generar mascotas con propietario nulo
- Generar mascotas con nombres y especies no vacíos
- Manejar cero mascotas
- Generar mascotas diferentes

#### **6. Con Timeout Extendido (Si Hay Problemas)**
```bash
npx mocha "test/unit/**/*.test.js" --timeout 20000
```
**Cuándo usar**: Si los tests fallan por timeout (especialmente útil con conexiones de base de datos lentas).

**Qué hace**: Ejecuta tests unitarios con timeout de 20 segundos en lugar del default.

---

### **📊 Tests Adicionales Disponibles**

### **Tests de Repositorio Genérico**
```bash
npx mocha test/unit/repository.test.js
```
**Qué testea**: Funcionalidad CRUD básica del repositorio genérico con mocks.

### **Tests de Repositorio de Usuarios**
```bash
npx mocha test/unit/userRepository.test.js
```
**Qué testea**: Métodos específicos como `getUserByEmail` y `getUserById`.

### **Tests de Controladores**
```bash
npx mocha test/unit/controllers.test.js
```
**Qué testea**: Controladores de usuarios, manejo de respuestas HTTP y errores.

### **Tests de Integración de API**
```bash
npx mocha test/integration/api.test.js
```
**Qué testea**: Endpoints reales de la API, respuestas HTTP completas.

### **Tests Funcionales de Adoption Router**
```bash
npx mocha test/integration/adoption.test.js
```
**Qué testea**: Tests funcionales completos para todos los endpoints del router `adoption.router.js`:
- ✅ `GET /api/adoptions` - Obtener todas las adopciones
- ✅ `GET /api/adoptions/:aid` - Obtener adopción específica
- ✅ `POST /api/adoptions/:uid/:pid` - Crear nueva adopción
- ✅ Casos de error (404, 400, 500)
- ✅ Validaciones de integridad de datos
- ✅ Verificación de consistencia entre adopciones, usuarios y mascotas

**Tests incluidos**: 16 tests que cubren casos de éxito, error y edge cases.

**⚠️ Nota**: Al ejecutar este comando, Mocha ejecuta automáticamente **TODOS los tests** del proyecto (unitarios + integración = ~87 tests). Los 16 tests de adoption router **SIEMPRE pasan ✅**, los únicos 2 que fallan son tests pre-existentes del endpoint mocks (no relacionados con adoption).

### **🎯 Ejecutar Solo Tests de Adoption (Individual)**

Si necesitas ejecutar ÚNICAMENTE los tests de adoption router:

#### **Opción 1: Por nombre de suite**
```bash
npx mocha --grep "Tests Funcionales - Adoption Router"
```
**Resultado**: Solo los 16 tests de adoption router

#### **Opción 2: Por patrón de texto**
```bash
npx mocha --grep "adoption|Adoption"
```
**Resultado**: Tests que contengan "adoption" o "Adoption" en su descripción

#### **Opción 3: Por endpoint específico**
```bash
# Solo tests de GET /api/adoptions
npx mocha --grep "GET \/api\/adoptions"

# Solo tests de POST /api/adoptions
npx mocha --grep "POST \/api\/adoptions"

# Solo tests de casos de error
npx mocha --grep "404|400|500"
```

#### **Opción 4: Combinar archivo + filtro**
```bash
npx mocha test/integration/adoption.test.js --grep "debería crear adopción"
```

---

## 🛠️ Tecnologías Utilizadas

### **Testing**
- **Mocha**: Framework de testing
- **Chai**: Biblioteca de aserciones (`expect`)
- **Sinon**: Para mocks, stubs y spies
- **Supertest**: Para testing de API HTTP
- **Faker**: Generación de datos ficticios
- **NYC**: Para cobertura de código

### **Containerización**
- **Docker**: Containerización de la aplicación
- **Docker Hub**: Registro de imágenes (`maxilbr82/maxibackend3final`)
- **Multi-stage builds**: Optimización de imagen
- **Environment variables**: Configuración flexible

---

## 📈 Estado Actual de los Tests

### ✅ **Tests Unitarios**: 
- **Estado**: Funcionando perfectamente
- **Idioma**: Español
- **Cantidad**: ~60+ tests
- **Cobertura**: Utilidades, DTOs, Repositorios, Controladores, Generadores Mock

### 🔄 **Tests de Integración**:
- **Estado**: Funcionando con 2 tests pendientes de ajuste
- **Idioma**: Parcialmente en español
- **Cantidad**: ~15+ tests
- **Cobertura**: Endpoints de API, Swagger, Mocks

---

## 🚨 Solución de Problemas

### **Si los tests fallan por timeout:**
```bash
npx mocha "test/unit/**/*.test.js" --timeout 30000
```

### **Si hay problemas de conexión a MongoDB:**
```bash
NODE_ENV=test npx mocha "test/unit/**/*.test.js"
```

### **Para ejecutar un solo test específico:**
```bash
npx mocha test/unit/utils.test.js --grep "debería crear un hash"
```

### **Para ejecutar tests en modo watch (auto-ejecuta al cambiar código):**
```bash
npx mocha "test/unit/**/*.test.js" --watch
```

### **Opciones avanzadas de filtrado:**

#### **Solo tests que pasen (ignorar los que fallan):**
```bash
npx mocha --grep "adoption" --bail
```

#### **Ejecutar tests con descripción específica:**
```bash
# Solo tests de validación
npx mocha --grep "validación|validation"

# Solo tests en español
npx mocha --grep "debería|should"

# Solo tests de integración sin mocks
npx mocha test/integration/adoption.test.js --grep -v "mock"
```

#### **Tests por tipo de operación:**
```bash
# Solo tests de endpoints GET
npx mocha --grep "GET"

# Solo tests de casos de error
npx mocha --grep "error|Error|404|400|500"

# Solo tests de casos exitosos
npx mocha --grep "exitosa|success|éxito"
```

---

## 🎯 Ejemplos de Salida Esperada

Al ejecutar `npx mocha test/unit/utils.test.js`, deberías ver:

```
  Utilidades - Gestión de Contraseñas
    createHash
      ✔ debería crear un hash a partir de una contraseña en texto plano (70ms)
      ✔ debería crear hashes diferentes para la misma contraseña (134ms)
      ✔ debería manejar contraseñas vacías (69ms)
    passwordValidation
      ✔ debería validar contraseñas correctas (135ms)
      ✔ debería rechazar contraseñas incorrectas (134ms)
      ✔ debería rechazar contraseñas vacías contra hash válido (135ms)

  6 passing (700ms)
```

---

## 📝 Notas Importantes

1. **Configuración automática**: Los tests cargan automáticamente las variables de entorno
2. **Base de datos de prueba**: Se recomienda usar una BD separada para testing
3. **Mocks incluidos**: Los tests unitarios no dependen de servicios externos
4. **Traducción completa**: Todos los mensajes de tests están en español
5. **Performance**: Los tests unitarios son rápidos (<1s cada uno)

---

## 🔧 Scripts npm y Docker Alternativos

### **Scripts de Testing**
Si prefieres usar npm en lugar de npx:

```bash
# Actualizar package.json con estos scripts
npm run test:unit      # Equivale a: npx mocha "test/unit/**/*.test.js"
npm run test           # Equivale a: npx mocha
npm run test:watch     # Equivale a: npx mocha --watch
npm run test:coverage  # Genera reporte de cobertura
```

### **Scripts de Docker**
Comandos alternativos para gestión de Docker:

```bash
# Scripts recomendados para package.json
npm run docker:pull     # docker pull maxilbr82/maxibackend3final:v1.0
npm run docker:run      # docker run con configuración completa
npm run docker:stop     # docker stop adoptme-api
npm run docker:logs     # docker logs adoptme-api
```

---

## 🎉 ¡Proyecto Listo!

- **✅ Tests completos**: Unitarios e integración funcionando
- **✅ Docker configurado**: Imagen disponible en Docker Hub
- **✅ Documentación completa**: Tests y Docker documentados
- **✅ Adoption router**: Tests funcionales implementados

**🚀 Para empezar rápidamente:**

1. **Ejecutar con Docker**: `docker run -p 3001:3001 -e NODE_ENV=production -e MONGODB_URI=tu_mongodb_uri maxilbr82/maxibackend3final:v1.0`
2. **Ejecutar tests**: `npx mocha test/integration/adoption.test.js`
3. **Ver documentación**: http://localhost:3001/apidocs
