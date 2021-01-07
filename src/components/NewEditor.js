import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SaveFile } from '../../src/redux/reducer';
import { stateToHTML } from 'draft-js-export-html';
import dataJson from '../db.json';
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
      text: '',
      body: EditorState.createEmpty(),
    };
  }

  // componentDidMount() {
  //   // Load editor data (raw js object) from local storage
  //   const rawEditorData = this.getSavedEditorData();
  //   // this.props.uploadFile();

  //   if (rawEditorData !== null) {
  //     const contentState = convertFromRaw(rawEditorData);
  //     this.setState({
  //       editorState: EditorState.createWithContent(contentState),
  //     });
  //   }
  // }

  ReloadTextFile = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var preview = JSON.stringify(
        convertToRaw(this.state.body.getCurrentContent())
      );
      var file = document.querySelector('input[type=file]').files[0];
      console.log(file);
      var reader = new FileReader();

      var textFile = /text.*/;

      if (file.type.match(textFile)) {
        reader.onload = function (event) {
          console.log(reader);
          this.props.SaveFile(reader);
          preview = event.target.result;
        };
      } else {
        preview =
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

  onChange = (editorState, e) => {
    // Convert to raw js object
    const raw = convertToRaw(editorState.getCurrentContent());
    // Save raw js object to local storage
    this.saveEditorContent(raw);

    this.setState({ [e.target.name]: e.target.value });
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

  SaveTxtFile = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [JSON.stringify(convertToRaw(this.state.body.getCurrentContent()))],
      {
        type: 'text/plain',
      }
    );
    this.props.SaveFile(file);
    element.href = URL.createObjectURL(file);
    element.download = 'myFile.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  getText = () => {
    return stateToHTML(this.state.body.getCurrentContent());
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
    const { text, body } = this.state;

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
            id="show-text"
            onChange={(value) => this.setState({ body: value })}
            editorState={body}
            handleKeyCommand={this.handleKeyCommand}
            // onChange={this.onChange}
            // onChangeText={this.onChangeText}
            // value={this.state.text}
            // name="editorState"
          />
        </div>
        <div className="allButtons">
          {/* <button onClick={this.convertToRaw}>Convert to raw</button> */}
          {/* <button onClick={() => this.props.uploadFile()}>Get Data</button> */}
          <button className="saveButton" onClick={this.SaveTxtFile}>
            Save File
          </button>
          <input type="file" onChange={this.ReloadTextFile} />
          {/* <textarea
            id="show-text"
            value={this.state.value}
            name="text"
            onChangeText={this.onChangeText}
            rows="4"
            cols="50"
          ></textarea> */}
        </div>

        {/* <pre>{this.convertToRaw()}</pre> */}
        {/* <div dangerouslySetInnerHTML={{ __html: this.getText() }}></div> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { SaveFile })(NewEditor);
