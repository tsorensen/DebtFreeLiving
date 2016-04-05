var express = require('express');
var app = express();

app.use(express.static('build'));

//Port it listens on
var port = 8000;
app.listen(port, function() {
  console.log('\n    Server listening on port ' + port + '\n');
});
