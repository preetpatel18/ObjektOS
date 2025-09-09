const readline = require("readline");
const fs = require("fs");
const { Lexer } = require("./Lexer.js");
const { Parser } = require("./Parser.js");

// Colors
const COLORS = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    green: "\x1b[32m"
};

// Environment class for scoping
class Environment {
    constructor(parent = null) {
        this.vars = {};
        this.parent = parent;
    }

    define(name, value) {
        this.vars[name] = value;
    }

    assign(name, value) {
        if (name in this.vars) {
            this.vars[name] = value;
        } else if (this.parent) {
            this.parent.assign(name, value);
        } else {
            throw new Error(`Undefined variable: ${name}`);
        }
    }

    get(name) {
        if (name in this.vars) return this.vars[name];
        if (this.parent) return this.parent.get(name);
        throw new Error(`Undefined variable: ${name}`);
    }
}

const globalEnv = new Environment();

// Evaluate AST nodes
function evaluate(node, env = globalEnv) {
    switch(node.type) {
        case "Program":
        case "Block":
            const blockEnv = new Environment(env); // new scope
            for(const stmt of node.body) evaluate(stmt, blockEnv);
            break;

        case "VariableDeclaration":
            env.define(node.id, evaluate(node.value, env));
            break;

        case "Assignment":
            env.assign(node.id, evaluate(node.value, env));
            break;

        case "Identifier":
            return env.get(node.name);

        case "NumberLiteral":
        case "StringLiteral":
            return node.value;

        case "BinaryExpression":
            const l = evaluate(node.left, env);
            const r = evaluate(node.right, env);
            switch(node.operator) {
                case "ADDITION_TOKEN": return l + r;
                case "SUBTRACTION_TOKEN": return l - r;
                case "MULTIPLICATION_TOKEN": return l * r;
                case "DIVISION_TOKEN": return l / r;
                case "EQEQ_TOKEN": return l === r;
                case "NEQ_TOKEN": return l !== r;
                case "LT_TOKEN": return l < r;
                case "GT_TOKEN": return l > r;
                case "LTE_TOKEN": return l <= r;
                case "GTE_TOKEN": return l >= r;
            }
            break;

        case "CallExpression":
            if (node.callee.name === "print") {
                console.log(...node.arguments.map(arg => evaluate(arg, env)));
            }
            break;

        case "WhileStatement":
            while(evaluate(node.condition, env)) {
                evaluate(node.body, env); // use same env for block
            }
            break;

        case "IfStatement":
            if (evaluate(node.condition, env)) evaluate(node.body, new Environment(env));
            else if (node.elseBranch) evaluate(node.elseBranch, new Environment(env));
            break;

        case "ForStatement":
            const forEnv = new Environment(env);
            if (node.init) evaluate(node.init, forEnv);
            while(!node.condition || evaluate(node.condition, forEnv)) {
                evaluate(node.body, forEnv);  // <--- use forEnv, not new Environment
                if (node.increment) evaluate(node.increment, forEnv);
            }
            break;
        

        default:
            throw new Error(`Unknown AST node type: ${node.type}`);
    }
}

// REPL
async function startREPL() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: COLORS.yellow + "> " + COLORS.reset
    });

    console.log(COLORS.cyan, "ObjektOS REPL with Interpreter. Commands: #q quit, #c clear, #t toggle tokens", COLORS.reset);

    let showTokens = false;

    rl.prompt();

    rl.on("line", (line) => {
        line = line.trim();
        if (!line) return rl.prompt();

        if (line === "#q") return rl.close();
        if (line === "#c") { console.clear(); rl.prompt(); return; }
        if (line === "#t") { showTokens = !showTokens; console.log(`Show tokens: ${showTokens}`); rl.prompt(); return; }

        try {
            const lexer = new Lexer(line);
            const tokens = lexer.tokenize();
            if (showTokens) console.log(COLORS.cyan, "TOKENS:", COLORS.reset, tokens);

            const parser = new Parser(tokens);
            const ast = parser.parseProgram();

            evaluate(ast);
        } catch (err) {
            console.error(COLORS.red, "Error:", err.message, COLORS.reset);
        }

        rl.prompt();
    });

    rl.on("close", () => {
        console.log(COLORS.cyan, ">>> Exiting ObjektOS REPL", COLORS.reset);
        process.exit(0);
    });
}

// Run file
function runFile(filename) {
    const code = fs.readFileSync(filename, "utf-8");
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parseProgram();
    evaluate(ast);
}

// Main
async function main() {
    const filename = process.argv[2];
    if (filename) {
        runFile(filename);
    } else {
        await startREPL();
    }
}

main();
