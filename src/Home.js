import React from 'react';

import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';

export class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = { isAuthenticated: false, user: null, token: ''};

  }

  loadUserFromToken() {
    let token = localStorage.getItem('jwtToken');
    console.log(token);
    if(!token || token === '') {
      return;
    }
    else {
      this.setState({isAuthenticated: true, user: 'x', token: token});
    }
  }

  onSuccess(response) {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        this.setState({isAuthenticated: true, user: user, token: token});
        localStorage.setItem('jwtToken', token);
      }
      console.log(this.state);
    })
  }

  onFailure(error) {
    console.log(error)
  }

  logout() {
    this.setState({ isAuthenticated: false, user: null, token: ''});
    localStorage.removeItem('jwtToken');
  }

  componentWillMount() {
    this.loadUserFromToken()
  }

  render() {


    let content = !!this.state.isAuthenticated ?
      (
      <div>
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
