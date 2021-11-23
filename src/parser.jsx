import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="parser">{JSON.stringify(this.props.ast)} </div>
    );
  }
};
