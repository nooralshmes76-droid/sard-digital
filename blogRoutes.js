const express = require('express');
const { getArticles, getArticleBySlug } = require('../controllers/blogController');
const router = express.Router();

// @route   GET /api/blog
// @desc    Get all published articles
// @access  Public
router.get('/', getArticles);

// @route   GET /api/blog/:slug
// @desc    Get single published article by slug
// @access  Public
router.get('/:slug', getArticleBySlug);

module.exports = router;
