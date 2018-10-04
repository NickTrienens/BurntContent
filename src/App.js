import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextEditor from './Components/TextEditor'
import MDE from './Components/MDEditor'

import { monitorContent, unmonitorContent } from './Services/firebase.js';

class App extends Component {


  componentWillUnmount() {
    unmonitorContent();


  }

  componentDidMount() {
    monitorContent( (data) => {
      console.log(data);

    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
            <div>
              <TextEditor />
              <MDE />
            </div>

        </header>
      </div>
    );
  }
}

export default App;
