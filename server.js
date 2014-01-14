var cwd     = process.cwd()
  , path    = require('path')
  , env     = process.env.NODE_ENV || 'development'
  , config  = require(path.join(cwd, 'config.' + env + '.json'))
  , port    = process.env.PORT || config.port || 3001
  , express = require('express')
  , cors    = require('cors')
  , app     = express()
  , client  = require('./redis')(config.redis)
  ;


var authorize = require('oauth2resource')(config.authority);


app.configure(function () {
  app.set('port', port);
  app.use(express.bodyParser());
  app.use(cors());
  app.use(app.router);
  app.use(function (err, req, res, next) {
    res.send(err.statusCode || 500, err);
  })
});


// retrieve the profile
app.get('/v1/profile', authorize, function (req, res, next) {
  client.hget('profiles', req.token.account_id, function (err, json) {
    if (err) { return next(err); }
    res.send(json);
  });
});

// set the profile
app.put('/v1/profile', authorize, function (req, res) {
  client.hset('profiles', req.token.account_id, JSON.stringify(req.body), function (err) {
    if (err) { return next(err); }
    res.json({ ok: true });
  });
});



module.exports = app;

if (!module.parent) {
  app.listen(app.settings.port);
  console.log('service started on port ', app.settings.port);
}
