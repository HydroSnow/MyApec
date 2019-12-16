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

async function process_link(link) {
    try {
        console.log("Processing " + link)
        let page = await browser.newPage();
        await page.goto(link, { timeout: 0 });
        let html = await page.content();

        let info = scraping.parse(html, keywords);
        console.log(info);

    } catch (err) {
        console.log(err);
    }
}

setup();
