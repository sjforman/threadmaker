import React from 'react';
import Twitter from 'twitter';

import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';

export class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = { isAuthenticated: false, user: null, token: ''};

  }

  onSuccess = (response) => {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        this.setState({isAuthenticated: true, user: user, token: token});
      }
      console.log(this.state);
    })
  }

  onFailure = (error) => {
    console.log(error)
  }

  logout = () => {
    this.setState({ isAuthenticated: false, user: null, token: ''});
  }

  render() {

    var client = new Twitter({
      consumer_key: 'Ck9TmlEDgCAhAXnvEPswdiSMg',
      consumer_secret: 'JMbocRhgIqFMkdGwk5BmrdTdjT1Ec8rduwPlbmj38c4SisqBg8',
      access_token_key: '9741722-TCF4bquJ2Wtn1hWrHghdVdj7WMW15nz3S2HzSb3oWx',
      access_token_secret: 'aCvujPnmoDHrH2xBSRqac08uRTKJDCZSl0bQES6RiGNEO'
    })

    console.log(client);

    client.get('favorites/list', function(error, tweets, response) {
      if(error) throw error;
      console.log(tweets);
      console.log(response);
    })

    let content = !!this.state.isAuthenticated ?
      (
      <div>
        <div>
          {this.state.user.id}
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
      <TwitterLogin loginUrl='http://localhost:3001/api/auth/twitter'
                    onFailure={this.onFailure} onSuccess={this.onSuccess}
                    requestTokenUrl='http://localhost:3001/api/auth/twitter/reverse'/>
    );

    return(
      <div className='tc pa4'>
      {content}
      </div>
    )
  }
}
