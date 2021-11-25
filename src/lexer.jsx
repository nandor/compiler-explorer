import React from 'react';

import Token from './lang/token';

const TOKEN_CLASS = {
  [Token.Kind.FUNC]: 'keyword',
  [Token.Kind.RETURN]: 'keyword',
  [Token.Kind.WHILE]: 'keyword',
  [Token.Kind.IF]: 'keyword',
  [Token.Kind.ELSE]: 'keyword',
  [Token.Kind.LET]: 'keyword',
  [Token.Kind.LPAREN]: 'separator',
  [Token.Kind.RPAREN]: 'separator',
  [Token.Kind.LBRACE]: 'separator',
  [Token.Kind.RBRACE]: 'separator',
  [Token.Kind.COLON]: 'separator',
  [Token.Kind.SEMI]: 'separator',
  [Token.Kind.COMMA]: 'separator',
  [Token.Kind.EQUAL]: 'op',
  [Token.Kind.DOUBLE_EQUAL]: 'op',
  [Token.Kind.PLUS]: 'op',
  [Token.Kind.MINUS]: 'op',
  [Token.Kind.MUL]: 'op',
  [Token.Kind.DIV]: 'op',
  [Token.Kind.MOD]: 'op',
  [Token.Kind.INT]: 'const',
  [Token.Kind.STRING]: 'const',
  [Token.Kind.IDENT]: 'ident',
};


export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const rows = [];
    let row = 0;

    for (const token of this.props.tokens) {
      while (token.start.row != row) {
        rows.push([]);
        row += 1;
      }
      rows[rows.length - 1].push(token);
    }

    return (
      <div className="lexer-row">
        {rows.map((tokens, rowNo) =>
          <div key={rowNo}>
            <div className="lexer-line-no">{rowNo + 1}</div>
            <div className="lexer-token">
              {tokens.map((token, tokenNo) => {
                const marginLeft = tokenNo == 0 ? token.start.col * 10 : 0;
                return (
                  <div
                      className={`lexer-token-${TOKEN_CLASS[token.kind]}`}
                      style={{ marginLeft }}
                      key={tokenNo}>
                    {`${token}`}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
};
