var config = require('./config.production.json')
  , express = require('express')
  , cors = require('cors')
  , app = express()
  ;


var authorize = require('oauth2resource')(config);


app.configure(function () {
  app.use(express.bodyParser());
  app.use(cors());
  app.use(app.router);
  app.use(function (err, req, res, next) {
    res.send(err.statusCode || 500, err);
  })
});

// database
var profiles = {};

// retrieve the profile
app.get('/v1/profile', authorize, function (req, res) {
  res.json(profiles[req.token.account_id] || {});
});

// set the profile 
app.put('/v1/profile', authorize, function (req, res) {
  profiles[req.token.account_id] = req.body;
  res.json({ ok: true });
});



module.exports = app;

if (!module.parent) { 
  app.listen(process.env.PORT || 3001); 
  console.log('service started');
}
