import React from 'react';

import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';

export class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = { isAuthenticated: false, user: null, token: '', screenName: null};

  }

  loadUserFromToken() {
    let token = localStorage.getItem('jwtToken');
    if(!token || token === '') {
      return;
    }
    else {
      let userId = localStorage.getItem('userId');
      let screenName = localStorage.getItem('screenName');
      this.setState({isAuthenticated: true, user: userId , token: token, screenName: screenName });
    }
  }

  onSuccess(response) {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        this.setState({isAuthenticated: true, user: user.twitterProvider.id, token: token, screenName: user.twitterProvider.screen_name });
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userId', user.twitterProvider.id);
        localStorage.setItem('screenName', user.twitterProvider.screen_name);
      }
    })
  }

  onFailure(error) {
    console.log(error)
  }

  logout() {
    this.setState({ isAuthenticated: false, user: null, token: '', screenName: null });
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('screenName');
  }

  componentWillMount() {
    this.loadUserFromToken()
  }

  render() {


    let content = !!this.state.isAuthenticated ?
      (
      <div>
        <div className="mb5">
          <p>Logged in as: {this.state.screenName}</p>
          <a href='/threads' className="link">My threads</a>
        </div>
        <div>
          <button onClick={this.logout.bind(this)} className="button" >
            Log out
          </button>
        </div>
      </div>
    ) :
    /* TODO: get API url base and port from props rather than hard-coding */
    (
      <TwitterLogin loginUrl='http://localhost:3001/api/auth/twitter'
                    onFailure={this.onFailure.bind(this)} onSuccess={this.onSuccess.bind(this)}
                    requestTokenUrl='http://localhost:3001/api/auth/twitter/reverse'/>
    );

    return(
      <div className='tc pa4'>
      {content}
      </div>
    )
  }
}
