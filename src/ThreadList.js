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
    axios.get(this.props.url)
      .then(res => {
        this.setState({ threads: res.data })
      })
  }

  onAddThread() {
    var array = this.state.threads
    axios.post(this.props.url, {
    })
    .then(res => {
      var thread = {
        _id: res.data.id,
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
    axios.delete(`${this.props.url}/${threadid}`)
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
          text={thread.text}
          numTweets={thread.tweets.length || 0}
          firstTweet={thread.tweets[0].text.substring(0, 40)}
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
