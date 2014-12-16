var _ = require('lodash');
var request = require('request');

module.exports = function(options, callback) {
  return new Construct(options, callback);
};

module.exports.Construct = Construct;

function Construct(options, callback) {
  var apos = options.apos;
  var app = options.app;

  // How long to cache the feed, in seconds. Twitter's API rate limit is
  // rather generous at 300 requests per 15 minutes. We shouldn't get anywhere
  // near that, we'd make 30 requests. However with clustering we would have
  // separate caches and this might start to look like the right setting.

  var self = this;
  self._apos = apos;
  self._app = app;
  self._apos.mixinModuleAssets(self, 'github', __dirname, options);

  // This widget should be part of the default set of widgets for areas
  // (this isn't mandatory)
  apos.defaultControls.push('github');

  // Include our editor template in the markup when aposTemplates is called
  self.pushAsset('template', 'githubEditor', { when: 'user' });

  // Make sure that aposScripts and aposStylesheets summon our assets
  self.pushAsset('script', 'content', { when: 'always' });
  self.pushAsset('script', 'editor', { when: 'user' });
  self.pushAsset('stylesheet', 'content', { when: 'always' });

  // Serve our feeds. Be sure to cache them so we don't hit the rate limit.
  // TODO: consider using the streaming API for faster updates without hitting
  // the rate limit.
  app.get('/apos-github/repos', function(req, res) {
    var username;
    if (req.query.username) {
      username = apos.sanitizeString(req.query.username);
    }
    if (username && !username.length) {
      res.statusCode = 404;
      return res.send('not found');
    }
    if (username) {

      //The github api won't let us look at anything without a user-agent specified
      var requestOptions = {
        'url': 'https://api.github.com/users/' + username + '/repos',
        'headers': {
          'User-Agent': 'request'
        }
      };
      request.get(requestOptions, function(error, response, body){
        if (error) {
          console.log('apos-github error: ' + error);
        }
        return res.send(body);
      });
    }
  });

  self.widget = true;
  self.label = 'Github';
  self.css = 'github';
  self.icon = 'icon-github';
  self.sanitize = function(item) {
    if (item.account) {
      var matches = item.account.match(/\w+/);
      item.account = matches[0];
    }
  };
  self.renderWidget = function(data) {
    return self.render('github', data);
  };
  self._apos.addWidgetType('github', self);

  return setImmediate(function() { return callback(null); });
}
