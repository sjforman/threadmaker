import React from 'react';

var maxLength = 140;

export class TweetArea extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      key: '',
      number: ''
    };

    this.state = {
        value: '',
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
      <div>
        <h1>{this.props.number + 1}</h1>
        <textarea value={this.state.value} onChange={this.handleChange} />
        <p>{this.state.characters} / {maxLength} ({this.state.remaining} remaining)</p>
        <br />
        <br />
      </div>
      );
  }
}
