/*********************************
Main Class: 
- Creating an Input Area inside 
the Terminal. 

By: Preet Patel
**********************************/

// Input from the Terminal
const readline = require('readline');
const {Lexer} = require('../src/Lexer.js');

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
3
async function main(){
    while(true){
        const input = await getStdin();
        if(input === "#q"){ // Exiting
            console.log(">>> Exiting the TERMINAL");
            break;
        }else if(input === "#c"){ // Clearing the Terminal
            console.clear();
            console.log(">>> Terminal Cleared.");
            continue;
        } // Consider Adding More commands
        
        let lexer = new Lexer(input);
        lexer.tokenize();
    }
}

main();