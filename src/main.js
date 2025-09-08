/*********************************
Main Class: 
- Creating an Input Area inside 
the Terminal. 

By: Preet Patel
**********************************/

const readline = require('readline');
const { Lexer } = require('../src/Lexer.js');
const { Parser } = require('../src/Parser.js');

async function getStdin() {
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

function evaluate(node) {
    if (node.type === 'NumberLiteral') return node.value;

    if (node.type === 'BinaryExpr') {
        let left = evaluate(node.left);
        let right = evaluate(node.right);
        switch (node.operator) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return left / right;
        }
    }
    throw new Error(`Unknown AST node: ${JSON.stringify(node)}`);
}

async function main() {
    let showTokenTypes = true;

    while (true) {
        const input = await getStdin();
        if (input === "#q") {
            console.log(">>> Exiting the TERMINAL");
            break;
        } else if (input === "#c") {
            console.clear();
            console.log(">>> Terminal Cleared.");
            continue;
        } else if (input === "#t") {
            showTokenTypes = !showTokenTypes;
            console.log(`>>> Token Types ${showTokenTypes ? "Enabled" : "Disabled"}`);
            continue;
        }

        let lexer = new Lexer(input);
        let tokens;
        try {
            tokens = lexer.tokenize();
        } catch (err) {
            console.log(err.message);
            continue;
        }

        if (showTokenTypes) {
            console.log("Tokens:", tokens);
        }

        try {
            let parser = new Parser(tokens);
            let ast = parser.parseExpression();
            console.log("AST:", JSON.stringify(ast, null, 2));
            let result = evaluate(ast);
            console.log("Result:", result);
        } catch (err) {
            console.log(">> PARSER ERROR:", err.message);
        }
    }
}

main();