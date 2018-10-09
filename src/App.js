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
      data: null,
      date: new Date()
    }
  }

  componentWillUnmount() {
    unmonitorContent();
  }

  componentDidMount() {
    const comp = this
    monitorContent( (data) => {
      console.log(data);
      comp.setState({data: data});
    });
    this.timerID = setInterval(
     () => this.tick(),
     1000
   );
  }

  tick() {
     this.setState({
       date: new Date()
     });
   }

  render() {

    const { data } = this.state;
    var stories = "";
    var count  = 0;
    console.log(data);
    if(data !== null ){

      stories = data.map((data) => {
            count++;
            console.log(data);
            return <li><TextEditor contentKey={data.key} data={data} /></li>
      });
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
            <div>

              <ol>
                {stories}
                <li><TextEditor key={Date()} placeHolder="enter new item"/></li>
              </ol>
              <br/><br/>
              <h2>It is {this.state.date.toLocaleTimeString()}.</h2>

            </div>
        </header>
      </div>
    );
  }
}

export default App;
