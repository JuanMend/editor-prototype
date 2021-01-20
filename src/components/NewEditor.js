import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SaveFile, loadTxtFile } from '../../src/redux/reducer';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  Editor,
  RichUtils,
} from 'draft-js';

const styleMap = {
  HIGHLIGHT: {
    backgroundColor: '#faed27',
  },
  STRIKETHROUGH: {
    textDecoration: 'line-through',
  },
  HEADER1: {
    fontFamily: '"Times New Roman"',
    fontSize: 32,
  },
  HEADER2: {
    fontFamily: '"Times New Roman"',
    fontSize: 24,
  },
  HEADER3: {
    fontFamily: '"Times New Roman"',
    fontSize: 18,
  },
  HEADER4: {
    fontFamily: '"Times New Roman"',
    fontSize: 16,
  },
};

class NewEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !this.props.loading) {
      this.setState({
        editorState: EditorState.createWithContent(
          convertFromRaw(JSON.parse(this.props.content))
        ),
      });
    }
  }

  newSetContent = () => {
    let file = document.querySelector('input[type=file]').files[0];
    this.props.loadTxtFile(file);
  };

  saveContent = (content) => {
    window.localStorage.setItem(
      'content',
      JSON.stringify(convertToRaw(content))
    );
  };
  onChange = (editorState, e) => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);
    this.setState({
      editorState,
    });
  };

  SaveTxtFile = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        JSON.stringify(
          convertToRaw(this.state.editorState.getCurrentContent())
        ),
      ],
      {
        type: 'text/plain',
      }
    );
    console.log(file);
    this.props.SaveFile(file);
    element.href = URL.createObjectURL(file);
    element.download = 'myFile.txt';
    document.body.appendChild(element);
    element.click();
  };

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  onHeader1 = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'HEADER1')
    );
  };
  onHeader2 = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'HEADER2')
    );
  };
  onHeader3 = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'HEADER3')
    );
  };
  onHeader4 = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'HEADER4')
    );
  };
  onOrderedList = () => {
    this.onChange(
      RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item')
    );
  };
  onUnorderedList = () => {
    this.onChange(
      RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item')
    );
  };

  onStrikeThrough = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'STRIKETHROUGH')
    );
  };
  onHighlight = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT')
    );
  };

  onUnderlineClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE')
    );
  };

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };

  onItalicClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC')
    );
  };

  render() {
    return (
      <div className="main">
        <div className="editorChoice">
          <button onClick={this.onHeader1}>
            <em>H1</em>
          </button>
          <button onClick={this.onHeader2}>
            <em>H2</em>
          </button>
          <button onClick={this.onHeader3}>
            <em>H3</em>
          </button>
          <button onClick={this.onHeader4}>
            <em>H4</em>
          </button>
          <button onClick={this.onUnorderedList}>
            <em>UL</em>
          </button>
          <button onClick={this.onOrderedList}>
            <em>OL</em>
          </button>
          <button onClick={this.onUnderlineClick}>Underline</button>
          <button onClick={this.onBoldClick}>
            <b>Bold</b>
          </button>
          <button onClick={this.onItalicClick}>
            <em>Italic</em>
          </button>
          <button onClick={this.onHighlight}>
            <em>Highlight</em>
          </button>
          <button onClick={this.onStrikeThrough}>
            <em>Strike through</em>
          </button>
        </div>
        <div className="editorComp">
          <Editor
            // id="show-text"
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
          />
        </div>

        <div className="allButtons">
          <button className="saveButton" onClick={this.SaveTxtFile}>
            Save File
          </button>
          <input
            type="file"
            onChange={this.newSetContent}
            className="fileReload"
          />
          <br />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    content: state.content,
    loading: state.loading,
  };
};

export default connect(mapStateToProps, { SaveFile, loadTxtFile })(NewEditor);
