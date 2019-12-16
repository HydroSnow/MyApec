const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const mysql = require('mysql');
const fs = require('fs');

const web = require('./web.js');

let settings;
let database;
let keywords;

function setup() {
    console.log("Loading...");
    let json = fs.readFileSync("settings.json", "utf8");
    settings = JSON.parse(json);
    database = mysql.createPool(settings.mysql);
    database.query("SELECT * FROM keywords", function (error, results, fields) {
        if (error) { throw error; }
        keywords = results;
        start();
    });
}

function start() {
    console.log("Starting...");
    web.listen(process_mail, 42569);
}

function process_mail(mail_body) {
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

function process_link(link) {
    try {
        console.log(link);
    } catch (err) {
        console.log(err);
    }
}

setup();
