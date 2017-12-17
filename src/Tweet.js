import React from 'react';

var maxLength = 280;

export class Tweet extends React.Component {
  constructor(props) {
    super(props);
  
  console.log(this.props.handleChange);

}

  render() {

    return (
      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">
          <div className="fl w-100 w-20-ns pa2">
            <h3>{this.props.index}</h3>
          </div>
          <div className="fl w-100 w-40-ns pa2">
            <textarea className="db border-box hover-black ba b--black-20 pa2 br2 mb2 h4" value={this.props.text} onChange={this.props.handleChange}/>
            <p>{this.props.text.length} / {maxLength} ({maxLength - this.props.text.length} remaining)</p>
          </div>
          <div className="fl w-100 w-40-ns pa2 measure-narrow">
            {this.props.text}
          </div>
        <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" onClick={this.props.deleteTweet.bind(this)}>
        -
        </button>
        </div>
      </div>
      );
  }
}
