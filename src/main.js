/*********************************
Main Class: 
- Creating an Input Area inside 
the Terminal. 

By: Preet Patel
**********************************/

// Input from the Terminal
const readline = require('readline');
const {Lexer} = require('../src/Lexer.js');
const { Parser } = require('../src/Parser.js');

async function getStdin(){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question('>', (input) => {
            rl.close();
            resolve(input);
        });
    });
}


async function main(){
    let showTokenTypes = true; // Show Token Types

    while(true){
        const input = await getStdin();
        if(input === "#q"){ // Exiting
            console.log(">>> Exiting the TERMINAL");
            break;
        }else if(input === "#c"){ // Clearing the Terminal
            console.clear();
            console.log(">>> Terminal Cleared.");
            continue;
        } else if(input === "#t"){ // Toggle Token Types
            showTokenTypes = !showTokenTypes;
            console.log(`>>> Token Types ${showTokenTypes ? "Enabled" : "Disabled"}`);
            continue;
        }
        let lexer = new Lexer(input);
        let tokens = lexer.tokenize();
        
        if(showTokenTypes){
            console.log(tokens);
        }
    }
}

main();