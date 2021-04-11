let fs = require("fs");
let input = process.argv.slice(2);
let option = input[0].trim();
let files;
//console.log(files);
if (option.charAt(0) === '-') {
    files = input.slice(1);
   for (let i = 1; i < option.length; i++) {
        let optn = option.charAt(i);
        if ((optn === 'b' && option.charAt(i - 1) === 'n') || (optn === 'n' && option.charAt(i - 1) === 'b')) {
    
        } else {
            switch (optn) {
                case "n":
                    addLineNums(files);
                    console.log("add line numbers to all lines");
                    break;
                case "b":
                    addLineNumsNonEmpty(files);
                    console.log("add line numbers to non-empty lines");
                    break;
                case "s":
                    singleLineBreak(files);
                    break;
                default:
                    console.log("enter a valid option");
            }
        }
    }
} else {
    files = input;
}
console.log(files);


function getContent(filepath) {
    return fs.readFileSync(filepath);
}

function fileExists(filepath) {
    return fs.existsSync(filepath);
}

function displayContent(files) {
    for (let i = 0; i < files.length; i++) {
        if (fileExists(files[i])) {
            let fileData = getContent(files[i]);
            console.log(fileData + "");
        } else {
            console.log("File doesnt exist, enter a valid file");
        }
    }
}

function addLineNums(files) {
    for (let j = 0; j < files.length; j++) {
        let lines = fs.readFileSync(files[j]).toString().split("\n");
        fs.writeFileSync(files[j], "");
        let c = 1;
        for (let i = 0; i < lines.length; i++) {
            let newLine = c + ". " + lines[i];
            fs.appendFileSync(files[j], newLine.toString() + "\n");
            c++;
        }
    }
}

function addLineNumsNonEmpty(files) {
    for (let j = 0; j < files.length; j++) {
        let lines = fs.readFileSync(files[j]).toString().split("\n");
        //console.log(lines);
        fs.writeFileSync(files[j], "");
        let c = 1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().length !== 0) {
                let newLine = c + ". " + lines[i];
                fs.appendFileSync(files[j], newLine.toString() + "\n");
                c++;
            } else {
                fs.appendFileSync(files[j], "\n");
            }
        }
    }
}

function singleLineBreak(files) {
    for (let j = 0; j < files.length; j++) {
        let data = fs.readFileSync(files[j]).toString().split("\n");
        fs.writeFileSync(files[j], "");
        let ans = "";
        for (let i = 0; i < data.length; i++) {
            let newLine = data[i].trim();
            ans += newLine + "\n";
        }
        ans = ans.replace(/[\r\n]{3,}/g, "\n\n");
        fs.appendFileSync(files[j], ans);
    }
}

displayContent(files);