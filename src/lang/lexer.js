import Token, { Kind } from './token'


class Location {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  toString() {
    return `${this.row},${this.col}`
  }
}

class LexerError {
  constructor(loc, message) {

  }
}

export default class Lexer {
  constructor(source) {
    this.source = source;
    this.index = 0;
    this.char = '\0';
    this.row = 1;
    this.col = 0;
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

  _nextChar() {
    if (this.index >= this.source.length) {
      return null;
    }
    this.char = this.source[this.index];
    this.index++;
    if (this.char == '\n') {
      this.row++;
      this.col = 0;
    } else {
      this.col++;
    }
    return this.char;
  }

  _nextToken() {
    while (!this._eof() && Lexer.isWhitespace(this.char)) {
      this._nextChar();
    }

    const loc = new Location(this.row, this.col);
    switch (this.char) {
      case '\0': return new Token(Kind.EOF, loc);
      case '(': return this._nextChar(), new Token(Kind.LPAREN, loc);
      case ')': return this._nextChar(), new Token(Kind.RPAREN, loc);
      case '{': return this._nextChar(), new Token(Kind.LBRACE, loc);
      case '}': return this._nextChar(), new Token(Kind.RBRACE, loc);
      case ':': return this._nextChar(), new Token(Kind.COLON, loc);
      case ';': return this._nextChar(), new Token(Kind.SEMI, loc);
      case '+': return this._nextChar(), new Token(Kind.PLUS, loc);
      case '-': return this._nextChar(), new Token(Kind.MINUS, loc);
      case '*': return this._nextChar(), new Token(Kind.MUL, loc);
      case '/': return this._nextChar(), new Token(Kind.DIV, loc);
      case '%': return this._nextChar(), new Token(Kind.MOD, loc);
      case ',': return this._nextChar(), new Token(Kind.COMMA, loc);
      case '=': {
        if (this._nextChar() == '=') {
          return this._nextChar(), new Token(Kind.DOUBLE_EQUAL, loc);
        }
        return new Token(Kind.EQUAL, loc);
      }
      case '"': {
        var word = '';
        this._nextChar();
        while (this.char != '\"') {
          word += this.char;
          this._nextChar();
          if (this._eof()) {
            return this._error(loc, "string not terminated");
          }
        }
        this._nextChar();
        return new Token(Kind.STRING, loc, word);
      }
      default: {
        if (Lexer.isIdentStart(this.char)) {
          var word = '';
          do {
            word += this.char;
            this._nextChar();
          } while (!this._eof() && Lexer.isIdentCont(this.char));
          if (word == "func") return new Token(Kind.FUNC, loc);
          if (word == "return") return new Token(Kind.RETURN, loc);
          if (word == "while") return new Token(Kind.WHILE, loc);
          return new Token(Kind.IDENT, loc, word);
        }
        if (Lexer.isDigit(this.char)) {
          var number = 0;
          do {
            const digit = this.char.charCodeAt(0) - '0'.charCodeAt(0);
            if ((Number.MAX_SAFE_INTEGER - digit) / 10 <= number) {
              return this._error(loc, "integer out of range");
            }
            number = number * 10 + digit;
            this._nextChar();
          } while (!this._eof() && Lexer.isDigit(this.char));
          return new Token(Kind.INT, loc, number);
        }
        return this._error(loc, `unknown character '${this.char}'`);
      }
    }
    return null;
  }

  _eof() {
    return this.index == this.source.length;
  }

  _error(loc, message) {
    this.index = this.source.length;
    return new Token(Kind.ERROR, loc);
  }

  tokenize() {
    const tokens = [];
    while (!this._eof()) {
      tokens.push(this._nextToken());
    }
    return tokens;
  }
};
