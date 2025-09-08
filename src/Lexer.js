/*****
 * LEXER CLASS
 * A Class that will Tokenize the input String and Store them in the {token} array.
 * 
 * By: Preet Patel
 */
class Lexer {
    constructor(inputText) {
        this.inputText = inputText;
        this.tokens = [];
        this.tokensTypes = [
            { type: 'NUMS_TOKEN', regex: /^\d+/ },
            { type: 'ADDITION_TOKEN', regex: /^\+/ },
            { type: 'SUBTRACTION_TOKEN', regex: /^\-/ },
            { type: 'MULTIPLICATION_TOKEN', regex: /^\*/ },
            { type: 'DIVISION_TOKEN', regex: /^\// },
            { type: 'LPAREN_TOKEN', regex: /^\(/ },
            { type: 'RPAREN_TOKEN', regex: /^\)/ },
            { type: 'WHITESPACE_TOKEN', regex: /^\s+/ }
        ];
    }

    tokenize() {
        let currentIndex = 0;
        while (currentIndex < this.inputText.length) {
            let matchedToken = null;

            for (const tokenType of this.tokensTypes) {
                const regexResult = this.inputText.slice(currentIndex).match(tokenType.regex);
                if (regexResult && regexResult.index === 0) {
                    const value = regexResult[0];
                    const type = tokenType.type;
                    this.tokens.push({ tokenType: type, tokenValue: value });
                    currentIndex += value.length;
                    matchedToken = type;
                    break;
                }
            }

            if (!matchedToken) {
                throw new Error(`LEXER ERROR: Unrecognized token at index ${currentIndex}: ${this.inputText.slice(currentIndex)}`);
            }
        }

        this.tokens.push({ tokenType: 'ENDFILE_TOKEN', tokenValue: '\0' });
        this.tokens = this.tokens.filter(token => token.tokenType !== 'WHITESPACE_TOKEN');
        return this.tokens;
    }
}

module.exports = { Lexer };
