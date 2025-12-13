const express = require('express');
const { check } = require('express-validator');
const { getStats, upsertArticle, deleteArticle, upsertCourse, deleteCourse, checkAdmin } = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Middleware to ensure user is logged in AND is an Admin
const adminAuth = [auth, checkAdmin];

// @route   GET /api/admin/stats
// @desc    Get Admin Dashboard Stats
// @access  Private/Admin
router.get('/stats', adminAuth, getStats);

// --- Article Management ---

// @route   POST /api/admin/articles
// @desc    Create a new article
// @access  Private/Admin
router.post('/articles', adminAuth, [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
], upsertArticle);

// @route   PUT /api/admin/articles/:id
// @desc    Update an existing article
// @access  Private/Admin
router.put('/articles/:id', adminAuth, upsertArticle);

// @route   DELETE /api/admin/articles/:id
// @desc    Delete an article
// @access  Private/Admin
router.delete('/articles/:id', adminAuth, deleteArticle);

// --- Course Management ---

// @route   POST /api/admin/courses
// @desc    Create a new course
// @access  Private/Admin
router.post('/courses', adminAuth, [
    check('title', 'Title is required').not().isEmpty(),
    check('shortDescription', 'Short description is required').not().isEmpty(),
], upsertCourse);

// @route   PUT /api/admin/courses/:id
// @desc    Update an existing course
// @access  Private/Admin
router.put('/courses/:id', adminAuth, upsertCourse);

// @route   DELETE /api/admin/courses/:id
// @desc    Delete a course
// @access  Private/Admin
router.delete('/courses/:id', adminAuth, deleteCourse);

module.exports = router;
