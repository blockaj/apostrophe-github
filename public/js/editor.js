// @class Editor for github feed widgets

function AposGithubWidgetEditor(options) {
  var self = this;

  if (!options.messages) {
    options.messages = {};
  }
  // if (!options.messages.missing) {
  //   options.messages.missing = 'Type in a github account name first.';
  // }

  self.type = 'github';
  options.template = '.apos-github-editor';

  // Parent class constructor shared by all widget editors
  AposWidgetEditor.call(self, options);

  // Now we can override methods
  self.afterCreatingEl = function() {
    self.$account = self.$el.find('.apos-github-account');
    self.$account.val(self.data.account);
    console.log(self.$account.val);
    self.$limit = self.$el.find('[data-apos-github-limit]');
    self.$limit.val(self.data.limit);
    setTimeout(function() {
      self.$account.focus();
    }, 500);
  };

  self.prePreview = getAccount;
  self.preSave = getAccount;

  function getAccount(callback) {
    self.exists = (!!self.$account.val());
    if (self.exists) {
      self.data.account = self.$account.val();
      self.data.limit = self.$limit.val();
    }
    return callback();
  }
}

AposGithubWidgetEditor.label = 'github';

apos.addWidgetType('github');
