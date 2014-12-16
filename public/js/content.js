apos.widgetPlayers.github = function($widget) {
  var data = apos.getWidgetData($widget);
  var account = data.account;
  var hashtag = data.hashtag;

  $.getJSON(
    '/apos-github/repos',
    {
      count: (data.limit || 5),
      username: account
    },
    function(repos) {
      var $githubs = $widget.find('.apos-github, [data-apos-githubs]');
      if (!repos.length) {
        $widget.trigger('aposGithubNull');
        return;
      }

      $githubs.find('.apos-github:not(.apos-template), [data-apos-github-place-holer]').remove();
      _.each(repos, function(repo){ 
        //var $li = $githubs.find('.apos-github .apos-template, [data-apos-github].apos-template').clone();
        //console.log($li);
        var text = repo.name;
        //var username = repo.owner.login;
        //var $username = $li.find('[data-apos-github-username]');
        //$username.text("/"+username);
        //var profileUrl = "http://github.com/"+ username;
        //var $profileLink = $li.find('[data-apos-github-profile-link]');
        //$profileLink.attr('href', profileUrl);
        //var url = "http://github.com/" + account + "/"+ repo; 
        //var $link = $li.find('[data-apos-github-link]');
        //console.log($link);
        //$link.attr('href', url);
        //// Linkify URLs
        ////text = text.replace(/https?\:\/\/\S+/g, function(url) {
        ////  var urlSansPeriod = url.replace(/\.$/, '');
        ////  return '<a href="' + urlSansPeriod + '" target="blank">' + url + '</a>';
        ////});
        //// Tweets are pre-escaped for some reason in the JSON responses
        //$li.find('.apos-github-text, [data-apos-github-text]').html(text);
        //$li.removeClass('apos-template');
        //$githubs.append($li);
        var $text = $githubs.find('li.apos-github');
        console.log($text);
        $text.html(text);
        console.log($text);
      });
      
      
      $widget.trigger('aposGithubReady');
    }
  );

  // Per http://stackoverflow.com/questions/3243546/problem-with-javascript-date-function-in-ie-7-returns-nan
  // Without this IE bombs
};
