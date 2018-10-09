import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextEditor from './Components/TextEditor'
import MDE from './Components/MDEditor'
import { monitorContent, unmonitorContent } from './Services/firebase.js';
const uuidv1 = require('uuid/v1');

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
   //  this.timerID = setInterval(
   //   () => this.tick(),
   //   1000
   // );
  }

  render() {

    const { data } = this.state;
    var stories = "";
    var count  = 0;

    if(data !== null ){
      console.log(data);
      data.push({key: uuidv1(), createRow: true})
      stories = data.map((data) => {
            count++;
            console.log(data);
            if ( data.createRow === true) {
              return <li><TextEditor contentKey={data.key} createRow={true} placeHolder="enter new item"/></li>
            }
            return <li><TextEditor contentKey={data.key} data={data} createRow={false} /></li>
      });
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
            <div>
              <ol>
                {stories}
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
