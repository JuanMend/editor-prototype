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

  showFile = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var preview = document.getElementById('show-text');
      var file = document.querySelector('input[type=file]').files[0];
      var reader = new FileReader();

      var textFile = /text.*/;

      if (file.type.match(textFile)) {
        reader.onload = function (event) {
          preview.innerHTML = event.target.result;
        };
      } else {
        preview.innerHTML =
          "<span class='error'>It doesn't seem to be a text file!</span>";
      }
      reader.readAsText(file);
    } else {
      alert('Your browser is too old to support HTML5 File API');
    }
  };
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
    const file = new Blob([document.getElementById('show-text').value], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = 'myFile.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  uploadFile(event) {
    let file = event.target.files[0];
    console.log(file);

    if (file) {
      let data = new FormData();
      data.append('file', file);
      // axios.post('/files', data)...
    }
  }
  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ image: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
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
            // onChangeText={this.onChangeText}
            // value={this.state.editorState}
            // name="editorState"
          />
        </div>
        <div className="allButtons">
          {/* <button onClick={this.convertToRaw}>Convert to raw</button> */}
          <button className="saveButton" onClick={this.downloadTxtFile}>
            Save File
          </button>
          <input type="file" onChange={this.showFile} />
          <textarea
            id="show-text"
            value={this.state.value}
            name="text"
            onChangeText={this.onChangeText}
            rows="4"
            cols="50"
          ></textarea>
        </div>

        {/* <pre>{JSON.parse(this.uploadFile)}</pre> */}
      </div>
    );
  }
}

export default NewEditor;
