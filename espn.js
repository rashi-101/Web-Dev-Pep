let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
url = url + "/match-results";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let pdfdoc = require("pdfkit");
const { createInflate } = require("zlib");
console.log("Before");
request(url, cb);
function cb(error, response, html) {
    if (error) {
        console.log(error)
    } else {
        // console.log(url);
        extractHtml(html);
    }
}

function extractHtml(html) {
    let st = cheerio.load(html);
    let linkArr = [];
    let matches = st(".col-md-8.col-16");
    for (let i = 0; i < 2; i++) {
        let cbn = st(matches[i]).find(".btn.btn-sm.btn-outline-dark.match-cta");
        let link = st(cbn[2]).attr("href");
        let flink = "https://www.espncricinfo.com/" + link;
        //console.log(flink);
        linkArr.push(flink);
        getDetails(flink);
    }
    //console.log(linkArr);
    // getPom(linkArr, 0);
}

function getDetails(url) {
    request(url, cb);
    function cb(err, resp, html) {
        if (err) {
            console.log(err);
        } else {
            extractDetails(html);
        }
    }
}

function extractDetails(html) {
    //createFolder("ipl2020");
    let st = cheerio.load(html);
    let teams = [];
    let teamNames = st(".event .teams .name-detail p");
    let t1name = st(teamNames[0]).text();
    let t2name = st(teamNames[1]).text();
    teams.push(t1name);
    teams.push(t2name);
    createFolder(t1name);
    createFolder(t2name);
    let bTable = st(".table.batsman");
    for (let i = 0; i < bTable.length; i++) {
        let batsmen = st(bTable[i]).find("tbody tr a");
        for (let j = 0; j < batsmen.length; j++) {
            let bname = st(batsmen[j]).text();
            //console.log(teams[i]+"--"+bname);
            let blink = st(batsmen[j]).attr("href");
            //console.log(blink);
            writeBDetsinJSON(teams[i], bname, blink);
        }
        console.log("------------------------");
    }
}

function writeBDetsinJSON(tname, bname, link) {
    request(link, cb);
    function cb(err, resp, html) {
        if (err) {
            console.log(err);
        } else {
            putBDetsinJSOn(tname, bname, html);
        }
    }
}

function putBDetsinJSOn(tname, bname, html) {
    //createFile(tname, bname);
    let st = cheerio.load(html);
    // let arr = [];
    let tables = st(".engineTable");
    let recentMatchesTable = st(tables[3]);
    let headings = st(recentMatchesTable).find("thead th");
    let hdng = [];
    // let arr=["io", "ip","fg","iu", "ilp","fjg"];
    for (let i = 0; i < headings.length; i++) {
        let heading = st(headings[i]).text();
        //console.log(heading);
        hdng.push(heading);
    }
    //console.log(hdng);
    let nmatches = st(recentMatchesTable).find("tbody tr");
    let arr = [];
    for (let i = 0; i < nmatches.length; i++) {
        let td = st(nmatches[i]).find("td");
        let obj = {};
        for (let j = 0; j < headings.length; j++) {
            let cellval = st(td[j]).text();
            obj[hdng[j]] = cellval;
        }
        arr.push(obj);
    }
    writeInFile(tname, bname, arr);
}

function writeInFile(tname, bname, arr) {
    let filePath = path.join(__dirname, tname, bname + ".json");
    if (fs.existsSync(filePath) == false) {
        let createStream = fs.createWriteStream(filePath);
        createStream.end();
    }
    fs.writeFileSync(filePath, JSON.stringify(arr));
}
// function createFolder(folderName) {
//     let folderPath = path.join(__dirname, folderName);
//     if (fs.existsSync(folderPath) == false) {
//         fs.mkdirSync(folderPath);
//     }
// }

function createFile(tname, bname) {
    let filePath = path.join(__dirname, tname, bname + ".json");
    if (fs.existsSync(filePath) == false) {
        let createStream = fs.createWriteStream(filePath);
        createStream.end();
    }
}