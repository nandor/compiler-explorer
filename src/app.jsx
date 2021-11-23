import React from 'react';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import Lexer from './lexer'
import Parser from './parser'
import Bytecode from './bytecode'
import Console from './console'

import LangLexer from './lang/lexer';

const INITIAL_SOURCE=`
func print_int(a: int): int = "print_int"
func read_int(): int = "read_int"

func exp(a: int, n: int): int {
  if (n == 0) {
    return 1
  } else {
    let b : int = exp(a, n / 2);
    if (n % 2 == 0) {
      return b * b
    } else {
      return b * b * a
    }
  }
}

print_int(exp(read_int(), read_int()))
`;



export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: '',
      tokens: []
    };
  }

  componentDidMount() {
    this.onSourceChange(INITIAL_SOURCE);
  }

  onSourceChange(source) {
    this.setState({
      source: source,
      tokens: new LangLexer(source).tokenize()
    });
  }

  render() {
    return (
      <div className="app">
        <div className="toolbar"></div>
        <div className="panels">
          <div className="panel editor">
            <AceEditor
                theme="github"
                name="editor"
                mode="java"
                width="100%"
                height="100%"
                defaultValue={INITIAL_SOURCE}
                onChange={this.onSourceChange.bind(this)}
                editorProps={{ $blockScrolling: true }}
            />
          </div>
          <div className="separator"></div>
          <div className="panel lexer">
            <Lexer tokens={this.state.tokens} />
          </div>
          <div className="separator"></div>
          <div className="panel parser"><Parser /></div>
          <div className="separator"></div>
          <div className="panel bytecode"><Bytecode /></div>
          <div className="separator"></div>
          <div className="panel console"><Console /></div>
        </div>
      </div>
    );
  }
}
