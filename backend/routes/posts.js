const exporess = require("express");
const multer = require('multer');

const Post = require('../models/post');
const router = exporess.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let error = new Error('Invalid mime type');
        const isValid = MIME_TYPE_MAP[file.mimetype];
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images"); // relative to server.js
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, `${name} - ${Date.now()} .${ext}`);
    }
});

router.post('', multer({ storage }).single("image"), (req, res, next) => {
    const url = `${req.protocol}://${req.get('host')}`; 
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: `${url}/images/${req.file.filename}`,
    });
    post.save()
        .then((createdPost) => {
            res.status(201).json({
                message: 'Post Added Sucessfully!',
                post: {
                    ...createdPost,
                    id: createdPost._id,
                }
            });
        });
});


router.get('', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(posts => {
            fetchedPosts = posts;
            return Post.count();
        })
        .then((maxPosts) => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: fetchedPosts,
                maxPosts,
            });
        });
});

router.put('/:id',
    multer({ storage }).single("image"),
    (req, res, next) => {
        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = `${req.protocol}://${req.get('host')}`; 
            imagePath = `${url}/images/${req.file.filename}`;
        }
        const post = new Post({
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath,
        })
        Post.updateOne({ _id: req.params.id }, post)
            .then(result => {
                res.status(200).json({ message: 'Post updated!' });
            });
    });

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found!' })
            }
        })
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Post.deleteOne({
        _id: id,
    })
        .then((result) => {
            res.status(200).json({
                message: 'Post Deleted!'
            });
        });
});

module.exports = router;
