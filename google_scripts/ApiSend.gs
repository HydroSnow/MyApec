var url = "http://149.202.88.197:42569/myapec";

function api_send_search(link) {
    var host = url + '/search';
    var options = {
        'method': 'post',
        'contentType': 'text/plain',
        'payload': link
    };
    UrlFetchApp.fetch(host, options);
}

function api_send_mail(body) {
    var host = url + '/mail';
    var options = {
        'method': 'post',
        'contentType': 'text/html',
        'payload': body
    };
    UrlFetchApp.fetch(host, options);
}
