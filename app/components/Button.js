import React from 'react';

var buttonStyle = {
  margin: '10px 10px 10px 0'
};

export class Button extends React.Component {
  render() {
    return (
        <button 
          className="btn btn-default"
          style={buttonStyle}
          onClick={this.props.handleClick}>{this.props.label}</button>
        );
  }
}
