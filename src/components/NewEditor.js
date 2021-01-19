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
          <button onClick={this.onUnderlineClick}>U</button>
          <button onClick={this.onBoldClick}>
            <b>B</b>
          </button>
          <button onClick={this.onItalicClick}>
            <em>I</em>
          </button>
        </div>
        <div className="editorComp">
          <Editor
            // id="show-text"
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
