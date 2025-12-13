const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true }, // For clean URLs
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['Literature', 'Thought', 'Philosophy', 'Book Reviews', 'Interviews', 'Other'], default: 'Other' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
