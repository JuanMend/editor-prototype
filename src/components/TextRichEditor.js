import React, { Component } from 'react';
import RichTextEditor from 'react-rte';
import PropTypes from 'prop-types';

class TextRichEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func,
  };

  state = {
    value: RichTextEditor.createEmptyValue(),
  };

  onChange = (value, e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(value.toString('html'));
    }
  };

  ReloadTextFile = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      const { editorState } = this.state;

      // var preview = JSON.stringify(
      //   convertToRaw(this.state.editorState.getCurrentContent()) //provides the ContentState currently being rendered in the editor
      // );
      var preview = document.getElementById('show-text');

      var file = document.querySelector('input[type=file]').files[0];

      var reader = new FileReader(); //lets web applications asynchronously read the contents of files (or raw data buffers) stored on the user's computer
      this.props.SaveFile(reader);

      var textFile = /text.*/;

      if (file.type.match(textFile)) {
        reader.onload = function (event) {
          // console.log(reader);
          // this.props.SaveFile(reader.result);
          console.log(preview);

          // preview = event.target.result;
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

  SaveTxtFile = () => {
    const element = document.createElement('a');
    const file = new Blob([document.getElementById('show-text').value], {
      type: 'text/plain',
    });
    // this.props.SaveFile(file);
    element.href = URL.createObjectURL(file);
    element.download = 'myFile.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  render() {
    return (
      <div>
        <RichTextEditor
          id="show-text"
          name="RichTextEditor"
          value={this.state.value}
          onChange={this.onChange}
        />
        <button className="saveButton" onClick={this.SaveTxtFile}>
          Save File
        </button>
        <input type="file" onChange={this.ReloadTextFile} />
      </div>
    );
  }
}

export default TextRichEditor;
