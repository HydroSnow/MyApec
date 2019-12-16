const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const mysql = require('mysql');
const fs = require('fs');

const web = require('./web.js');
const scraping = require('./scraping.js');

let settings;
let database;
let keywords;
let browser;

async function setup() {
    console.log("Loading...");
    let json = fs.readFileSync("settings.json", "utf8");
    settings = JSON.parse(json);
    database = mysql.createPool(settings.mysql);
    browser = await puppeteer.launch();
    database.query("SELECT * FROM keywords", function (error, results, fields) {
        if (error) { throw error; }
        keywords = results;
        start();
    });
}

async function start() {
    console.log("Starting...");
    web.listen(process_mail, 42569);
}

async function process_mail(mail_body) {
    try {
        let links = cheerio('a', mail_body);
        let seen = {};
        for (let a = 0; a < links.length; a++) {
            let link = links[a].attribs.href;
            let url = new URL(link);
            let id = url.searchParams.get("p2");
            if (seen[id] == undefined) {
                seen[id] = true;
                process_link(link);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function process_link(id, link) {
    try {
        console.log("Processing " + id)
        let page = await browser.newPage();
        await page.goto(link, { timeout: 0 });
        let html = await page.content();

        let info = scraping.parse(html, keywords);
        console.log(info);
        insert_new(info)

    } catch (err) {
        console.log(err);
    }
}

async function insert_new(info) {
    database.query("INSERT INTO offers (`salary`, `experience`, `city`, `date`, `contract`, `society`) VALUES ?", [ [ [
        info.salary, info.experience, info.city, info.date, info.contract, info.society
    ] ] ], function (err, result) {
        if (err) { console.error(err); }

        let matches = [];
        info.skills.forEach(function(x) {
            matches.push([ result.insertId, x ]);
        });
        database.query("INSERT INTO matches (`id_offer`, `id_skill`) VALUES ?", [ matches ], function (err, result) {
            if (err) { console.error(err); }
        });
    });
}

setup();
