# Project OD

This project is a web application built with Next.js. It includes user authentication, request management, and messaging functionalities.

## Features

- **User Authentication**: Secure login and registration using NextAuth.js.
- **Request Management**: Create, view, edit, and delete requests.
- **Messaging**: Send and receive messages related to requests.
- **Profile Management**: Update user profile information.
- **Role-Based Access Control**: Different functionalities based on user roles (Admin, Dispatcher, Manager).
- **Admin Dashboard**: Manage users and requests with an intuitive interface.
- **Database Management**: Uses Prisma as the ORM with PostgreSQL as the primary database.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- NextAuth.js for authentication
- Radix UI for components
- Prisma for database management
- PostgreSQL (or your configured database)

## Database

The application uses Prisma as the ORM and supports PostgreSQL as the primary database. Ensure your database is properly configured in the `.env` file by updating the `DATABASE_URL` variable.

## API Endpoints

### `POST /api/auth/register`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
    - `201`: User created successfully.
    - `400`: Username and password are required.
    - `409`: User with this username already exists.
    - `500`: An unexpected error occurred.

## Setup

To work with this application, you need to set up a `.env` file. You can use the `.env.example` file as a template.

### Environment Variables

Create a `.env` file with the following variables:

```
NEXTAUTH_SECRET=<your key> # or your secret
NEXTAUTH_URL=http://localhost:3000 # or your domain
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
```

## Deployment

For detailed instructions on how to deploy the project with NextAuth, refer to the [NextAuth.js Deployment Documentation](https://next-auth.js.org/deployment).

For detailed instructions on how to deploy the project with Next.js, refer to the [Next.js Deployment Documentation](https://nextjs.org/docs/14/app/building-your-application/deploying).

For database deployment, ensure your PostgreSQL instance is properly configured and accessible.

## Additional Notes
- The `admin` section of the application includes tools for managing users and requests.
- The `requests` module now supports advanced filtering and sorting.
- The `profile` module includes enhanced validation for user data.