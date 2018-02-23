import React from 'react';
import { Redirect } from 'react-router';
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';

export class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = { isAuthenticated: false, screenName: null};
  }

  loadUserFromToken() {
    let token = localStorage.getItem('jwtToken');
    if(!token || token === '') {
      return;
    }
    else {
      let screenName = localStorage.getItem('screenName');
      this.setState({isAuthenticated: true, screenName: screenName });
      console.log(this.props.location);
      console.log(this.props.history);
    }
  }

  onSuccess(response) {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        this.setState({isAuthenticated: true, screenName: user.twitterProvider.screen_name });
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('twitterId', user.twitterProvider.id);
        localStorage.setItem('screenName', user.twitterProvider.screen_name);
        localStorage.setItem('userId', user._id); 
        localStorage.setItem('oauthToken', user.twitterProvider.token);
        localStorage.setItem('oauthSecret', user.twitterProvider.tokenSecret);
        localStorage.setItem('oauthVerifier', user.twitterProvider.oauth_verifier);
      }
    })
  }

  onFailure(error) {
    console.log(error)
  }

  logout() {
    this.setState({ isAuthenticated: false, screenName: null });
    localStorage.clear();
    this.props.history.push('/');
  }

  componentWillMount() {
    this.loadUserFromToken()
  }

  render() {
    let content = !!this.state.isAuthenticated ?
      (
      <div>
        <div className="dib pr2">
          <p>{this.state.screenName}</p>
        </div>
        <div className="dib">
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
      <div>
        {content}
      </div>
    )
  }
}
