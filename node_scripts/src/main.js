const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const mysql = require('mysql');
const fs = require('fs');

const web = require('./web.js');

function setup() {
    json = fs.readFileSync("settings.json", "utf8");
    settings = JSON.parse(json);
    web.listen(process_mail, 42569);
}

function process_mail(mail_body) {
    let links = cheerio('a', mail_body);
    for (let a = 0; a < links.length; a++) {
        let link = links[a].attribs.href;
        process_link(link);
    }
}

function process_link(link) {
    console.log(link);
}

setup();
