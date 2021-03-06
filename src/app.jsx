import React from 'react';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import Lexer from './lexer'
import Parser from './parser'
import Bytecode from './bytecode'
import Console from './console'

import LangLexer from './lang/lexer';
import LangParser from './lang/parser';

const INITIAL_SOURCE=`
func print_int(a: int): int = "print_int";
func read_int(): int = "read_int";

func exp(a: int, n: int): int {
  if (n == 0) {
    return 1;
  } else {
    let b : int = exp(a, n / 2);
    if (n % 2 == 0) {
      return b * b;
    } else {
      return b * b * a;
    }
  }
}

print_int(exp(read_int(), read_int()));
`;



export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: '',
      tokens: [],
      ast: null
    };
  }

  componentDidMount() {
    this.onSourceChange(INITIAL_SOURCE);
  }

  onSourceChange(source) {
    try {
      const tokens = new LangLexer(source).tokenize();
      try {
        const ast = new LangParser(tokens).parse();
        this.setState({ source, tokens, ast });
      } catch (e) {
        console.error(e);
        this.setState({ source, tokens, ast: null});
      }
    } catch (e) {
      console.error(e);
      this.setState({ source, tokens: [], ast: null });
    }
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
                value={this.state.source}
                onChange={this.onSourceChange.bind(this)}
                editorProps={{ $blockScrolling: true }}
            />
          </div>
          <div className="separator"></div>
          <div className="panel lexer">
            <Lexer tokens={this.state.tokens} />
          </div>
          <div className="separator"></div>
          <div className="panel parser">
            <Parser ast={this.state.ast} />
          </div>
          <div className="separator"></div>
          <div className="panel bytecode"><Bytecode /></div>
          <div className="separator"></div>
          <div className="panel console"><Console /></div>
        </div>
      </div>
    );
  }
}
