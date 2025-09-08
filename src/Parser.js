// Recursive Descent Parser for ObjektOS 

class Parser {
    #tokens;
    #position;
    constructor(tokens) {
        this.#tokens = tokens;
        this.#position = 0;
    }
    

    #currentToken() {
        return this.#peek(0);
    }

    #peek(offset) {
        const index = this.#position + offset;
        if (index >= this.#tokens.length) {
            return this.#tokens[this.#tokens.length - 1]; // Return EOF token
        }
        return this.#tokens[index];
    }

    #equal(tokenType) {
        if (this.#currentToken().tokenType === tokenType) {
            return this.#nextToken();
        }
        console.log(
            `>> PARSER ERROR: UNEXPECTED TOKEN: ${this.#currentToken().tokenType}, EXPECTED: ${tokenType}`
        );
        return;
    }

    #nextToken() {
        let current = this.#currentToken();
        this.#position++;
        return current;
    }
}

// ✅ Export the class
module.exports = { Parser };
