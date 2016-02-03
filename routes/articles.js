var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-5282.firebaseio.com/');

//finds all articles in the DB, sorts by date (newest to oldest)
exports.findAll = function(req, res) {
  //create document ref
  var articlesRef = ref.child('articles');

  //using once() fixes an issue with headers being already sent
  //when new article/comment is saved
  articlesRef.orderByPriority().once("value", function(snapshot) {
    res.json(snapshot.val());
  }, function (errorObject) {
    console.log("Failed getting blog articles: " + errorObject.code);
    res.send("Failed getting blog articles: " + errorObject.code);
  });

};

//finds one article by ID
exports.findById = function(req, res) {
  var id = req.params.id;
  //create reference to article by id, get json once
  var articleRef = ref.child('articles/' + id);

  articleRef.once('value', function(snapshot) {
    res.json(snapshot.val());
  }, function (errorObject) {
    console.log("Failed getting article by ID: " + errorObject.code);
    res.send("Failed getting article by ID: " + errorObject.code);
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
  //set with priority lets us prioritize articles based on date
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
  // var comment = {
  //   name: req.body.name,
  //   comment: req.body.content,
  //   approved: false,
  //   nestedId: ''
  // };
  //
  // var id = req.body.id;
  //
  // Article.findOneAndUpdate(
  //   { "_id": id},
  //   {
  //       "$push": {
  //           "comments": comment
  //       }
  //   },
  //   function(err, comment) {
  //     if (err) {
  //         res.send(err);
  //     }
  //     res.json(comment);
  //   }
  // );


  //article id
  var id = req.body.id;
  //get timestamp to insert into comment date field
  var timestamp = new Date().getTime();
  //makes comments sort from newest to oldest
  var priority = 0 - Date.now();
  //create reference to article comments by id
  var commentsRef = ref.child('articles/' + id + '/comments/');

  var newCommentRef = commentsRef.push();
  //set with priority lets us prioritize comments based on date
  newCommentRef.setWithPriority({
    name: req.body.name,
    date: timestamp,
    comment: req.body.content,
    approved: false,
    nestedId: ''
  },
  priority,
  function(err) {
    if(err) {
       res.send(err);
    } else {
      res.json({message: 'comment saved'});
    }
  });

};
