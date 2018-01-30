import React from 'react';

class Message extends React.Component {
  render() {
    // Was the message sent by the current user. If so, add a css class
    const fromMe = this.props.fromMe ? 'from-me' : '';
    if(this.props.welcome === true){
      return(
        <div className='welcomeMessage'>
          {this.props.username.toString() + this.props.message.toString()}
        </div>
        );
    }else{
      return (
        <div className={`message ${fromMe}`}>
          <div className='username'>
            { this.props.username }
          </div>
          <div className='message-body'>
            { this.props.message }
          </div>
          <div className='date'>
            { this.props.date }
          </div>
        </div>
      );
    }
    
  }
}

Message.defaultProps = {
  message: '',
  username: '',
  date:'',
  fromMe: false,
  welcome: false
};

export default Message;