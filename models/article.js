var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//comment schema which is nested within the article schema
var CommentSchema = new Schema({
    name: String,
    comment: String,
    date: { type: Date, default: Date.now },
    approved: Boolean,
    nestedId: String
});

var ArticleSchema   = new Schema({
    title: String,
    author: String,
    category: String,
    date: { type: Date, default: Date.now },
    image: String,
    body: String,
    comments: [CommentSchema]
});

module.exports = mongoose.model('Article', ArticleSchema);
