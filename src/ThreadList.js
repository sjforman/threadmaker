import React from 'react';
import axios from 'axios';
import { ThreadSummary } from './ThreadSummary';

class ThreadListContainer extends React.Component {
  render() {
    return (
    <div>
      <div id="buttons" className="tc mb4">
        <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 mr1 dib mid-gray" href="#" onClick={this.props.addThread}>
        New Thread
        </button>
      </div>
      <div>
        {this.props.children}
      </div>
    </div>
    );
  }
}

export class ThreadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      threads: []
    };
    this.loadThreadsFromServer = this.loadThreadsFromServer.bind(this);
    this.onAddThread = this.onAddThread.bind(this);
    this.onDeleteThread = this.onDeleteThread.bind(this);
  }

  loadThreadsFromServer() {
    axios({ method: 'GET', url: this.props.url, headers:
      { 'x-auth-token' : this.props.jwtToken }
    })
      .then(res => {
        this.setState({ threads: res.data })
      })
  }

  onAddThread() {
    var array = this.state.threads
    axios({ method: 'POST', url: this.props.url, headers:
      { 'x-auth-token' : this.props.jwtToken }
    })
    .then(res => {
      var thread = {
        _id: res.data.id,
        userId: '5a7cfdf18a53a37dd381fd3f',
        tweets: []
      }
    array.push(thread)
    this.setState({threads: array})
    console.log('Thread added: ' + JSON.stringify(thread));
    })
    .catch(err => {
      console.error(err);
    })
  }

  onDeleteThread(index, e) {
    var array = this.state.threads
    var threadid = this.state.threads[index]._id;
    array.splice(index, 1);
    this.setState({threads: array})
    axios({ method: 'DELETE', url: `${this.props.url}/${threadid}`, headers:
      { 'x-auth-token' : this.props.jwtToken }
    })
      .then(res => {
        console.log('Thread deleted: ' + JSON.stringify(threadid));
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentDidMount() {
    this.loadThreadsFromServer();
  }

  render() {

    var threads = this.state.threads.map((thread, index) => {
      return (
        <ThreadSummary
          key={thread._id}
          id={thread._id}
          index={index}
          tweets={thread.tweets}
          numTweets={thread.tweets.length || 0}
          deleteThread={this.onDeleteThread.bind(this, index)}/>
      )
    })

    return (
      <div>
      <ThreadListContainer
        addThread={this.onAddThread}
        deleteThread={this.onDeleteThread.bind(this)}>
        {threads}
      </ThreadListContainer>
      </div>
      );
  }
}
