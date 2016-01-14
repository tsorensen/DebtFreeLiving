var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:1234@ds053184.mongolab.com:53184/mean-blog');
var Article = require('./../models/article');

//finds all articles in the DB, sorts by date (newest to oldest)
exports.findAll = function(req, res) {
  Article.find({}, null, {sort: {date: -1}}, function(err, articles) {
    if (err) {
        res.send(err);
    }
    res.json(articles);
  });
};

//finds one article by ID
exports.findById = function(req, res) {
  var id = req.params.id;

  Article.findById(id, function (err, article) {
    if (err) {
        res.send(err);
    }
    res.json(article);
  });
};

//inserts a new article to the DB
exports.insertArticle = function(req, res, next) {
  var article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.category = req.body.category;
  article.body = req.body.content;

  //image is optional
  if(typeof req.file != 'undefined') {
    article.image = req.file.filename;
  }

  article.save(function(err) {
    if (err) {
        res.send(err);
    }
    res.json({ message: 'Article saved!' });
  });
};

//inserts a new comment to an article document
exports.saveComment = function(req, res, next) {
  var comment = {
    name: req.body.name,
    comment: req.body.content,
    approved: false,
    nestedId: ''
  };

  var id = req.body.id;

  Article.findOneAndUpdate(
    { "_id": id},
    {
        "$push": {
            "comments": comment
        }
    },
    function(err, comment) {
      if (err) {
          res.send(err);
      }
      res.json(comment);
    }
  );

};
