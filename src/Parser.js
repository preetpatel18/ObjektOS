class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.currentIndex = 0;
    }

    parse() {
        const statements = [];
        while (this.currentIndex < this.tokens.length) {
            statements.push(this.parseStatement());
        }
        return statements;
    }

    parseStatement() {
        const token = this.tokens[this.currentIndex];

        switch (token.tokenType) {
            case 'NUMS':
                this.currentIndex++;
                return { type: 'NumberLiteral', value: token.tokenValue };
            case 'ADDITION':
                this.currentIndex++;
                return { type: 'AdditionOperator' };
            case 'SUBTRACTION':
                this.currentIndex++;
                return { type: 'SubtractionOperator' };
            case 'MULTIPLICATION':
                this.currentIndex++;
                return { type: 'MultiplicationOperator' };
            case 'DIVISION':
                this.currentIndex++;
                return { type: 'DivisionOperator' };
            default:
                throw new Error(`Unexpected token: ${token.tokenValue}`);
        }
    }
}

exports.Parser = Parser;