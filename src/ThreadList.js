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

  /* TODO: DRY out userId and JwT token config with global Axios defaults */

  loadThreadsFromServer() {
    axios({ method: 'GET', url: this.props.url, headers:
      { 'x-auth-token' : this.props.jwtToken,
        'userId' : localStorage.getItem('userId')
      }
    })
      .then(res => {
        this.setState({ threads: res.data })
        console.log(this.state);
      })
  }

  onAddThread() {
    var array = this.state.threads;
    let threadId;
    let numThreads = this.state.threads.length;
    var userId = localStorage.getItem('userId');
    axios({ method: 'POST', url: this.props.url, headers:
      { 'x-auth-token' : this.props.jwtToken,
        'userId' : userId
      }
    })
    .then(res => {
      threadId = res.data.id;
      var thread = {
        _id: threadId,
        userId: userId,
        tweets: [],
        pubstatus: false
      }
      array.push(thread);
      this.setState({threads: array});
      axios({ method: 'POST',
            url: `${this.props.url}/${threadId}`,
            headers: { 'x-auth-token': this.props.jwtToken }
          })
      .then(res => {
        var tweet = {
          _id: res.data.tweet_id,
          key: res.data.tweet_id,
          text: '',
          prefix: '',
          postfix: '',
          pubstatus: false,
          publishedTweetId: ''
        }
        array[numThreads].tweets.push(tweet);
        this.setState({threads: array});
        console.log(this.state);
      })
      .catch(err => {
        console.error(err);
      })
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
          pubstatus={thread.pubstatus}
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
