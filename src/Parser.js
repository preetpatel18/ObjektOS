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
            return this.#tokens[this.#tokens.length - 1]; // return EOF token
        }
        return this.#tokens[index];
    }

    #equal(tokenType) {
        if (this.#currentToken().tokenType === tokenType) {
            return this.#nextToken();
        }
        throw new Error(
            `Unexpected token: ${this.#currentToken().tokenType}, expected: ${tokenType}`
        );
    }

    #nextToken() {
        let current = this.#currentToken();
        this.#position++;
        return current;
    }

    // Grammar rules:
    // Expression → Term ( ("+" | "-") Term )*
    parseExpression() {
        let node = this.parseTerm();
        while (this.#currentToken().tokenType === 'ADDITION_TOKEN' ||
               this.#currentToken().tokenType === 'SUBTRACTION_TOKEN') {
            let operator = this.#nextToken();
            let right = this.parseTerm();
            node = { type: 'BinaryExpr', operator: operator.tokenValue, left: node, right: right };
        }
        return node;
    }

    // Term → Factor ( ("*" | "/") Factor )*
    parseTerm() {
        let node = this.parseFactor();
        while (this.#currentToken().tokenType === 'MULTIPLICATION_TOKEN' ||
               this.#currentToken().tokenType === 'DIVISION_TOKEN') {
            let operator = this.#nextToken();
            let right = this.parseFactor();
            node = { type: 'BinaryExpr', operator: operator.tokenValue, left: node, right: right };
        }
        return node;
    }

    // Factor → NUMBER | "(" Expression ")"
    parseFactor() {
        let token = this.#currentToken();

        if (token.tokenType === 'NUMS_TOKEN') {
            this.#nextToken();
            return { type: 'NumberLiteral', value: Number(token.tokenValue) };
        }

        if (token.tokenType === 'LPAREN_TOKEN') {
            this.#nextToken();
            let expr = this.parseExpression();
            this.#equal('RPAREN_TOKEN');
            return expr;
        }

        throw new Error(`Unexpected token in factor: ${token.tokenType}`);
    }
}

module.exports = { Parser };
