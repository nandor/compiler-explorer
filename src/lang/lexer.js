import { Location, Range } from './position'
import Token from './token'


class LexerError {
  constructor(loc, message) {
  }
}

export default class Lexer {
  constructor(source) {
    this._source = source;
    this._index = 0;
    this._char = '\0';
    this._row = 1;
    this._col = 0;
    this._nextChar();
  }

  static isWhitespace(chr) {
    return chr == ' ' || chr == '\t' || chr == '\n';
  }

  static isIdentStart(chr) {
    return /[a-zA-Z_]/.test(chr);
  }

  static isIdentCont(chr) {
    return /[a-zA-Z0-9_]/.test(chr);
  }

  static isDigit(chr) {
    return /[0-9]/.test(chr);
  }

  _loc() {
    return new Location(this._row, this._col);
  }

  _nextChar() {
    if (this._index < this._source.length) {
      this._char = this._source[this._index];
      this._index++;
      if (this._char == '\n') {
        this._row++;
        this._col = 0;
      } else {
        this._col++;
      }
    } else {
      this._index = this._source.length + 1;
    }
    return this._char;
  }

  _nextToken() {
    while (!this._eof() && Lexer.isWhitespace(this._char)) {
      this._nextChar();
    }
    if (this._eof()) {
      return null;
    }
    const start = this._loc();
    switch (this._char) {
      case '(': return this._nextChar(), new Token(Token.Kind.LPAREN, start, start);
      case ')': return this._nextChar(), new Token(Token.Kind.RPAREN, start, start);
      case '{': return this._nextChar(), new Token(Token.Kind.LBRACE, start, start);
      case '}': return this._nextChar(), new Token(Token.Kind.RBRACE, start, start);
      case ':': return this._nextChar(), new Token(Token.Kind.COLON, start, start);
      case ';': return this._nextChar(), new Token(Token.Kind.SEMI, start, start);
      case '+': return this._nextChar(), new Token(Token.Kind.PLUS, start, start);
      case '-': return this._nextChar(), new Token(Token.Kind.MINUS, start, start);
      case '*': return this._nextChar(), new Token(Token.Kind.MUL, start, start);
      case '/': return this._nextChar(), new Token(Token.Kind.DIV, start, start);
      case '%': return this._nextChar(), new Token(Token.Kind.MOD, start, start);
      case ',': return this._nextChar(), new Token(Token.Kind.COMMA, start, start);
      case '=': {
        const end = this._loc();
        if (this._nextChar() == '=') {
          const end = this._loc();
          this._nextChar();
          return new Token(Token.Kind.DOUBLE_EQUAL, start, end);
        }
        return new Token(Token.Kind.EQUAL, start, end);
      }
      case '"': {
        var word = '';
        this._nextChar();
        while (this._char != '\"') {
          word += this._char;
          this._nextChar();
          if (this._eof()) {
            return this._error(start, "string not terminated");
          }
        }
        const end = this._loc();
        this._nextChar();
        return new Token(Token.Kind.STRING, start, end, word);
      }
      default: {
        if (Lexer.isIdentStart(this._char)) {
          var word = '';
          var end = start;
          do {
            word += this._char;
            end = this._loc();
            this._nextChar();
          } while (!this._eof() && Lexer.isIdentCont(this._char));
          if (word == "func") return new Token(Token.Kind.FUNC, start, end);
          if (word == "return") return new Token(Token.Kind.RETURN, start, end);
          if (word == "while") return new Token(Token.Kind.WHILE, start, end);
          if (word == "if") return new Token(Token.Kind.IF, start, end);
          if (word == "else") return new Token(Token.Kind.ELSE, start, end);
          if (word == "let") return new Token(Token.Kind.LET, start, end);
          return new Token(Token.Kind.IDENT, start, end, word);
        }
        if (Lexer.isDigit(this._char)) {
          var number = 0;
          var end = start;
          do {
            const digit = this._char.charCodeAt(0) - '0'.charCodeAt(0);
            if ((Number.MAX_SAFE_INTEGER - digit) / 10 <= number) {
              return this._error(start, "integer out of range");
            }
            number = number * 10 + digit;
            end = this._loc();
            this._nextChar();
          } while (!this._eof() && Lexer.isDigit(this._char));
          return new Token(Token.Kind.INT, start, end, number);
        }
        return this._error(start, `unknown character '${this._char}'`);
      }
    }
    return null;
  }

  _eof() {
    return this._index == this._source.length + 1;
  }

  _error(start, message) {
    const end = this._loc();
    this._index = this._source.length;
    console.error(message);
    return null;
  }

  tokenize() {
    const tokens = [];
    var token;
    while (token = this._nextToken()) {
      tokens.push(token);
    }
    return tokens;
  }
};
