let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
url = url + "/match-results";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
console.log("Running your file....");
request(url, cb);
function cb(error, response, html) {
    if (error) {
        console.log(error)
    } else {
        extractHtml(html);
    }
}

function extractHtml(html) {
    let st = cheerio.load(html);
    let linkArr = [];
    let matches = st(".col-md-8.col-16");
    for (let i = 0; i < matches.length; i++) {
        let cbn = st(matches[i]).find(".btn.btn-sm.btn-outline-dark.match-cta");
        let link = st(cbn[2]).attr("href");
        let flink = "https://www.espncricinfo.com/" + link;
        linkArr.push(flink);
    }
    getDetails(linkArr, 0);
}

function getDetails(linkArr, n) {
    if (linkArr.length == n) {
        console.log("Work done:)");
        return;
    }
    request(linkArr[n], cb);
    function cb(err, resp, html) {
        if (err) {
            console.log(err);
        } else {
            extractDetails(html);
            getDetails(linkArr, n + 1);
        }
    }
}

function extractDetails(html) {
    let st = cheerio.load(html);
    let teams = [];
    let teamNames = st(".event .teams .name-detail p");
    let t1name = st(teamNames[0]).text().trim();
    let t2name = st(teamNames[1]).text().trim();
    teams.push(t1name);
    teams.push(t2name);
    createFolder(t1name);
    createFolder(t2name);

    let description = st(".col-16.col-md-16.col-lg-12.main-content-x .description").text().split(",");
    let date = description[2];
    let venue = description[1];
    let res = st(".col-16.col-md-16.col-lg-12.main-content-x .status-text").text();

    let bTable = st(".table.batsman");
    for (let i = 0; i < bTable.length; i++) {
        let batsmen = st(bTable[i]).find("tbody tr");

        for (let j = 0; j < batsmen.length - 1; j += 2) {
            let obj = {};
            let rowVals = st(batsmen[j]).find("td");
            let bname = st(rowVals[0]).text().trim();
            bname = bname.split(" ");
            bname = bname[0] + bname[1];

            let run = st(rowVals[2]).text();
            obj.runs = run;

            let ball = st(rowVals[3]).text();
            obj.balls = ball;

            let four = st(rowVals[5]).text();
            obj.fours = four;

            let six = st(rowVals[6]).text();
            obj.sixes = six;

            let srr = st(rowVals[7]).text();
            obj.sr = srr;

            obj.Date = date;
            obj.Venue = venue;
            obj.result = res;

            if (i == 1) {
                obj.opponentName = t1name;
            } else {
                obj.opponentName = t2name;
            }

            writeInFile(teams[i], bname, obj);
        }
    }
}

function writeInFile(tname, bname, obj) {
    let filePath = path.join(__dirname, tname, bname + ".json");
    if (fs.existsSync(filePath) == false) {
        let arr = [];
        arr.push(obj);
        let createStream = fs.createWriteStream(filePath);
        createStream.end();
        fs.writeFileSync(filePath, JSON.stringify(arr));
    } else {
        fs.readFile(filePath, function (err, data) {
            var a = [];
            a.push(data);
            var json = JSON.parse(Buffer.concat(a).toString());
            json.push(obj);
            fs.writeFile(filePath, JSON.stringify(json), function (err) {
                if (err) throw err;
                //console.log('The "data to append" was appended to file!');
            });
        })
    }
}

function createFolder(folderName) {
    let folderPath = path.join(__dirname, folderName);
    if (fs.existsSync(folderPath) == false) {
        fs.mkdirSync(folderPath);
    }
}

// function writeInFile(tname, bname, obj) {
//     let filePath = path.join(__dirname, tname, bname + ".json");
//     if (fs.existsSync(filePath) == false) {
//         let arr = [];
//         arr.push(obj);
//         let createStream = fs.createWriteStream(filePath);
//         createStream.end();
//         fs.writeFileSync(filePath, JSON.stringify(arr));
//     } else {
//         let data = JSON.parse(fs.readFileSync(filePath));
//         //console.log(data);
//         data.push(obj);
//         fs.writeFileSync(filePath, JSON.stringify(data));
//     }
// }