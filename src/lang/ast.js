

export class Node {

}

export class TopLevelStmt extends Node {
  constructor() {
    super();
  }
}

export class FuncOrProtoDecl extends TopLevelStmt {
  constructor(name, args, type) {
    super();
    this.name = name;
    this.args = args;
    this.type = type;
  }
}

export class FuncDecl extends FuncOrProtoDecl {
  constructor(name, args, type, body) {
    super(name, args, type);
    this.body = body;
  }
}

export class ProtoDecl extends FuncOrProtoDecl {
  constructor(name, args, type, proto) {
    super(name, args, type);
    this.proto = proto;
  }
}

export class InitStmt extends TopLevelStmt {
  constructor(stmt) {
    super();
    this.stmt = stmt;
  }
}

export class Module extends Node {
  constructor(toplevel) {
    super();
    this.toplevel = toplevel;
  }
}


export class Stmt extends Node {
  constructor() {
    super();
  }
}

export class BlockStmt extends Stmt {
  constructor(stmts) {
    super();
    this.stmts = stmts;
  }
}

export class ReturnStmt extends Stmt {
  constructor(expr) {
    super();
    this.expr = expr;
  }
}

export class IfStmt extends Stmt {
  constructor(cond, trueStmt, falseStmt) {
    super();
    this.cond = cond;
    this.trueStmt = trueStmt;
    this.falseStmt = falseStmt;
  }
}

export class LetStmt extends Stmt {
  constructor(name, type, init) {
    super();
    this.name = name;
    this.type = type;
    this.init = init;
  }
}

export class ExprStmt extends Stmt {
  constructor(expr) {
    super();
    this.expr = expr;
  }
}


export class Expr extends Node {
  constructor() {
    super();
  }
}

export class RefExpr extends Expr {
  constructor(name) {
    super();
    this.name = name;
  }
}

export class IntExpr extends Expr {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class BinaryExpr extends Expr {
  static Kind = Object.freeze({
      EQ: Symbol("EQ"),
      ADD: Symbol("ADD"),
      SUB: Symbol("SUB"),
      MUL: Symbol("MUL"),
      DIV: Symbol("DIV"),
      MOD: Symbol("MOD"),
  });

  constructor(lhs, rhs, op) {
    super();
    this.lhs = lhs;
    this.rhs = rhs;
    this.op = op;
  }
}

export class CallExpr extends Expr {
  constructor(callee, args) {
    super();
    this.callee = callee;
    this.args = args;
  }
}
