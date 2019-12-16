cheerio = require('cheerio');

this.parse = function(html, keywords) {
    let parsed = {};
    parsed.date = this.get_date(html);
    let scc = this.get_scc(html);
    parsed.contract = scc.contract;
    parsed.society = scc.society;
    parsed.city = scc.city;
    return parsed;
}

this.get_date = function(html) {
    let text = cheerio('.date-offre', html)[0].children[0].data.split(" ")[2];
    let part = text.split("/");
    return new Date(part[2], part[1] - 1, part[0]);
}

this.get_scc = function(html) {
    let cells = cheerio('.details-offer-list > li', html);
    if (cells.length == 3) {
        return {
            society: cells[0].children[0].data,
            contract: cells[1].children[4].children[0].data,
            city: cells[2].children[0].data
        };
    } else {
        return {
            society: null,
            contract: cells[0].children[4].children[0].data,
            city: cells[1].children[0].data
        };
    }
}
