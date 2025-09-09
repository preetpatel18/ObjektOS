class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    peek(offset = 0) {
        return this.tokens[this.current + offset] || { tokenType: 'ENDFILE_TOKEN' };
    }

    consume(expectedType) {
        const token = this.peek();
        if (token.tokenType === expectedType) {
            this.current++;
            return token;
        }
        throw new Error(`Expected ${expectedType}, got ${token.tokenType}`);
    }

    skipNewlines() {
        while (this.peek().tokenType === 'NEWLINE_TOKEN') this.current++;
    }

    parseProgram() {
        const statements = [];
        this.skipNewlines();
        while (this.peek().tokenType !== 'ENDFILE_TOKEN') {
            statements.push(this.parseStatement());
            if (this.peek().tokenType === 'SEMICOLON_TOKEN') this.current++;
            this.skipNewlines();
        }
        return { type: 'Program', body: statements };
    }

    parseStatement() {
        const token = this.peek();

        if (token.tokenType === 'LBRACE_TOKEN') return this.parseBlock();
        if (token.tokenType === 'LET_TOKEN') return this.parseVariableDeclaration();
        if (token.tokenType === 'IDENTIFIER_TOKEN') {
            if (this.peek(1).tokenType === 'LPAREN_TOKEN') return this.parseCall();
            else return this.parseAssignment();  // <-- ADD THIS
        }
        if (token.tokenType === 'WHILE_TOKEN') return this.parseWhile();
        if (token.tokenType === 'FOR_TOKEN') return this.parseFor();
        if (token.tokenType === 'IF_TOKEN') return this.parseIf();

        throw new Error(`Unexpected token in statement: ${token.tokenType}`);
    }


    parseBlock() {
        this.consume('LBRACE_TOKEN');
        const statements = [];
        this.skipNewlines();
        while (this.peek().tokenType !== 'RBRACE_TOKEN' && this.peek().tokenType !== 'ENDFILE_TOKEN') {
            statements.push(this.parseStatement());
            if (this.peek().tokenType === 'SEMICOLON_TOKEN') this.current++;
            this.skipNewlines();
        }
        this.consume('RBRACE_TOKEN');
        return { type: 'Block', body: statements };
    }

    parseAssignment() {
        const identifier = this.consume('IDENTIFIER_TOKEN');
        this.consume('EQUALS_TOKEN');
        const expr = this.parseExpression();
        return { type: 'Assignment', id: identifier.tokenValue, value: expr };
    }

    parseCall() {
        const callee = this.consume('IDENTIFIER_TOKEN');
        this.consume('LPAREN_TOKEN');

        const args = [];
        while (this.peek().tokenType !== 'RPAREN_TOKEN') {
            args.push(this.parseExpression());
            if (this.peek().tokenType === 'COMMA_TOKEN') {
                this.consume('COMMA_TOKEN'); // move past comma
            }
        }

        this.consume('RPAREN_TOKEN');

        return {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: callee.tokenValue },
            arguments: args
        };
    }


    parseWhile() {
        this.consume('WHILE_TOKEN');
        this.consume('LPAREN_TOKEN');
        const condition = this.parseExpression();
        this.consume('RPAREN_TOKEN');
        const body = this.parseBlock();
        return { type: 'WhileStatement', condition, body };
    }

    parseIf() {
        this.consume('IF_TOKEN');
        this.consume('LPAREN_TOKEN');
        const condition = this.parseExpression();
        this.consume('RPAREN_TOKEN');
        const body = this.parseBlock();

        let elseBranch = null;

        if (this.peek().tokenType === 'EF_TOKEN') {
            elseBranch = this.parseElseIf();  // <-- new function
        } else if (this.peek().tokenType === 'ELSE_TOKEN') {
            this.consume('ELSE_TOKEN');
            elseBranch = this.parseBlock();
        }

        return { 
            type: 'IfStatement', 
            condition, 
            body, 
            elseBranch 
        };
    }

    parseElseIf() {
        this.consume('EF_TOKEN');
        let condition;
        if (this.peek().tokenType === 'LPAREN_TOKEN') {
            this.consume('LPAREN_TOKEN');
            condition = this.parseExpression();
            this.consume('RPAREN_TOKEN');
        } else {
            condition = this.parseExpression();
        }
        const body = this.parseBlock();

        let elseBranch = null;
        if (this.peek().tokenType === 'EF_TOKEN') {
            elseBranch = this.parseElseIf();
        } else if (this.peek().tokenType === 'ELSE_TOKEN') {
            this.consume('ELSE_TOKEN');
            elseBranch = this.parseBlock();
        }

        return { type: 'IfStatement', condition, body, elseBranch };
    }




    parseExpression() { return this.parseComparison(); }
    
    parseComparison() {
        let node = this.parseTerm();
        while (['EQEQ_TOKEN','NEQ_TOKEN','LT_TOKEN','GT_TOKEN','LTE_TOKEN','GTE_TOKEN'].includes(this.peek().tokenType)) {
            const operator = this.consume(this.peek().tokenType);
            const right = this.parseTerm();
            node = { type: 'BinaryExpression', operator: operator.tokenType, left: node, right };
        }
        return node;
    }

    parseTerm() {
        let node = this.parseFactor();
        while (['ADDITION_TOKEN','SUBTRACTION_TOKEN'].includes(this.peek().tokenType)) {
            const operator = this.consume(this.peek().tokenType);
            const right = this.parseFactor();
            node = { type: 'BinaryExpression', operator: operator.tokenType, left: node, right };
        }
        return node;
    }
    parseFactor() {
        let node = this.parsePrimary();
        while (['MULTIPLICATION_TOKEN','DIVISION_TOKEN'].includes(this.peek().tokenType)) {
            const operator = this.consume(this.peek().tokenType);
            const right = this.parsePrimary();
            node = { type: 'BinaryExpression', operator: operator.tokenType, left: node, right };
        }
        return node;
    }
    parsePrimary() {
        const token = this.peek();
        if (token.tokenType === 'NUMS_TOKEN') { this.consume('NUMS_TOKEN'); return { type: 'NumberLiteral', value: Number(token.tokenValue) }; }
        if (token.tokenType === 'IDENTIFIER_TOKEN') { this.consume('IDENTIFIER_TOKEN'); return { type: 'Identifier', name: token.tokenValue }; }
        if (token.tokenType === 'LPAREN_TOKEN') { this.consume('LPAREN_TOKEN'); const expr = this.parseExpression(); this.consume('RPAREN_TOKEN'); return expr; }
        if (token.tokenType === 'STRING_TOKEN') { this.consume('STRING_TOKEN'); return { type: 'StringLiteral', value: token.tokenValue.slice(1, -1) }; }
        throw new Error(`Unexpected token in expression: ${token.tokenType}`);
    }
    
    parseVariableDeclaration() {
        this.consume('LET_TOKEN');
        const identifier = this.consume('IDENTIFIER_TOKEN');
        this.consume('EQUALS_TOKEN');
        const expr = this.parseExpression();
        return { type: 'VariableDeclaration', id: identifier.tokenValue, value: expr };
    }

    parseFor() {
    this.consume('FOR_TOKEN');
    this.consume('LPAREN_TOKEN');

    // Initialization (variable declaration or assignment)
    let init;
    const nextToken = this.peek();
    if (nextToken.tokenType === 'LET_TOKEN') {
        init = this.parseVariableDeclaration();
    } else {
        init = this.parseAssignment();
    }
    this.consume('SEMICOLON_TOKEN');

    // Condition
    const condition = this.parseExpression();
    this.consume('SEMICOLON_TOKEN');

    const increment = this.parseAssignment();

    this.consume('RPAREN_TOKEN');
    const body = this.parseBlock();

    return { type: 'ForStatement', init, condition, increment, body };
}


}


module.exports = { Parser };
