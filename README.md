# Project OD

This project is a web application built with Next.js. It includes user authentication, request management, and messaging functionalities.

## Features

- **User Authentication**: Secure login and registration using NextAuth.js.
- **Request Management**: Create, view, edit, and delete requests.
- **Messaging**: Send and receive messages related to requests.
- **Profile Management**: Update user profile information.
- **Role-Based Access Control**: Different functionalities based on user roles (Admin, Dispatcher, Manager).

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- NextAuth.js for authentication
- Radix UI for components
- json-server for the database (will be updated when placed to a real server)

## Database

Currently, the database is implemented using json-server. This will be updated to a real server in the future.

## Setup

To work with this application, you need to set up a `.env` file. You can use the `.env.example` file as a template.

### Environment Variables

Create a `.env` file with the following variables:

```
NEXTAUTH_SECRET=<your key> # or your secret
NEXTAUTH_URL=http://localhost:3000 # or your domain
```

## Deployment

For detailed instructions on how to deploy the project with NextAuth, refer to the [NextAuth.js Deployment Documentation](https://next-auth.js.org/deployment).

For detailed instructions on how to deploy the project with Next.js, refer to the [Next.js Deployment Documentation](https://nextjs.org/docs/14/app/building-your-application/deploying).