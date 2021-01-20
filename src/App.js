import React, { Component } from 'react';
import NewEditor from './components/NewEditor';
import './App.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NewEditor />
      </div>
    );
  }
}

export default App;
