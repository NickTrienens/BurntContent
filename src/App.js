import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextEditor from './Components/TextEditor'
import MDE from './Components/MDEditor'

import { monitorContent, unmonitorContent } from './Services/firebase.js';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: null
    }
  }

  componentWillUnmount() {
    unmonitorContent();
  }

  componentDidMount() {
    monitorContent( (data) => {
      console.log(data);
      this.setState( data );
    });
  }

  render() {

    const {  data } = this.state;
    var stories = "";
    var count  = 0;
    if(data !== null ){
      console.log(data);
      stories = data.map((data) => {
            count++;
            console.log(data);
            return <TextEditor contentKey={data.key} data={data} />
      });
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
            <div>
              <TextEditor key={Date()} />
              <ol>
                {stories}
              </ol>
            </div>
        </header>
      </div>
    );
  }
}

export default App;
