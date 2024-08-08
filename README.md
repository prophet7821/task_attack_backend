# ByteBloom Blog Platform(Backend)

## Description
Bytebloom is where users can sign up, log in, and post articles. The platform allows users to view all posts and filter them by author. The backend is built using NestJS, which is a framework built on Node & Express.

## Tech Stack
- **Backend**: NestJS
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Minimum Requirements
- Node.js (>=14.x)
- Docker and Docker Compose
- Yarn
- MongoDB (>=4.x) (if not using Docker)

## Setup Instructions

### Environment Variables
Create a `.env` file in the root directory and add the following environment variables:

```env
JWT_SECRET=secret
JWT_EXPIRES_IN=7d
MONGO_URI=mongodb://localhost:27017/bytebloom
```

### MongoDB Setup
If you don't have MongoDB installed, you can use Docker to run it:

```bash 
docker-compose up -d
```

### Package Installation

```bash
yarn install
```

### Running the Application

```bash
yarn start:dev
```
The server will start on http://localhost:3030.

## API Definition

| Method | Endpoint      | Body Params                                                  | Query Params | Description                          | Expected Response             | Protected |
|--------|---------------|--------------------------------------------------------------|--------------|--------------------------------------|-------------------------------|-----------|
| POST   | `/v1/login`   | `{ "email": "user@example.com", "password": "password" }`    |              | Logs in a user                      | `{ "token": "JWT_TOKEN" }`    | No        |
| POST   | `/v1/signup`  | `{ "fullName": "User Name", "email": "user@example.com", "password": "password" }` |              | Registers a new user                | `{ "id": "USER_ID" }`         | No        |
| GET    | `/v1/profile` |                                                              |              | Gets the profile of authenticated user | `{ "id": "USER_ID", "fullName": "User Name", "email": "user@example.com" }` | Yes       |
| GET    | `/v1/post`    |                                                              | `page` (optional), `limit` (optional), `author` (optional), `authorName` (optional) | Retrieves all posts with optional pagination and author filtering | `[ { "id": "POST_ID", "title": "Title", "content": "Content", "authorId": "AUTHOR_ID" } ]` | No        |
| GET    | `/v1/post/:id`|                                                              |              | Retrieves a post by its ID          | `{ "id": "POST_ID", "title": "Title", "content": "Content", "authorId": "AUTHOR_ID" }` | No        |
| POST   | `/v1/post`    | `{ "title": "Title", "content": "Content" }` |              | Creates a new post (requires authentication) | `{ "id": "POST_ID", "title": "Title", "content": "Content", "authorId": "AUTHOR_ID" }`   | Yes       |


