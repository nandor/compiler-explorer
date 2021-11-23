import { Location, Range } from './position'


export default class Token {
    static Kind = Object.freeze({
        FUNC: Symbol("FUNC"),
        RETURN: Symbol("RETURN"),
        WHILE: Symbol("WHILE"),
        IF: Symbol("IF"),
        ELSE: Symbol("ELSE"),
        LET: Symbol("LET"),
        LPAREN: Symbol("LPAREN"),
        RPAREN: Symbol("RPAREN"),
        LBRACE: Symbol("LBRACE"),
        RBRACE: Symbol("RBRACE"),
        COLON: Symbol("COLON"),
        SEMI: Symbol("SEMI"),
        EQUAL: Symbol("EQUAL"),
        DOUBLE_EQUAL: Symbol("DOUBLE_EQUAL"),
        COMMA: Symbol("COMMA"),
        PLUS: Symbol("PLUS"),
        MINUS: Symbol("MINUS"),
        MUL: Symbol("MUL"),
        DIV: Symbol("DIV"),
        MOD: Symbol("MOD"),
        INT: Symbol("INT"),
        STRING: Symbol("STRING"),
        IDENT: Symbol("IDENT"),
        END: Symbol("END"),
        ERROR: Symbol("ERROR"),
    });

    constructor(kind, start, end, value) {
        this.kind = kind;
        this.start = start;
        this.end = end;
        this.value = value;
    }

    toString() {
        switch (this.kind) {
            case Token.Kind.FUNC: return 'FUNC';
            case Token.Kind.RETURN: return 'RETURN';
            case Token.Kind.WHILE: return 'WHILE';
            case Token.Kind.IF: return 'IF';
            case Token.Kind.ELSE: return 'ELSE';
            case Token.Kind.LET: return 'LET';

            case Token.Kind.LPAREN: return '(';
            case Token.Kind.RPAREN: return ')';
            case Token.Kind.LBRACE: return '{';
            case Token.Kind.RBRACE: return '}';
            case Token.Kind.COLON: return ':';
            case Token.Kind.SEMI: return ';';

            case Token.Kind.EQUAL: return '=';
            case Token.Kind.DOUBLE_EQUAL: return '==';
            case Token.Kind.COMMA: return ',';
            case Token.Kind.PLUS: return '+';
            case Token.Kind.MINUS: return '-';
            case Token.Kind.MUL: return '*';
            case Token.Kind.DIV: return '/';
            case Token.Kind.MOD: return '%';

            case Token.Kind.INT: return `INT(${this.value})`;
            case Token.Kind.STRING: return `STRING(${this.value})`;
            case Token.Kind.IDENT: return `IDENT(${this.value})`;
            case Token.Kind.END: return 'END';
            case Token.Kind.ERROR: return 'ERROR';
        }
    }
};
