var express = require('express')
  , cors = require('cors')
  , app = express()
  ;


var authorize = require('oauth2resource')({
  provider: 'https://oauth2server-9063.onmodulus.net/',
  service_id: '8acbda01809b3b9fefdb',
  service_secret: 'fe02c73b98f713b6d556',
  scope: 'https://127.0.0.1:3001/profile'
});


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
app.get('/profile', authorize, function (req, res) {
  res.json(profiles[req.token.account_id] || {});
});

// set the profile 
app.put('/profile', authorize, function (req, res) {
  profiles[req.token.account_id] = req.body;
  res.json({ ok: true });
});



module.exports = app;

if (!module.parent) { 
  app.listen(3001); 
  console.log('service started on 3001');
}
