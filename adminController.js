const Article = require('../models/Article');
const Course = require('../models/Course');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Utility to check if user is Admin
const checkAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
    next();
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const postCount = await require('../models/Post').countDocuments();
        const articleCount = await Article.countDocuments();
        const courseCount = await Course.countDocuments();

        res.json({
            userCount,
            postCount,
            articleCount,
            courseCount,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Article Management ---

// @desc    Create/Update Article
// @route   POST /api/admin/articles
// @route   PUT /api/admin/articles/:id
// @access  Private/Admin
exports.upsertArticle = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, tags, isPublished, slug } = req.body;
    const articleFields = {
        title,
        content,
        category,
        tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
        isPublished: isPublished || false,
        slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        author: req.user.id,
        updatedAt: Date.now(),
    };

    try {
        let article;
        if (req.params.id) {
            // Update
            article = await Article.findByIdAndUpdate(
                req.params.id,
                { $set: articleFields },
                { new: true }
            );
            if (!article) return res.status(404).json({ msg: 'Article not found' });
        } else {
            // Create
            article = new Article(articleFields);
            await article.save();
        }
        res.json(article);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete Article
// @route   DELETE /api/admin/articles/:id
// @access  Private/Admin
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) return res.status(404).json({ msg: 'Article not found' });
        res.json({ msg: 'Article removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Course Management ---

// @desc    Create/Update Course
// @route   POST /api/admin/courses
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
exports.upsertCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const courseFields = req.body;
    courseFields.updatedAt = Date.now();

    try {
        let course;
        if (req.params.id) {
            // Update
            course = await Course.findByIdAndUpdate(
                req.params.id,
                { $set: courseFields },
                { new: true }
            );
            if (!course) return res.status(404).json({ msg: 'Course not found' });
        } else {
            // Create
            course = new Course(courseFields);
            await course.save();
        }
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete Course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        res.json({ msg: 'Course removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Export the admin check utility for use in routes
exports.checkAdmin = checkAdmin;
