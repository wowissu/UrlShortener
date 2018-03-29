console.log('background');

var ApiKey = "AIzaSyDB_PPn5MjsRyWfUw1I8MUE780IPck0tbg";
var URL = "https://www.googleapis.com/urlshortener/v1/url?key=" + ApiKey;
var TYPE = "POST";
var notificationId = "su.goo.gl";

chrome.browserAction.onClicked.addListener(function(tab) {

  chrome.tabs.getSelected(null, function(tab) {
    var tabUrl = tab.url;

    if (tabUrl) {
      var http = new XMLHttpRequest();
      var params = JSON.stringify({longUrl: tabUrl});
      http.open("POST", URL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.onreadystatechange = function() {//Call a function when the state changes.
          if(http.readyState == 4 && http.status == 200) {
              var result = JSON.parse(http.responseText);
              copy(result.id);

              chrome.notifications.clear(notificationId, function (wasCleared) {
                chrome.notifications.create(notificationId, {
                  iconUrl: chrome.runtime.getURL('icon.png'),
                  type: "basic",
                  title: "縮網址",
                  message: "已複製：" + result.id,
                  eventTime: Date.now() + 300
                }, function () {
                  console.log(arguments);
                });
              });
          }
      }
      http.send(params);
    }
  });

});

function copy(s) {
  var clip_area = document.createElement('textarea');
  clip_area.textContent = s;

  document.body.appendChild(clip_area);
  clip_area.select();

  document.execCommand('copy');
  clip_area.remove();
}