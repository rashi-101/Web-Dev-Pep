//require files that you need in this file
let help = require("./commands/help");
let view = require("./commands/view");
let organize = require("./commands/organize");

//get commands input from the user
let input = process.argv.slice(2);
let cmd = input[0];

//call methods from other files as per user's command
switch(cmd){
 case "view":
     view.viewEx(input[1],input[2]);
     break;
 case "help":
    help.helpEx();
     break;
 case "organize":
     organize.organizeEx(input[1]);
     break;
 default:
     console.log("Wrong Command. Please enter help to see the list of all valid commands");
     break;
}