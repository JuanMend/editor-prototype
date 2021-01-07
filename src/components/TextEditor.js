import React, { Component } from 'react';
import {
  Editor,
  Col,
  Button,
  PageHeader,
  EditorState,
  ContentState,
  DraftPasteProcessor,
} from 'draft-js';

class TextEditor extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleOnClick = this.handleOnClick.bind(this);

    const processedHTML = DraftPasteProcessor.processHTML(
      this.props.rule.description.replace(/\n/g, '<br />')
    );
    const contentState = ContentState.createFromBlockArray(processedHTML);
    var editorState = EditorState.createWithContent(contentState);
    var editorState = EditorState.moveFocusToEnd(editorState);
    this.state = { editorState: editorState };
    this.onChange = (editorState) => this.setState({ editorState });
  }

  handleOnClick(event) {
    var text = this.state.editorState.getCurrentContent().getBlocksAsArray();
    var finalText;
    text.map((item) => {
      finalText = item.getText() + finalText;
    });
    console.log(finalText);
  }
  render() {
    return (
      <div>
        <Col smOffset={2} mdOffset={1}>
          <PageHeader>{this.props.rule.title}</PageHeader>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </Col>

        <Col smOffset={2} mdOffset={1}>
          <Button onClick={this.handleOnClick()}>Update rule</Button>
        </Col>
      </div>
    );
  }
}

export default TextEditor;
