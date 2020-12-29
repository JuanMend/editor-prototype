import React, { Component } from 'react';
import TextEditor from './components/TextEditor';
import NewEditor from './components/NewEditor';
import './App.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <TextEditor /> */}
        <NewEditor />
      </div>
    );
  }
}

export default App;
