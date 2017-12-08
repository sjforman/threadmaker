import React from 'react';

var maxLength = 280;

export class TweetArea extends React.Component {
  constructor(props) {
    super(props);
    props = {
      number: '',
      key: ''
    };

    this.state = {
        characters: 0, 
        remaining: maxLength
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let input = event.target.value;
    this.setState({
      value: input,
      characters: input.length,
      remaining: maxLength - input.length
    });
  }

  render() {
    return (
      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">
          <div className="fl w-100 w-20-ns pa2">
            <h3 className="">{this.props.number}</h3>
          </div>
          <div className="fl w-100 w-40-ns pa2">
            <textarea className="db border-box hover-black ba b--black-20 pa2 br2 mb2 h4" onChange={this.handleChange} />
            <p>{this.state.characters} / {maxLength} ({this.state.remaining} remaining)</p>
          </div>
          <div className="fl w-100 w-40-ns pa2 measure-narrow">
            {this.state.value}
          </div>
        </div>
      </div>
      );
  }
}
