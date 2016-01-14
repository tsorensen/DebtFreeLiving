var express = require('express');
var app = express();
var router = express.Router();
var blog = require('./routes/articles');

//using multer for image/text uploads, supports multipart-data
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/static/images/uploads');
  },
  filename: function (req, file, cb) {
    var name = file.originalname.split('.')[0];
    var ext = file.mimetype.split('/')[1];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});
var upload = multer({ storage: storage });

//API routes
router.get('/articles', blog.findAll);
router.post('/articles', upload.single('file'), blog.insertArticle);
router.get('/articles/:id', blog.findById);
router.post('/comments', upload.single(), blog.saveComment);

//Use
app.use('/api', router);
app.use(express.static('build'));

//Port it listens on
var port = 8000;
app.listen(port);
