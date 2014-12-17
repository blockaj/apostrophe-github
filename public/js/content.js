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
      var $githubs = $widget.find('.apos-githubs, [data-apos-githubs]');
      if (!repos.length) {
        $widget.trigger('aposGithubNull');
        return;
      }
      
      $githubs.find('.apos-github:not(.apos-template), [data-apos-github-place-holer]').remove();
      _.each(repos, function(repo){ 
        var text = repo.name;
        var $li = $githubs.find('.apos-github.apos-template, [data-apos-github].apos-template').clone();
        var username = repo.owner.login;
        var $username = $li.find('[data-apos-github-username]');
        $username.text("@"+username);

        var profileUrl = "http://Github.com/"+ username;
        var $profileLink = $li.find('[data-apos-github-profile-link]');
        $profileLink.attr('href', profileUrl);

        //var when = parseGithubDate(github.created_at);
        // Months start at zero for use in arrays.
        // var month = when.getMonth() + 1;
        // if (month < 10) {
        //   month = '0' + month;
        // }
        // var day = when.getDate();
        // if (day < 10) {
        //   day = '0' + day;
        // }
        var url = "http://github.com/" + account + "/status/";
        $profileImage = $li.find('.apos-github-profile-image, [data-apos-github-profile-image]');
        $date = $li.find('.apos-github-date, [data-apos-github-date]');

        var $link = $li.find('[data-apos-github-link]');
        $link.attr('href', url);
        var profileImage;
        if (document.location.href.substr(0, 5) === 'https') {
          //profileImage = github.user.profile_image_url_https;
        } else {
          //profileImage = github.user.profile_image_url;
        }
        $profileImage.css('background-image', 'url(' + profileImage + ')');

        // Grabbing any associated images
        //var photos = (github.entities.media || []);
        //if (photos.length) {
        //  photos.map(function(photo){
        //    var photoSrc;
        //    if (document.location.href.substr(0, 5) === 'https') {
        //      photoSrc = photo.media_url_https;
        //    } else {
        //      photoSrc = photo.media_url;
        //    }
        //    $li.find('[data-apos-github-images]').append('<li><img src="'+photoSrc+'" alt="'+photo.display_url+'"></li>');
        //  });
        //}

        // Linkify URLs
        text = text.replace(/https?\:\/\/\S+/g, function(url) {
          var urlSansPeriod = url.replace(/\.$/, '');
          return '<a href="' + urlSansPeriod + '" target="blank">' + url + '</a>';
        });
        // githubs are pre-escaped for some reason in the JSON responses
        text = text.replace(/(^|[^@\w])@(\w{1,15})\b/g, '$1<a href="http://github.com/$2" target="blank">@$2</a>');
        $li.find('.apos-github-text, [data-apos-github-text]').html('<a href="http://github.com/' + repo.full_name + '">' + text + '</a>');
        $li.removeClass('apos-template');
        $githubs.append($li);
      });
      $githubs.find('.apos-github.apos-template, [data-apos-github].apos-template').remove();
      $widget.trigger('aposGithubReady');
    }
  );

  // Per http://stackoverflow.com/questions/3243546/problem-with-javascript-date-function-in-ie-7-returns-nan
  // Without this IE bombs
};
