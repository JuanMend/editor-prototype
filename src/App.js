import React, { Component } from 'react';
import TextEditor from './components/TextEditor';
import './App.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TextEditor />
      </div>
    );
  }
}

export default App;
