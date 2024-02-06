const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pavalan_micapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define BlogPost model
const BlogPost = mongoose.model('BlogPost', {
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});

// EJS setup
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: -1 });
        res.render('index', { posts });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = new BlogPost({ title, content });
        await post.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.get('/edit/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        res.render('edit', { post });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.post('/edit/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        await BlogPost.findByIdAndUpdate(req.params.id, { title, content });
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.post('/delete/:id', async (req, res) => {
    try {
        await BlogPost.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
