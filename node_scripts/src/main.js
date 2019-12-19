const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const mysql = require('mysql');
const url = require('url');
const fs = require('fs');

const web = require('./web.js');
const scraping = require('./scraping.js');

let settings;
let database;
let keywords;
let browser;

async function setup() {
    console.log(new Date().toLocaleString(), "Loading...");
    let json = fs.readFileSync("settings.json", "utf8");
    settings = JSON.parse(json);
    database = mysql.createPool(settings.mysql);
    browser = await puppeteer.launch();
    database.query({
        sql: "SELECT * FROM keywords",
    }, function(error, results, fields) {
        if (error) { throw error; }
        keywords = results;
        start();
    });
}

async function start() {
    console.log(new Date().toLocaleString(), "Starting...");

    web.listen(async function(search_link) {
        try {
            let page = await browser.newPage();
            await page.goto(search_link, { timeout: 0 });
            let html = await page.content();
            page.close();

            let links = cheerio('.container-result a', html);
            console.log(new Date().toLocaleString(), "Parsed " + links.length + " links from search")
            let seen = {};
            for (let a = 0; a < links.length; a++) {
                let link = links[a].attribs.href;
                if (link == undefined) { continue; }
                let id = link.split(/[\/\?]/g)[5];
                link = url.resolve(search_link, link);
                if (seen[id] == undefined && id != null && id.length == 10) {
                    seen[id] = true;
                    database.query({
                        sql: "SELECT (`id`) FROM offers WHERE `id` = ?",
                        values: [ id ]
                    }, function(error, results, fields) {
                        if (results.length == 0) {
                            process_link(id, link);
                        } else {
                            console.log(new Date().toLocaleString(), id + " is already recorded");
                        }
                    });
                }
            }
        } catch (error) {
            console.error(new Date().toLocaleString(), error);
        }
    }, 42568);

    web.listen(async function(mail_body) {
        try {
            let links = cheerio('a', mail_body);
            console.log(new Date().toLocaleString(), "Parsed " + links.length + " links from mail")
            let seen = {};
            for (let a = 0; a < links.length; a++) {
                let link = links[a].attribs.href;
                if (link == undefined) { continue; }
                let id = new URL(link).searchParams.get("p2");
                if (seen[id] == undefined && id != null && id.length == 10) {
                    seen[id] = true;
                    database.query({
                        sql: "SELECT (`id`) FROM offers WHERE `id` = ?",
                        values: [ id ]
                    }, function(error, results, fields) {
                        if (results.length == 0) {
                            process_link(id, link);
                        } else {
                            console.log(new Date().toLocaleString(), id + " is already recorded");
                        }
                    });
                }
            }
        } catch (error) {
            console.error(new Date().toLocaleString(), error);
        }
    }, 42569);
}

async function process_link(id, link) {
    try {
        console.log(new Date().toLocaleString(), "Processing " + id);
        let page = await browser.newPage();
        await page.goto(link, { timeout: 0 });
        let html = await page.content();
        page.close();

        var $ = cheerio.load(html);
        $.root().find('*').contents().filter(function() { return this.type === 'comment'; }).remove();
        html = $.root().html();

        let info = scraping.parse(html, keywords);
        insert_new(id, info);

    } catch (error) {
        console.error(new Date().toLocaleString(), id, error);
    }
}

async function insert_new(id, info) {
    database.query({
        sql: "INSERT INTO offers (`id`, `salary`, `experience`, `city`, `date`, `contract`, `society`) VALUES (?, ?, ?, ?, ?, ?, ?)",
        values: [ id, info.salary, info.experience, info.city, info.date, info.contract, info.society ]
    }, function(error, results, fields) {
        if (error) { console.error(new Date().toLocaleString(), id, error); return; }

        if (info.skills.length !== 0) {
            let matches = [];
            info.skills.forEach(function(x) {
                matches.push([id, x]);
            });
            database.query({
                sql: "INSERT INTO matches (`id_offer`, `id_skill`) VALUES ?",
                values: [ matches ]
            }, function(error, results, fields) {
                if (error) { console.error(new Date().toLocaleString(), id, error); return; }
                console.log(new Date().toLocaleString(), "Finished " + id);
            });

        } else {
            console.log(new Date().toLocaleString(), "Finished " + id);
        }
    });
}

setup();
