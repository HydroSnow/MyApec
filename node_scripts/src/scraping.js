cheerio = require('cheerio');

this.parse = function(html, keywords) {
    let parsed = {};
    parsed.date = this.get_date(html);
    parsed.skills = this.get_skills(html, keywords);
    let scc = this.get_scc(html);
    parsed.contract = scc.contract;
    parsed.society = scc.society;
    parsed.city = scc.city;
    let se = this.get_se(html);
    parsed.salary = se.salary;
    parsed.experience = se.experience;
    return parsed;
}

this.get_date = function(html) {
    let text = cheerio('.date-offre', html)[0].children[0].data.split(" ")[2];
    let part = text.split("/");
    return new Date(part[2], part[1] - 1, part[0]);
}

this.get_skills = function(html, keywords) {
    get_text = function(cells) {
        let text = "";
        for (let a = 0; a < cells.length; a++) {
            let cell = cells[a];
            if (cell.children !== undefined) {
                text += get_text(cell.children);
            } else {
                text += cell.data + "\n";
            }
        }
        return text;
    }

    let cells = cheerio('.details-post > p', html);
    let text = get_text(cells).toLowerCase();

    let skills = [];
    for (let a = 0; a < keywords.length; a++) {
        let word = keywords[a].word.toLowerCase();
        let id_skill = keywords[a].id_skill;
        if (skills.includes(id_skill) == false) {
            if (text.includes(word) == true) {
                skills.push(id_skill);
            }
        }
    }
    return skills;
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

this.get_se = function(html) {
    let cells = cheerio('.details-post', html);
    let salary = undefined;
    let experience = undefined;
    for (let a = 0; a < cells.length; a++) {
        let cell = cells[a];
        let title = cells[a].children[0].children[0].data;

        if (title == "Salaire") {
            let text = cells[a].children[1].children[0].data;
            let split = text.replace(/[^0-9]+/g, " ").split(" ");
            split = split.filter(function(x) { return x != "" });
            if (split.length == 0) {
                salary = null;
            } else {
                salary = 0;
                split.forEach(function(x) { salary += parseInt(x); });
                salary /= split.length;
            }

        } else if (title == "Expérience") {
            let text = cells[a].children[1].children[0].data;
            let split = text.replace(/[^0-9]+/g, " ").split(" ");
            split = split.filter(function(x) { return x != "" });
            if (split.length == 0) {
                experience = null;
            } else {
                experience = 0;
                split.forEach(function(x) { experience += parseInt(x); });
                experience /= split.length;
            }
        }
    }
    return {
        salary: salary,
        experience: experience
    };
}
