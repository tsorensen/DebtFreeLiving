// var mongoose = require('mongoose');
// mongoose.connect('mongodb://admin:1234@ds053184.mongolab.com:53184/mean-blog');
// var Article = require('./../models/article');

var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-5282.firebaseio.com/');

//finds all articles in the DB, sorts by date (newest to oldest)
exports.findAll = function(req, res) {
  var articlesRef = ref.child('articles');

  articlesRef.orderByPriority().on("value", function(snapshot) {
    res.json(snapshot.val());
  }, function (errorObject) {
    res.send("Failed getting blog articles: " + errorObject.code);
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
  //image is optional
  var img;
  if(typeof req.file != 'undefined') {
    img = req.file.filename;
  } else {
    img = "";
  }

  //get child node "articles" from firebase
  var articlesRef = ref.child("articles");

  //get timestamp to insert into article date field
  var timestamp = new Date().getTime();

  //makes articles sort from newest to oldest
  var priority = 0 - Date.now();

  var newArticleRef = articlesRef.push();
  newArticleRef.setWithPriority({
      title: req.body.title,
      author: req.body.author,
      date: timestamp,
      category: req.body.category,
      body: req.body.content,
      image: img,
      comments: "",
  },
  priority,
  function(err) {
    if(err) {
       res.send(err);
    } else {
      res.json({ message: 'Article saved!' });
    }
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
