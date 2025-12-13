const express = require('express');
const { check } = require('express-validator');
const { getCourses, getCourseById, enrollCourse } = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', getCourses);

// @route   GET /api/courses/:id
// @desc    Get single course by ID
// @access  Public
router.get('/:id', getCourseById);

// @route   POST /api/courses/enroll/:id
// @desc    Enroll in a course
// @access  Private
router.post('/enroll/:id', auth, enrollCourse);

module.exports = router;
