import React from 'react';
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';

export class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = { isAuthenticated: false, user: null, token: ''};
  }

  onSuccess(res) {
    const token = res.headers.get('x-auth-token');
    res.json().then(user => {
      if (token) {
        this.setState({isAuthenticated: true, user: user, token: token});
      }
    })
  }

  onFailure(err) {
    console.log(err)
  }

  logout() {
    this.setState({ isAuthenticated: false, user: null, token: ''});
  }

  render() {
    let content = !!this.state.isAuthenticated ?
      (
      <div>
        <div>
          {this.state.user}
        </div>
        <div>
          <button onClick={this.logout} className="button" >
            Log out
          </button>
        </div>
      </div>
    ) :
    /* TODO: get API url base and port from props rather than hard-coding */
    (
      <TwitterLogin loginUrl='http://localhost:3001/auth/twitter'
                    onFailure={this.onFailure} onSuccess={this.onSuccess}
                    requestTokenUrl='http://localhost:3001/auth/twitter/reverse'/>
    );

    return(
      <div className='tc pa4'>
      {content}
      </div>
    )
  }
}
