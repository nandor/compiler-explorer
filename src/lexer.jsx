import React from 'react';



export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const rows = [];
    let row = 0;
    console.log(this.props.tokens);
    for (const token of this.props.tokens) {
      while (token.loc.row != row) {
        rows.push([]);
        row += 1;
      }
      rows[rows.length - 1].push(token);
    }

    return (
      <div className="lexer-row">
        {rows.map((tokens, rowNo) =>
          <div key={rowNo}>
            <div className="lexer-token">
              {tokens.map((token, tokenNo) => {
                const marginLeft = tokenNo == 0 ? token.loc.col * 10 : 0;
                return (
                  <div style={{ marginLeft }} key={tokenNo}>
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
