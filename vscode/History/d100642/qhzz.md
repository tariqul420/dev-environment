# Prisma TypeScript Starter

This project provides a robust and scalable starter template for building RESTful APIs using **TypeScript**, **Express.js**, and **Prisma ORM**.

## Features

- **TypeScript**: Strongly typed JavaScript for better code quality and maintainability.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **Prisma ORM**: Next-generation ORM for Node.js and TypeScript, providing type-safe database access.
- **ESLint & Prettier**: Code linting and formatting for consistent code style.
- **Nodemon**: Automatically restarts the server on file changes during development.
- **Environment Variables**: Secure configuration using `dotenv`.
- **Authentication**: JWT-based authentication middleware.
- **Error Handling**: Centralized error handling middleware.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or any other database supported by Prisma)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/prisma-ts-starter.git
   cd prisma-ts-starter
   ```
2. Install dependencies:
   ```bash
   npm install
   # or yarn install
   ```

### Environment Variables

Create a `.env` file in the root directory based on `.env.example` and fill in your database URL and JWT secret:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Authentication Settings
TOKEN_SECRET=
TOKEN_NAME=

# MongoDB Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase?schema=public
```

### Database Setup

1. Generate Prisma client and apply migrations:
   ```bash
   npm run prisma:migrate
   # or yarn prisma:migrate
   ```
2. Open Prisma Studio to view your database:
   ```bash
   npm run prisma:studio
   # or yarn prisma:studio
   ```

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the development server with Nodemon.
- `npm run start`: Builds the project and starts the production server.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm run format`: Formats code using Prettier.
- `npm run lint`: Lints code using ESLint.
- `npm run lint:fix`: Lints and fixes code using ESLint.
- `npm run prisma:generate`: Generates Prisma client.
- `npm run prisma:migrate`: Applies database migrations.
- `npm run prisma:studio`: Opens Prisma Studio.

## Project Structure

```
.env.example
.eslintrc.js
.gitignore
.prettierrc
package.json
tsconfig.json
prisma/
├── schema.prisma
└── migrations/
src/
├── config/
│   └── config.ts
├── controllers/
│   └── user-controller.ts
├── lib/
│   └── prisma.ts
├── middlewares/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── routes/
│   └── user-route.ts
├── types/
│   ├── index.d.ts
│   └── user.d.ts
└── server.ts
```

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [JWT](https://jwt.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Nodemon](https://nodemon.io/)

## License

This project is licensed under the [MIT License](LICENSE).
