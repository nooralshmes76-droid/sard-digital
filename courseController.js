const Course = require('../models/Course');
const { validationResult } = require('express-validator');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().select('-enrolledUsers');
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).select('-enrolledUsers');

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Enroll in a course (Placeholder for payment/registration logic)
// @route   POST /api/courses/enroll/:id
// @access  Private
exports.enrollCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if user is already enrolled
        if (course.enrolledUsers.includes(req.user.id)) {
            return res.status(400).json({ msg: 'User already enrolled in this course' });
        }

        // --- Payment/Registration Logic Placeholder ---
        // In a real application, this is where payment processing (if price > 0)
        // or detailed registration form handling would occur.
        // For now, we assume successful registration/payment.
        
        course.enrolledUsers.push(req.user.id);
        await course.save();

        res.json({ msg: 'Successfully enrolled in the course', course: course.title });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
