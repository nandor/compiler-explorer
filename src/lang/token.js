

export const Kind = Object.freeze({
    FUNC: Symbol("FUNC"),
    RETURN: Symbol("RETURN"),
    WHILE: Symbol("WHILE"),
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

export default class Token {
    constructor(kind, loc, value) {
        this.kind = kind;
        this.loc = loc;
        this.value = value;
    }

    toString() {
        switch (this.kind) {
            case Kind.FUNC: return 'FUNC';
            case Kind.RETURN: return 'RETURN';
            case Kind.WHILE: return 'WHILE';

            case Kind.LPAREN: return '(';
            case Kind.RPAREN: return ')';
            case Kind.LBRACE: return '{';
            case Kind.RBRACE: return '}';
            case Kind.COLON: return ':';
            case Kind.SEMI: return ';';

            case Kind.EQUAL: return '=';
            case Kind.DOUBLE_EQUAL: return '==';
            case Kind.COMMA: return ',';
            case Kind.PLUS: return '+';
            case Kind.MINUS: return '-';
            case Kind.MUL: return '*';
            case Kind.DIV: return '/';
            case Kind.MOD: return '%';

            case Kind.INT: return `INT(${this.value})`;
            case Kind.STRING: return `STRING(${this.value})`;
            case Kind.IDENT: return `IDENT(${this.value})`;
            case Kind.END: return 'END';
            case Kind.ERROR: return 'ERROR';
        }
    }
};
