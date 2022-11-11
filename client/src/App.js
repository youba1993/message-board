

import React from 'react';
import actionCable from 'actioncable';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: []
    }
    this.cable = actionCable.createConsumer('/cable')
  }
 
  componentDidMount() {
    this.fetchMessages()
    this.createSubscription()
  };

  fetchMessages = () => {
    fetch('/messages')
      .then(res => res.json())
      .then(messages => this.setState({ messages: messages }));
  }

  createSubscription = () => {
    this.cable.subscriptions.create(
      { channel: 'MessagesChannel' },
      { received: message => this.handleReceivedMessage(message) }
    )
  }

  mapMessages = () => {
    return this.state.messages.map((message, i) => 
      <li key={i}>{message.content}</li>)
  }

  handleReceivedMessage = message => {
    this.setState({ messages: [...this.state.messages, message] })
  }

  handleMessageSubmit = e => {
    e.preventDefault();
    const messageObj = {
      message: {
        content: e.target.message.value
      }
    }
    const fetchObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageObj)
    }
    fetch('/messages', fetchObj)
    e.target.reset()
  }

  render() {
    return (
      <div className='App'>
        <actionCable 
          channel={{ channel: 'MessagesChannel' }}
          onReceived={this.handleReceivedMessages}
        />
        <h2>Messages</h2>
        <ul>{this.mapMessages()}</ul>
        <form onSubmit={(e)=>this.handleMessageSubmit(e)}>
          <input name='message' type='text' />
          <input type='submit' value='Send message' />
        </form>
      </div>
    );
  }
}
export default App;