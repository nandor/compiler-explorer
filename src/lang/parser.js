import Token from './token';
import * as ast from './ast';

class ParserError {
  constructor(loc, message) {

  }
}

export default class Parser {
  constructor(tokens) {
    this._tokens = tokens;
    this._index = 0;
  }

  _current() {
    return this._index < this._tokens.length ? this._tokens[this._index] : null;
  }

  _next() {
    ++this._index;
    return this._current();
  }

  _error(token, message) {
    console.error(token.start, message);
    this._index = this._tokens.length;
    // TODO: report error
    return null;
  }

  _check(ref) {
    var tk = this._current();
    if (tk.kind != ref) {
      return this._error(
          tk,
          `$unexpected token ${tk}, expected ${ref.description}`
      );
    }
    return tk;
  }

  _expect(tk) {
    this._next();
    return this._check(tk);
  }

  parse() {
    const top = [];

    var token;
    while (token = this._current()) {
      if (token.kind == Token.Kind.FUNC) {
        const name = this._expect(Token.Kind.IDENT).value;

        const args = [];
        this._expect(Token.Kind.LPAREN);

        var current;
        while ((current = this._next()) && current.kind != Token.Kind.RPAREN) {
          const argName = this._check(Token.Kind.IDENT).value;
          this._expect(Token.Kind.COLON);
          this._next();
          const argType = this.parseType();
          args.push({ name: argName, type: argType });
          if (this._current().kind != Token.Kind.COMMA) {
            break;
          }
        }
        this._check(Token.Kind.RPAREN);
        this._expect(Token.Kind.COLON);
        this._next();
        const type = this.parseType();
        if (this._current().kind == Token.Kind.EQUAL) {
          const proto = this._expect(Token.Kind.STRING).value;
          this._expect(Token.Kind.SEMI);
          this._next();
          top.push(new ast.ProtoDecl(name, args, type, proto));
        } else {
          top.push(new ast.FuncDecl(name, args, type, this.parseBlockStmt()));
        }
      } else {
        top.push(new ast.InitStmt(this.parseStmt()));
      }
    }

    return new ast.Module(top);
  }

  parseType() {
    const type = this._check(Token.Kind.IDENT).value;
    this._next();
    return type;
  }

  parseStmt() {
    const tk = this._current();
    switch (tk.kind) {
      case Token.Kind.LBRACE: {
        return this.parseBlockStmt();
      }
      case Token.Kind.IF: {
        this._expect(Token.Kind.LPAREN);
        this._next();
        const cond = this.parseExpr();
        this._check(Token.Kind.RPAREN);
        this._next();
        const trueStmt = this.parseStmt();

        const tkElse = this._current();
        var falseStmt = null;
        if (tkElse && tkElse.kind == Token.Kind.ELSE) {
          this._next();
          falseStmt = this.parseStmt();
        }
        return new ast.IfStmt(cond, trueStmt, falseStmt);
      }
      case Token.Kind.RETURN: {
        this._next();
        const expr = this.parseExpr();
        this._check(Token.Kind.SEMI);
        this._next();
        return new ast.ReturnStmt(expr);
      }
      case Token.Kind.LET: {
        const name = this._expect(Token.Kind.IDENT).value;
        this._expect(Token.Kind.COLON);
        const type = this._expect(Token.Kind.IDENT).value;
        this._expect(Token.Kind.EQUAL);
        this._next();
        const expr = this.parseExpr();
        this._check(Token.Kind.SEMI);
        this._next();
        return new ast.LetStmt(name, type, expr);
      }
      default: {
        const expr = this.parseExpr();
        this._check(Token.Kind.SEMI);
        this._next();
        return new ast.ExprStmt(expr);
      }
    }
  }

  parseBlockStmt() {
    this._check(Token.Kind.LBRACE);
    this._next();

    const stmts = [];

    var token;
    while ((token = this._current()) && token.kind != Token.Kind.RBRACE) {
      stmts.push(this.parseStmt());
    }

    this._check(Token.Kind.RBRACE);
    this._next();

    return new ast.BlockStmt(stmts);
  }

  parseExpr() {
    return this.parseCmpExpr();
  }

  parseCmpExpr() {
    var lhs = this.parseAddSubExpr();

    var tk;
    while ((tk = this._current()) && (tk.kind == Token.Kind.DOUBLE_EQUAL)) {
      this._next();
      const rhs = this.parseAddSubExpr();
      lhs = new ast.BinaryExpr(lhs, rhs, ast.BinaryExpr.Kind.EQ);
    }

    return lhs;
  }

  parseAddSubExpr() {
    var lhs = this.parseMulDivRemExpr();

    var tk;
    while ((tk = this._current()) && (tk.kind == Token.Kind.ADD || tk.kind == Token.Kind.SUB)) {
      this._next();
      const rhs = this.parseMulDivRemExpr();
      lhs = new ast.BinaryExpr(
          lhs,
          rhs,
          tk.kind == Token.Kind.ADD ? ast.BinaryExpr.Kind.ADD : ast.BinaryExpr.Kind.SUB
      );
    }

    return lhs;
  }

  parseMulDivRemExpr() {
    var lhs = this.parseCallExpr();

    var tk;
    while ((tk = this._current()) && (tk.kind == Token.Kind.MUL || tk.kind == Token.Kind.DIV || tk.kind == Token.Kind.MOD)) {
      this._next();
      const rhs = this.parseCallExpr();
      lhs = new ast.BinaryExpr(
          lhs,
          rhs,
          tk.kind == Token.Kind.MUL ? ast.BinaryExpr.Kind.MUL :
          tk.kind == Token.Kind.DIV ? ast.BinaryExpr.Kind.DIV :
          ast.BinaryExpr.Kind.MOD
      );
    }

    return lhs;
  }

  parseCallExpr() {
    var term = this.parseTerm();

    var tk;
    while ((tk = this._current()) && tk.kind == Token.Kind.LPAREN) {
      const args = [];

      var argTk;
      while ((argTk = this._next()) && argTk.kind != Token.Kind.RPAREN) {
        args.push(this.parseExpr());

        var commaTk;
        if (!(commaTk = this._current()) || commaTk.kind != Token.Kind.COMMA) {
          break;
        }
      }
      this._check(Token.Kind.RPAREN);
      this._next();

      term = new ast.CallExpr(term, args);
    }

    return term;
  }

  parseTerm() {
    const tk = this._current();
    switch (tk.kind) {
      case Token.Kind.IDENT: {
        const name = tk.value;
        this._next();
        return new ast.RefExpr(name);
      }
      case Token.Kind.INT: {
        const value = tk.value;
        this._next();
        return new ast.IntExpr(value);
      }
      default: {
        return this._error(
            tk,
            `unexpected ${tk}, expected an expression`
        );
      }
    }
  }
}
