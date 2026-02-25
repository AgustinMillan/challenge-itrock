---

# 🚀 Challenge Backend – Serverless API

**Node.js + Express + TypeScript + PostgreSQL**

Este proyecto implementa una API REST para la gestión de tareas, desarrollada en **TypeScript**, siguiendo principios de **arquitectura serverless** (stateless, event-driven) y preparada para ejecutarse tanto en entorno local como en un entorno serverless usando **Serverless Framework**.

---

## 📦 Requisitos

- Node.js >= 18
- Docker + Docker Compose
- npm

---

## ⚙️ Instalación

Clonar el repositorio e instalar dependencias:

```bash
git clone <repo-url>
cd challenge-itrock
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=challenge
DB_PASSWORD=challenge
DB_NAME=challenge_db
JWT_SECRET=supersecret
```

Levantar la base de datos en Docker:

```bash
docker-compose up -d
```

---

## ▶️ Ejecución local (Express)

Compilar el proyecto en TypeScript y levantar el servidor:

```bash
npm run build
npm run dev
```

La API quedará disponible en:

```
http://localhost:3000
```

---

## ☁️ Ejecución en modo Serverless (local)

La API puede ejecutarse simulando un entorno serverless usando Serverless Framework:

```bash
npm run dev:serverless
```

La API quedará disponible en:

```
http://localhost:3000
```

> La aplicación Express en TypeScript es adaptada a AWS Lambda mediante `serverless-http` y ejecutada localmente con `serverless-offline`.

---

## 🧪 Ejemplos de uso (curl)

### Health check

```bash
curl http://localhost:3000/health
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### Crear tarea

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "title": "Mi primera tarea",
    "description": "Colgar la ropa"
  }'
```

### Listar tareas

```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:3000/tasks
```

### Importar tareas vía API

```bash
curl -X POST http://localhost:3000/tasks/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
```

### Más endpoints

```bash
Revisar coleccion en postman.
```

### 📄 Paginación y filtros

El endpoint `GET /tasks` soporta:

- Paginación mediante `page` y `limit`
- Filtros por estado (`completed`)
- Filtros por rango de fechas (`from`, `to`)

Ejemplo:

GET /tasks?page=1&limit=10&completed=true&from=2026-02-20T21:00:03.000Z&to=2026-02-25T21:00:03.000Z

La respuesta incluye metadata de paginación:

{
"data": [...],
"meta": {
"page": 1,
"limit": 10,
"total": 57,
"totalPages": 6
}
}

### 🧪 Usuario estático para pruebas de aislamiento

Para facilitar las pruebas de aislamiento de datos entre usuarios (multi-tenant), se incluye un mecanismo de autenticación simple basado en credenciales estáticas definidas por entorno:

APP_USERNAME=challenge_user  
APP_PASSWORD=challenge_pass

Cuando estas variables están presentes, el sistema permite autenticarse con este usuario fijo, lo cual facilita:

- Validar que un usuario no pueda acceder a tareas de otro usuario.
- Probar eliminación y modificación de recursos con control de ownership.
- Simular escenarios multiusuario sin necesidad de implementar un sistema completo de gestión de usuarios.

Este mecanismo está pensado exclusivamente para entornos de desarrollo/prueba y no para producción.

---

## 🧠 Decisiones técnicas

### 🏗️ Arquitectura Serverless

**Stateless**
La API no mantiene estado en memoria entre requests. Toda la información necesaria se obtiene del request, JWT o base de datos.

**Event-driven (conceptual)**
Las acciones de negocio relevantes (por ejemplo creación de tareas o importación vía API) están preparadas para emitir eventos internos, permitiendo desacoplar futuras responsabilidades como notificaciones, métricas o auditoría.
En un entorno productivo, este mecanismo podría reemplazarse por un broker de eventos (SNS/SQS, Kafka, etc.).

**Cold starts y conexiones**
La conexión a PostgreSQL se inicializa fuera del handler de la Lambda para permitir reutilización del runtime cuando el contenedor se mantiene caliente.
Se utiliza un pool de conexiones para evitar el overhead de abrir una conexión por request, lo cual es crítico en entornos serverless.

---

### ⚙️ Express + Serverless Framework

- Se utiliza **Express** para simplicidad y legibilidad.
- La aplicación está desarrollada en **TypeScript** para mejorar mantenibilidad, tipado estático y escalabilidad.
- La API se adapta a AWS Lambda mediante `serverless-http`.
- `serverless-offline` permite ejecutar la API localmente simulando API Gateway + Lambdas.
- La lógica de negocio permanece desacoplada de la infraestructura cloud.

---

### 🗄️ Base de datos (PostgreSQL)

- Se utiliza **PostgreSQL** por ser un motor robusto, transaccional y ampliamente soportado.
- La conexión se gestiona mediante `pg` con pool de conexiones.
- La base se ejecuta localmente en Docker para facilitar la prueba del proyecto.

---

### ✅ Validaciones y manejo de errores

- Validaciones de entrada en handlers mediante **Zod**.
- Middleware global de manejo de errores para evitar `try/catch` repetitivos en los endpoints.
- Separación clara de capas:
  `handlers → services → repositories`.

---

## 🧱 Estructura del proyecto

```txt
src/
  app.ts
  server.ts
  lambda.ts
  routes/
  handlers/
  services/
  repositories/
  db/
  events/
```

---

## 📌 Notas finales

- El proyecto está preparado para ser desplegado en un entorno serverless real (AWS Lambda + API Gateway).
- La arquitectura permite evolucionar hacia un modelo event-driven real sin modificar la lógica de negocio.
- Se priorizó claridad, separación de responsabilidades y decisiones técnicas justificadas por sobre complejidad innecesaria.
