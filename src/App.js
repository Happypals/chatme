import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ChatInput from './ChatInput';
// import Messages from './Messages';

class Messages extends Component{
  render(){
    var messageList = this.props.m.map((message, index) => {
                    return <li key={index}>
                    
                      <img src="https://www.eg.bucknell.edu/~amm042/ic_account_circle_black_24dp_2x.png" className="icon" alt="logo" align="left" width="20px"/>
                      <div align="left">{message}</div>
                    
                    </li>;
                  });
    return  <ul>{ messageList }</ul>
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = { messages: [] };
    this.sendHandler = this.sendHandler.bind(this);
    this.mqtt = require('mqtt');
    this.client  = this.mqtt.connect('ws://mqtt.bucknell.edu:9001');
  }

  componentWillMount(){
    console.log(this.props.username);
    this.client.on('connect', ()=>{
      this.client.publish('announce',  this.props.username.toString()+' joined!')
      // sub after pub so we don't get our own announcement
      this.client.subscribe('announce');
    });

    this.client.on('message', (topic,message)=>{
      console.log('Incoming message: ' + message.toString());
      
      // if(message.username=this.props.username){
      //   message.fromMe = true;
      // }
      const m = message.toString()+' '+ new Date();
      this.addMessage(m);
      // this.setState((prevState, props)=> {
        
      //   return {messages:prevState.messages.concat(
      //     message.toString()+ new Date() )}
      //   })
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
    // const messageObject = {
    //   username: this.props.username,
    //   msg
    // };
    console.log("MQTT sending: " + msg.toString());
    this.client.publish('announce', this.props.username.toString()+': '+msg);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Chat App</h1>
        </header>
        
        <Messages m={this.state.messages}/>
        <ChatInput onSend={this.sendHandler}/>
      </div>
    );
  }
}

App.defaultProps = {
  username: 'Anonymous'
};

export default App;



