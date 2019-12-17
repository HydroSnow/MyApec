function launch() {
    try {
        // Trigger every 1 hour.
        ScriptApp.newTrigger('search')
            .timeBased()
            .everyHours(1)
            .create();

        // Trigger every 12 hours.
        ScriptApp.newTrigger('mail')
            .timeBased()
            .everyHours(12)
            .create();

    } catch (err) {
        console.log("Launch error: " + err);
    }
}

function search() {
    try {
        for (var a = 0; a < 5; a++) {
            var link = "https://www.apec.fr/candidat/recherche-emploi.html/emploi?page=" + a + "&motsCles=d%C3%A9veloppeur";
            api_send_search(link);
        }
    } catch (err) {
        console.log("Search error: " + err);
    }
}

function mail() {
    try {
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
    } catch (err) {
        console.log("Mail error: " + err);
    }
}
