import React from 'react';

var Panel = require('react-bootstrap/lib/Panel');
var Image = require('react-bootstrap/lib/Image')
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
      if(fromMe){
        return (
          <div className={`message ${fromMe}`}>
              <Panel classNmae='panel' bsStyle="success" > 
                <Panel.Heading>
                  <Panel.Title componentClass="h3">
                    <Image src='https://www.gravatar.com/avatar/26429ee9ac6967572eb3efb8c008eef4' />
                    { this.props.username }
                  </Panel.Title>
                  <Panel.Body className="MessageBody">{ this.props.message }</Panel.Body>
                  <div className='date'>
                    { this.props.date }
                  </div>
                </Panel.Heading>
              </Panel>       
          </div>
      );
      }else{
        return (
        <div className={`message ${fromMe}`}>
            <Panel classNmae='panel' bsStyle="info"> 
              <Panel.Heading>
                <Panel.Title componentClass="h3">
                  <Image src = 'https://www.gravatar.com/avatar/bb89313864e8c4258156d80c442c8f2d'  />
                  { this.props.username }
                </Panel.Title>
                <Panel.Body className="MessageBody">{ this.props.message }</Panel.Body>
                <div className='date'>
                  { this.props.date }
                </div>
              </Panel.Heading>
            </Panel>
        </div>
      );
      }
      
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