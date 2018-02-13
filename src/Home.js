import React from 'react';

import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';

export class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = { isAuthenticated: false, userId: null, token: '', screenName: null};

  }

  loadUserFromToken() {
    let token = localStorage.getItem('jwtToken');
    if(!token || token === '') {
      return;
    }
    else {
      let screenName = localStorage.getItem('screenName');
      let userId = localStorage.getItem('userId');
      this.setState({isAuthenticated: true, userId: userId , token: token, screenName: screenName });
    }
  }

  onSuccess(response) {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        this.setState({isAuthenticated: true, userId: user._id, token: token, screenName: user.twitterProvider.screen_name });
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('twitterId', user.twitterProvider.id);
        localStorage.setItem('screenName', user.twitterProvider.screen_name);
        localStorage.setItem('userId', user._id); 
        localStorage.setItem('oauthToken', user.twitterProvider.token);
        localStorage.setItem('oauthSecret', user.twitterProvider.tokenSecret);
      }
    })
  }

  onFailure(error) {
    console.log(error)
  }

  logout() {
    this.setState({ isAuthenticated: false, userId: null, token: '', screenName: null });
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('twitterId');
    localStorage.removeItem('screenName');
    localStorage.removeItem('userId');
    localStorage.removeItem('oauthToken');
    localStorage.removeItem('oauthSecret');
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
