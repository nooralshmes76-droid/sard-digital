const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String },
    type: { type: String, enum: ['Online', 'In-Person'], default: 'Online' },
    price: { type: Number, default: 0 }, // 0 for free
    duration: { type: String },
    hasCertificate: { type: Boolean, default: false },
    instructor: { type: String },
    sessions: [{ type: String }], // Array of session dates/times
    learningObjectives: [{ type: String }],
    
    // Enrollment tracking
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
