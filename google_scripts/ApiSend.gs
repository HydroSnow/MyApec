var ip = "149.202.88.197";

function api_send_search(link) {
  var host = 'http://' + ip + ':42568';
  var options = {
    'method' : 'post',
    'contentType': 'text/plain',
    'payload': link
  };
  UrlFetchApp.fetch(host, options);
}

function api_send_mail(body) {
  var host = 'http://' + ip + ':42569';
  var options = {
    'method' : 'post',
    'contentType': 'text/html',
    'payload': body
  };
  UrlFetchApp.fetch(host, options);
}
