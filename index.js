// Required dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blog-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Add request validation middleware
const validateRequest = (req, res, next) => {
    const { title, content, category } = req.body;
    const errors = [];

    if (req.method === 'POST' || req.method === 'PUT') {
        if (!title) errors.push('Title is required');
        if (!content) errors.push('Content is required');
        if (!category) errors.push('Category is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

// Add response standardization
const standardResponse = (res, status, data, message = '') => {
    return res.status(status).json({
        status: status,
        message,
        data
    });
};

// Blog Post Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Post = mongoose.model('Post', postSchema);

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: Object.values(err.errors).map(e => e.message)
        });
    }
    next(err);
};

// Create a new blog post
app.post('/posts', validateRequest, async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        standardResponse(res, 201, post, 'Post created successfully');
    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Update an existing blog post
app.put('/posts/:id', validateRequest, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!post) {
            return standardResponse(res, 404, null, 'Post not found');
        }
        
        standardResponse(res, 200, post, 'Post updated successfully');
    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Delete a blog post
app.delete('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        res.status(204).send();
    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Get a single blog post
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return standardResponse(res, 404, null, 'Post not found');
        }
        
        standardResponse(res, 200, post);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Get all blog posts with optional search
app.get('/posts', async (req, res) => {
    try {
        const { term } = req.query;
        let query = {};
        
        if (term) {
            query = {
                $or: [
                    { title: { $regex: term, $options: 'i' } },
                    { content: { $regex: term, $options: 'i' } },
                    { category: { $regex: term, $options: 'i' } }
                ]
            };
        }
        
        const posts = await Post.find(query);
        standardResponse(res, 200, posts);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});