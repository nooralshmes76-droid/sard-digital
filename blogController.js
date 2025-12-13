const Article = require('../models/Article');

// @desc    Get all published articles
// @route   GET /api/blog
// @access  Public
exports.getArticles = async (req, res) => {
    try {
        const articles = await Article.find({ isPublished: true })
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .select('-content'); // Don't send full content in list view
        res.json(articles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get single published article by slug
// @route   GET /api/blog/:slug
// @access  Public
exports.getArticleBySlug = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug, isPublished: true })
            .populate('author', 'name');

        if (!article) {
            return res.status(404).json({ msg: 'Article not found or not published' });
        }

        res.json(article);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
