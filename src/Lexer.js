class Lexer {
    constructor(inputText) {
        this.inputText = inputText;
        this.tokens = [];
        this.tokensTypes = [
			{ type: 'WHILE_TOKEN', regex: /^while/ },
			{ type: 'FOR_TOKEN', regex: /^for/ },
			{ type: 'IF_TOKEN', regex: /^if/ },
			{ type: 'ELSE_TOKEN', regex: /^else/ },
			{ type: 'EF_TOKEN', regex: /^ef/ },
			{ type: 'LET_TOKEN', regex: /^let\b/ },

			// Multi-character comparison operators first
			{ type: 'EQEQ_TOKEN', regex: /^==/ },
			{ type: 'NEQ_TOKEN', regex: /^!=/ },
			{ type: 'LTE_TOKEN', regex: /^<=/ },
			{ type: 'GTE_TOKEN', regex: /^>=/ },

			// Single-character operators
			{ type: 'EQUALS_TOKEN', regex: /^=/ },
			{ type: 'LT_TOKEN', regex: /^</ },
			{ type: 'GT_TOKEN', regex: /^>/ },
			{ type: 'ADDITION_TOKEN', regex: /^\+/ },
			{ type: 'SUBTRACTION_TOKEN', regex: /^\-/ },
			{ type: 'MULTIPLICATION_TOKEN', regex: /^\*/ },
			{ type: 'DIVISION_TOKEN', regex: /^\// },

			// Parentheses, braces, semicolon, comma
			{ type: 'LPAREN_TOKEN', regex: /^\(/ },
			{ type: 'RPAREN_TOKEN', regex: /^\)/ },
			{ type: 'LBRACE_TOKEN', regex: /^\{/ },
			{ type: 'RBRACE_TOKEN', regex: /^\}/ },
			{ type: 'SEMICOLON_TOKEN', regex: /^;/ },
			{ type: 'COMMA_TOKEN', regex: /^,/ },

			// Literals and identifiers
			{ type: 'NUMS_TOKEN', regex: /^\d+/ },
			{ type: 'STRING_TOKEN', regex: /^"([^"\\]|\\.)*"/ },
			{ type: 'IDENTIFIER_TOKEN', regex: /^[a-zA-Z_]\w*/ },

			// Whitespace and comments
			{ type: 'NEWLINE_TOKEN', regex: /^\n+/ },
			{ type: 'WHITESPACE_TOKEN', regex: /^[ \t\r]+/ },
			{ type: 'COMMENT_TOKEN', regex: /^#[^\n]*/ },
			{ type: 'ENDFILE_TOKEN', regex: /^$/ }
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

        this.tokens.push({ tokenType: 'ENDFILE_TOKEN', tokenValue: null });
        // Remove whitespace
        this.tokens = this.tokens.filter(token => token.tokenType !== 'WHITESPACE_TOKEN' && token.tokenType !== 'COMMENT_TOKEN');
        return this.tokens;
    }
}

module.exports = { Lexer };
