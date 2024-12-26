const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Application Tests', () => {
    it('should return true for a valid condition', () => {
        expect(true).toBe(true);
    });
});

describe('Blog Post API', () => {
    let postId;

    const testPost = {
        title: 'Test Post',
        content: 'Test Content',
        category: 'Test',
        tags: ['test']
    };

    test('POST /posts - Create new post', async () => {
        const response = await request(app)
            .post('/posts')
            .send(testPost);
        
        expect(response.status).toBe(201);
        expect(response.body.data.title).toBe(testPost.title);
        postId = response.body.data._id;
    });

    test('GET /posts/:id - Get single post', async () => {
        const response = await request(app)
            .get(`/posts/${postId}`);
        
        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe(testPost.title);
    });

    test('PUT /posts/:id - Update post', async () => {
        const response = await request(app)
            .put(`/posts/${postId}`)
            .send({ ...testPost, title: 'Updated Title' });
        
        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe('Updated Title');
    });

    test('GET /posts - Search posts', async () => {
        const response = await request(app)
            .get('/posts?term=test');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBeTruthy();
    });

    test('DELETE /posts/:id - Delete post', async () => {
        const response = await request(app)
            .delete(`/posts/${postId}`);
        
        expect(response.status).toBe(204);
    });
});