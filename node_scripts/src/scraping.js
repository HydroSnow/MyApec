cheerio = require('cheerio');

this.parse = function(html, keywords) {
    let parsed = {};
    parsed.date = this.get_date(html);
    return parsed;
}

this.get_date = function(html) {
    let text = cheerio('.date-offre', html)[0].children[0].data.split(" ")[2];
    let part = text.split("/");
    return new Date(part[2], part[1] - 1, part[0]);
}
