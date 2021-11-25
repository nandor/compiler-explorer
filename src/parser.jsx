import React from 'react';
import * as ast from './lang/ast';

const NODE_HEIGHT = 20;
const NODE_OFFSET = 30;
const NODE_PAD = 5;



export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.ast) {
      return null;
    }

    var offsetY = 0;
    return (
      <svg className="parser" width="1000" height="5000">
        <defs>
          <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        {this.props.ast.items.map((top, topIdx) => {
          var childNode;
          if (top instanceof ast.FuncDecl) {
            childNode = this.renderFuncDecl(top);
          } else if (top instanceof ast.ProtoDecl) {
            childNode = this.renderProtoDecl(top);
          } else if (top instanceof ast.InitStmt) {
            childNode = this.renderStmt(top.stmt);
          } else {
            return null;
          }
          const { child, height } = childNode;
          const node =(
            <g key={topIdx} transform={`translate(0 ${offsetY})`}>{child}</g>
          )
          offsetY += height;
          return node;
        })}
      </svg>
    );
  }

  renderFuncDecl(decl) {
    var { child, height } = this.renderStmt(decl.body);
    const NODE_HEIGHT = 20;
    const args = decl.args.map(({ name, type }) => `${name}:${type}`);
    const name = `function ${decl.name}(${args.join(',')})`;
    return {
      child:
        <g>
          <rect height={NODE_HEIGHT} stroke='black' fill='white' width={4+name.length * 10}/>
          <text
            y='16'
            x='3'
            fontSize='16'
            fontFamily='monospace'>
            {name}
          </text>
          <line
              x1='10'
              y1={NODE_HEIGHT}
              x2='10'
              y2={NODE_HEIGHT + NODE_HEIGHT / 2 + NODE_PAD}
              stroke='black' />
          <line
              x1='10'
              y1={NODE_HEIGHT + NODE_HEIGHT / 2 + NODE_PAD}
              x2='20'
              y2={NODE_HEIGHT + NODE_HEIGHT / 2 + NODE_PAD}
              stroke='black'
              markerEnd='url(#arrowhead)' />
          <g transform={`translate(${NODE_OFFSET} ${NODE_HEIGHT + NODE_PAD})`}>{child}</g>
        </g>,
        height: height + NODE_HEIGHT + NODE_PAD * 3
    };
  }

  renderProtoDecl(decl) {
    const name = `builtin ${decl.name} => "${decl.proto}"`;
    return {
      child:
        <g>
          <rect height={NODE_HEIGHT} stroke='black' fill='white' width={4+name.length * 10}/>
          <text
            y='16'
            x='3'
            fontSize='16'
            fontFamily='monospace'>
            {name}
          </text>
        </g>,
        height: NODE_HEIGHT + NODE_PAD * 3
      };
  }

  renderStmt(stmt) {
    if (stmt instanceof ast.BlockStmt) {
      var offset = NODE_HEIGHT + NODE_PAD;
      var lastOffset = offset;
      const children = stmt.stmts.map((childStmt, childIdx) => {
        const { child, height } = this.renderStmt(childStmt);
        const childOffset = lastOffset = offset;
        offset += height;
        return (
            <g
                key={childIdx}
                transform={`translate(${NODE_OFFSET} ${childOffset})`}>
              {this._renderArrow()}
              {child}
            </g>
        );
      });
      return {
        child:
          <g>
            <rect height={NODE_HEIGHT} stroke='black' fill='white' width='92'/>
            <text
                fontFamily='monospace'
                fontSize='16'
                y='16'
                x='3'>
              BlockStmt
            </text>
            <line
                x1='10'
                x2='10'
                y1={NODE_HEIGHT}
                y2={lastOffset + NODE_HEIGHT / 2}
                stroke='black' />
            {children}
          </g>,
        height: offset + NODE_PAD
      };
    }
    if (stmt instanceof ast.ReturnStmt) {
      const { child, height } = this.renderExpr(stmt.expr);
      return {
        child:
          <g>
            <rect height={NODE_HEIGHT} stroke='black' fill='white' width='103'/>
            <text
                fontFamily='monospace'
                fontSize='16'
                y='16'
                x='3'>
              ReturnStmt
            </text>
            <g transform={`translate(120 0)`}>{child}</g>
            <line
                x1='103'
                x2='110'
                y1={NODE_HEIGHT / 2}
                y2={NODE_HEIGHT / 2}
                stroke='black'
                  markerEnd='url(#arrowhead)' />
          </g>,
        height: Math.max(NODE_HEIGHT, height) + NODE_PAD
      };
    }

    if (stmt instanceof ast.IfStmt) {
      var height = NODE_HEIGHT;

      const { child: childCond, height: heightCond } = this.renderExpr(stmt.cond);
      const { child: childTrue, height: heightTrue } = this.renderStmt(stmt.trueStmt);

      const offsetCond = NODE_HEIGHT + NODE_PAD;
      const offsetTrue = offsetCond + heightCond;
      const offsetFalse = offsetTrue + heightTrue;

      var childFalse = null, heightFalse = 0;
      if (stmt.falseStmt) {
        const { child, height } = this.renderStmt(stmt.falseStmt);
        childFalse = child;
        heightFalse = height;
      }

      return {
        child:
          <g>
            <rect height={NODE_HEIGHT} stroke='black' fill='white' width='55'/>
            <text fontSize='16' y='16'>IfStmt</text>
            <g transform={`translate(${NODE_OFFSET} ${offsetCond})`}>
              {childCond}
              {this._renderArrow()}
            </g>
            <g transform={`translate(${NODE_OFFSET} ${offsetTrue})`}>
              {this._renderArrow()}
              {childTrue}
            </g>
            { childFalse ? (
              <g transform={`translate(${NODE_OFFSET} ${offsetFalse})`}>
                <line
                    x1={-NODE_OFFSET+10}
                    y1={NODE_HEIGHT / 2 + NODE_PAD}
                    x2={-10}
                    y2={NODE_HEIGHT / 2 + NODE_PAD}
                    stroke='black'
                    markerEnd='url(#arrowhead)' />
                {childFalse}
              </g>
            ) : null}
            <line
                x1='10'
                x2='10'
                y1={NODE_HEIGHT}
                y2={(childFalse ? offsetFalse : offsetTrue) + NODE_HEIGHT / 2 + NODE_PAD}
                stroke='black' />
          </g>,
        height: (childFalse ? offsetFalse + heightFalse : offsetFalse) + NODE_PAD
      };
    }

    if (stmt instanceof ast.LetStmt) {
      const { child, height } = this.renderExpr(stmt.init);
      return {
        child:
          <g>
            <rect height={NODE_HEIGHT} stroke='black' fill='white' width='75'/>
            <text
                fontFamily='monospace'
                fontSize='16'
                y='16'
                x='3'>
              LetStmt
            </text>
            <text
                fontSize='16'
                x={NODE_OFFSET}
                y={NODE_HEIGHT + 20}>
                {`${stmt.name} : ${stmt.type}`}
            </text>
            <line
                x1={10}
                y1={NODE_HEIGHT + 15}
                x2={20}
                y2={NODE_HEIGHT + 15}
                stroke='black'
                markerEnd='url(#arrowhead)' />;
            <g transform={`translate(${NODE_OFFSET} ${NODE_HEIGHT + 30})`}>
              {this._renderArrow()}
              {child}
            </g>
            <line
                x1='10'
                x2='10'
                y1={NODE_HEIGHT}
                y2={NODE_HEIGHT + 30 + NODE_HEIGHT / 2}
                stroke='black' />
          </g>,
        height: NODE_HEIGHT + 30 + height + NODE_PAD
      };
    }

    if (stmt instanceof ast.ExprStmt) {
      const { child, height } = this.renderExpr(stmt.expr);
      return {
        child:
          <g>
            <rect height={NODE_HEIGHT} stroke='black' fill='white' width='83'/>
            <text
                fontFamily='monospace'
                fontSize='16'
                y='16'
                x='3'>
              ExprStmt
            </text>
            <g transform={`translate(103 0)`}>{this._renderArrow()}{child}</g>
          </g>,
        height: Math.max(NODE_HEIGHT, height) + NODE_PAD
      };
    }
    console.error(stmt);
  }

  renderExpr(expr) {
    if (expr instanceof ast.RefExpr) {
      return {
        child:
          <g>
            <rect height={NODE_HEIGHT} stroke='gray' fill='white' width={4+expr.name.length * 10.5}/>
            <text x='3' y='16' fontSize='16' fontFamily='monospace'>{expr.name}</text>
          </g>,
        height: NODE_HEIGHT + NODE_PAD
      };
    }
    if (expr instanceof ast.IntExpr) {
      var length = `${expr.value}`.length;
      return {
        child:
          <g>
            <rect height={NODE_HEIGHT} stroke='gray' fill='white' width={4+length * 10.5}/>
            <text x='3' y='16' fontSize='16' fontFamily='monospace'>{expr.value}</text>
          </g>,
        height: NODE_HEIGHT + NODE_PAD
      };
    }
    if (expr instanceof ast.BinaryExpr) {
      const { child: childLHS, height: heightLHS } = this.renderExpr(expr.lhs);
      const { child: childRHS, height: heightRHS } = this.renderExpr(expr.rhs);

      const op = expr.op.description;

      return {
          child:
            <g>
              <rect height={NODE_HEIGHT} stroke='gray' fill='white' width={op.length * 10 + 4}/>
              <text x='3' y='16' fontSize='16' fontFamily='monospace'>{op}</text>
              <g transform={`translate(${NODE_OFFSET} ${NODE_HEIGHT + NODE_PAD})`}>
                {this._renderArrow()}
                {childLHS}
              </g>
              <g transform={`translate(${NODE_OFFSET} ${NODE_HEIGHT + NODE_PAD + heightLHS})`}>
                {this._renderArrow()}
                {childRHS}
              </g>
              <line
                  x1='10'
                  x2='10'
                  y1={NODE_HEIGHT}
                  y2={heightLHS + NODE_HEIGHT + NODE_PAD + NODE_HEIGHT / 2}
                  stroke='black' />
            </g>,
            height: heightLHS + heightRHS + NODE_PAD + NODE_HEIGHT
      };
    }
    if (expr instanceof ast.CallExpr) {
      const { child: childCallee, height: heightCallee } = this.renderExpr(expr.callee);
      var offset = NODE_HEIGHT + NODE_PAD;
      var lastOffset = offset
      const args = expr.args.map((arg, argIdx) => {
        const childOffset = lastOffset = offset;
        const { child, height } = this.renderExpr(arg);
        offset += height;
        return (
          <g key={argIdx} transform={`translate(${NODE_OFFSET} ${childOffset})`}>
            {child}
            {this._renderArrow()}
          }
          </g>
        );
      });
      return {
          child:
            <g>
              <rect height={NODE_HEIGHT} stroke='gray' fill='white' width='83'/>
              <text x='3' y='16' fontSize='16' fontFamily='monospace'>CallExpr</text>
              <g transform={`translate(103 0)`}>
                {childCallee}
                {this._renderArrow()}
              </g>
              {args}
              {args.length == 0 ? null : (
                <line
                    x1='10'
                    x2='10'
                    y1={NODE_HEIGHT}
                    y2={lastOffset + NODE_HEIGHT / 2}
                    stroke='black' />
              )}
            </g>,
          height: Math.max(
              heightCallee + NODE_PAD,
              offset
          )
      };
    }
    console.error(expr);
  }

  _renderArrow(height) {
    return <line
          x1={-NODE_OFFSET+10}
          y1={NODE_HEIGHT / 2}
          x2={-10}
          y2={NODE_HEIGHT / 2}
          stroke='black'
          markerEnd='url(#arrowhead)' />;
  }
};
