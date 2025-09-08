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
			{ type: 'WHITESPACE_TOKEN', regex: /^\s+/},
			{ type: 'LPAREN_TOKEN', regex: /^\(/ },
			{ type: 'RPAREN_TOKEN', regex: /^\)/ }
		];
	}
	/**
	 * Tokenizes the input text based on the defined token types.
	 * 
	 * @returns {Array} tokens - An array of tokens extracted from the input text.
	 * @throws {Error} If an unrecognized token is found in the input text.
	 */
	tokenize() {
		console.log(this.inputText);
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
				console.log(`>> LEXER ERROR: UNRECOGNIZED TOKEN: ${this.inputText.slice(currentIndex)}`);
				return;
			}
		}
		this.tokens.push({ tokenType: 'ENDFILE_TOKEN', tokenValue: '\0' });
		
		for(const tokenType of this.tokensTypes) {
			if(tokenType.type === 'WHITESPACE_TOKEN') continue; // Skip whitespace tokens
			this.tokens = this.tokens.filter(token => token.tokenType !== 'WHITESPACE_TOKEN');
		}
		return this.tokens;
	}
}


exports.Lexer = Lexer;