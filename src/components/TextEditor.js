import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { PreviewModal } from './PreviewModal';

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      saveContent: [],
    };
  }

  onEditorStateChange = (editorState) => {
    console.log(editorState);
    this.setState({
      editorState,
    });
  };
  onChange = (e) => {
    // console.log(e.target.value);
    this.setState({ saveContent: e.target.value });
  };
  saveTxtContent = (e) => {
    e.preventDefault();
    console.log('save Data', this.state.saveContent);
    this.setState({ saveContent: [] });
  };

  render() {
    const { editorState } = this.state;

    return (
      <div>
        <form>
          <Editor
            editorState={editorState}
            wrapperClassName="rich-editor demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
            placeholder="The message goes here..."
            // value={this.state.saveContent}
            // onChange={this.onChange}
          />

          <button onClick={this.saveTxtContent}>Save</button>
        </form>

        {this.state.saveContent}

        {/* {editorState} */}
        {/* <h4>Underlying HTML</h4>
        <div className="html-view">{getHtml(editorState)}</div> */}
        {/* <button
          className="btn btn-success"
          data-toggle="modal"
          data-target="#previewModal"
        >
          Preview message
        </button> */}
        {/* <PreviewModal output={getHtml(editorState)} /> */}
      </div>
    );
  }
}

export default TextEditor;
