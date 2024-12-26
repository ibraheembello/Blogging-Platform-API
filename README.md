# Blogging Platform API

A RESTful API for a personal blogging platform that supports CRUD operations for blog posts.

## Project Source

This project is based on the Backend Development Project from [roadmap.sh](https://roadmap.sh/projects/blogging-platform-api)

## Features

- Create new blog posts
- Update existing posts
- Delete posts
- Get single post by ID
- Get all posts
- Search posts by term
- Input validation
- Error handling

## API Endpoints

- `POST /posts` - Create a new blog post
- `PUT /posts/:id` - Update an existing post
- `DELETE /posts/:id` - Delete a post
- `GET /posts/:id` - Get a single post
- `GET /posts` - Get all posts
- `GET /posts?term=search` - Search posts

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Jest for testing

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start MongoDB locally
4. Run the server: `npm start`
5. Run tests: `npm test`
