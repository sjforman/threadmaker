import React from 'react';
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';

export class Logout extends React.Component {
  constructor(props) {
    super(props)

    this.state = { isAuthenticated: false, screenName: null};
  }

  loadUserFromToken() {
    let screenName = this.props.screenName;
    this.setState({isAuthenticated: true, screenName: screenName });
  }

  logout() {
    this.setState({ isAuthenticated: false, screenName: null });
    localStorage.clear();
    this.props.history.push('/');
  }

  componentWillMount() {
    this.loadUserFromToken();
  }

  render() {
    return(
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
    )
  }
}

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
      this.props.history.push('/dashboard');
    }
  }

  onSuccess(response) {
    if (!response.ok) {
      console.error(response);
      return;
    }
    const token = response.headers.get('x-auth-token');
    response.json()
      .then(user => {
        if (token) {
          this.setState({isAuthenticated: true, screenName: user.twitterProvider.screen_name, jwtToken: token, userId: user._id });
          localStorage.setItem('jwtToken', token);
          localStorage.setItem('twitterId', user.twitterProvider.id);
          localStorage.setItem('screenName', user.twitterProvider.screen_name);
          localStorage.setItem('userId', user._id);
          localStorage.setItem('oauthToken', user.twitterProvider.token);
          localStorage.setItem('oauthSecret', user.twitterProvider.tokenSecret);
          localStorage.setItem('oauthVerifier', user.twitterProvider.oauth_verifier);
        }
      });
  }

  onFailure(error) {
    console.log(error)
  }

  componentWillMount() {
    this.loadUserFromToken();
  }

  componentDidUpdate() {
    let jwtToken = this.state.jwtToken;
    let userId = this.state.userId;
    let screenName = this.state.screenName;
    if (this.state.isAuthenticated) {
      this.props.history.push({
        pathname: '/dashboard',
        jwtToken: jwtToken,
        userId: userId,
        screenName: screenName
      });
    }
  }

  render() {
    return(
      <TwitterLogin loginUrl={process.env.REACT_APP_API_URL + '/auth/twitter'}
                    onFailure={this.onFailure.bind(this)} onSuccess={this.onSuccess.bind(this)}
                    requestTokenUrl={process.env.REACT_APP_API_URL + '/auth/twitter/reverse'}/>
    )
  }
}
