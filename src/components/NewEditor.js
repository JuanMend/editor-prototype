import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SaveFile, loadTxtFile } from '../../src/redux/reducer';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  Editor,
  RichUtils,
  ContentState,
} from 'draft-js';
import { compose } from 'redux';

class NewEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      editorState: EditorState.createEmpty(),
      // editorState: EditorState.createEmpty(), // EditorState It is an Immutable Record that represents the entire state of a Draft editor
    };
    // const content = window.localStorage.getItem('content');

    // if (content) {
    //   this.state.editorState = EditorState.createWithContent(
    //     convertFromRaw(JSON.parse(content))
    //   );
    // } else {
    //   this.state.editorState = EditorState.createEmpty();
    // }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !this.props.loading) {
      this.newSetContent();
    }
  }
  newSetContent = () => {
    let file = document.querySelector('input[type=file]').files[0];
    this.props.loadTxtFile(file);

    // let newContent = this.props.content;
    // console.log(this.props.content);
    // console.log('hello');

    return this.setState({
      editorState: EditorState.createWithContent(
        convertFromRaw(JSON.parse(this.props.content))
      ),
    });
  };

  setContent = () => {
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader();
    let content = '';

    reader.onload = (e) => {
      let result = reader.result;

      console.log(`content `, result);

      return this.setState({
        content,
        editorState: EditorState.createWithContent(
          convertFromRaw(JSON.parse(result))
        ),
      });
    };

    console.log(reader.readAsText(file));
  };

  saveEditorContent(data) {
    localStorage.setItem('editorData', JSON.stringify(data));
  }

  getSavedEditorData() {
    const savedData = localStorage.getItem('editorData');

    return savedData ? JSON.parse(savedData) : null; // EditorState.createEmpty();
  }

  saveContent = (content) => {
    window.localStorage.setItem(
      'content',
      JSON.stringify(convertToRaw(content))
    );
  };
  onChange = (editorState, e) => {
    // // Convert to raw js object
    // const raw = convertToRaw(editorState.getCurrentContent());
    // // Save raw js object to local storage
    // this.saveEditorContent(raw);

    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);
    this.setState({
      editorState,
    });
  };

  onChangeText = (e) => {
    console.log(e.target.value);
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
    // var text = this.state.editorState.getCurrentContent().getBlocksAsArray();
    // var finalText;
    // text.map((item) => {
    //   finalText = item.getText();
    // });

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
    document.body.appendChild(element); // Required for this to work in FireFox
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
    const { text, body, editorState } = this.state;

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

        {/* <textarea id="show-text" onChange={this.onChangeText} name="text" /> */}
        <div className="allButtons">
          {/* <button onClick={this.convertToRaw}>Convert to raw</button> */}
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
        {/* {JSON.stringify(JSON.parse(this.props.content))} */}
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
