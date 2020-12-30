import React, { Component } from 'react';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  Editor,
  RichUtils,
} from 'draft-js';

// const blockRenderMap = Immutable.Map({
//   'header-two': {
//     element: 'h2',
//   },
//   unstyled: {
//     element: 'h2',
//   },
// });

class NewEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      text: '',
    };
  }

  componentDidMount() {
    // Load editor data (raw js object) from local storage
    const rawEditorData = this.getSavedEditorData();
    if (rawEditorData !== null) {
      const contentState = convertFromRaw(rawEditorData);
      this.setState({
        editorState: EditorState.createWithContent(contentState),
      });
    }
  }

  saveEditorContent(data) {
    localStorage.setItem('editorData', JSON.stringify(data));
  }

  getSavedEditorData() {
    const savedData = localStorage.getItem('editorData');

    return savedData ? JSON.parse(savedData) : null; // EditorState.createEmpty();
  }

  onChange = (editorState) => {
    // Convert to raw js object
    const raw = convertToRaw(editorState.getCurrentContent());
    // Save raw js object to local storage
    this.saveEditorContent(raw);

    this.setState({ editorState });
  };

  onChangeText = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  convertToRaw = () => {
    const { editorState } = this.state;
    console.log(convertToRaw(editorState.getCurrentContent()));
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);

    return JSON.stringify(raw, null, 2);
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

  downloadTxtFile = () => {
    const element = document.createElement('a');
    const file = new Blob([document.getElementById('myInput').value], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = 'myFile.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
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
            className="editorTxt"
            editorState={this.state.editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
            onChangeText={this.onChangeText}
            value={this.state.editorState}
            name="editorState"
            // blockRenderMap={blockRenderMap}
          />
        </div>
        <div>
          {/* <input
            id="myInput"
            value={this.state.value}
            name="text"
            onChangeText={this.onChangeText}
          /> */}
          <button onClick={this.convertToRaw}>Convert to raw</button>
          <button onClick={this.downloadTxtFile}>Save File</button>
          <button>Reload File</button>
          <pre>{this.convertToRaw()}</pre>
        </div>
      </div>
    );
  }
}

export default NewEditor;
