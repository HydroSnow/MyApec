function search() {
    for (var a = 0; a < 20; a++) {
        var link = "https://www.apec.fr/candidat/recherche-emploi.html/emploi?page=" + a + "&motsCles=d%C3%A9veloppeur";
        api_send_search(link);
    }
}

function mail() {
    const apecMail = "offres@diffusion.apec.fr";

    var threads = GmailApp.search("from:(" + apecMail + ") label:starred");
    var list = GmailApp.getMessagesForThreads(threads);

    list.forEach(function(x) {
        x.forEach(function(mail) {
            var body = mail.getBody();
            api_send_mail(body);
            mail.unstar();
        });
    });
}
