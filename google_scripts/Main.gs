function launch() {
  try {
    // Trigger every 12 hours.
    ScriptApp.newTrigger('main')
    .timeBased()
    .everyHours(12)
    .create();
  } catch(err) {
    console.log("Launch error: " + err);
  }
}

function main() {
  try {
    const apecMail = "offres@diffusion.apec.fr";
    
    var threads = GmailApp.search("from:(" + apecMail + ") label:starred");
    var list = GmailApp.getMessagesForThreads(threads);
    
    list.forEach(function(x) {
      x.forEach(function(mail) {
        var body = mail.getBody();
        api_send(body);
        mail.unstar();
      });
    });
  } catch(err) {
    console.log("Main error: " + err);
  }
}
