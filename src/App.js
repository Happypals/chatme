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
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
} 

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
      this.client.publish('/root/chatme/xl006/*',  welcomeMessageJson)

      // sub after pub so we don't get our own announcement
      this.client.subscribe('/root/chatme/xl006/#');
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
    var dte = new Date();
    var messageObject = {
      username: this.props.username,
      message: msg,
      date: formatAMPM(dte),
      fromMe: false
    };
    console.log("MQTT sending: " + msg.toString());
    var messageJson = JSON.stringify(messageObject);
    this.client.publish('/root/chatme/xl006/*', messageJson);
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



