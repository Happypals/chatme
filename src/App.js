import React, { Component } from 'react';
import './App.css';
import ChatInput from './ChatInput';
import Messages from './Messages';

// class Messages extends Component{
//   render(){
//     var messageList = this.props.m.map((message, index) => {
//                     return <li key={index}>
                    
//                       <img src="https://www.eg.bucknell.edu/~amm042/ic_account_circle_black_24dp_2x.png" className="icon" alt="logo" align="left" width="20px"/>
//                       <div align="left">{message}</div>
                    
//                     </li>;
//                   });
//     return  <ul>{ messageList }</ul>
//   }
// }

class App extends Component {
  constructor(props){
    super(props);
    this.state = { messages: [] };
    this.sendHandler = this.sendHandler.bind(this);
    this.mqtt = require('mqtt');
    this.client  = this.mqtt.connect('ws://mqtt.bucknell.edu:9001');
    //this.file = new File();
  }

  componentWillMount(){
    console.log(this.props.username);
    this.client.on('connect', ()=>{

      // Welcoming message
      var welcomeMessage = {
        username: this.props.username,
        message: 'joined',
        welcome: true,
        fromMe: false
      }

      // convert it to Json object
      var welcomeMessageJson = JSON.stringify(welcomeMessage);
      this.client.publish('announce',  welcomeMessageJson)

      // sub after pub so we don't get our own announcement
      this.client.subscribe('announce');
    });

    this.client.on('message', (topic,messageJson)=>{
      var msg = JSON.parse(messageJson);
      console.log('Incoming message: ' + msg.message.toString() );
      
      if(msg.username === this.props.username){
        msg.fromMe = true;
      }

      this.addMessage(msg);
      });
  }

  componentWillUnmount(){
    this.client.end();
  }

  addMessage(message) {
    // Append the message to the component state
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  }

  sendHandler(msg){
    var messageObject = {
      username: this.props.username,
      message: msg,
      date: new Date(),
      fromMe: false
    };
    console.log("MQTT sending: " + msg.toString());
    var messageJson = JSON.stringify(messageObject);
    this.client.publish('announce', messageJson);
  }

  render() {
    return (
      <div className="App">
        <Messages messages={this.state.messages}/>
        <ChatInput onSend={this.sendHandler}/>
      </div>
    );
  }
}

App.defaultProps = {
  username: 'Anonymous'
};

export default App;



