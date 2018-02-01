import React from 'react';

var maxLength = 280;

export class Tweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false 
    }
    this.enterEditMode = this.enterEditMode.bind(this);
    this.escFunction = this.escFunction.bind(this);
    this.spaceFunction = this.spaceFunction.bind(this);
  }
  
  escFunction(event){
    if(event.keyCode === 27) {
      this.setState({
        editMode : false
      });
      this.props.handleTweetSubmit()
    }
  }

  spaceFunction(event){
    if(event.keyCode === 32) {
      this.setState({
        editMode : true
      });
    }
  }

  enterEditMode() {
    this.setState({
      editMode : true
    });
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
    document.addEventListener("keydown", this.spaceFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
    document.removeEventListener("keydown", this.spaceFunction, false);
  }

  render() {

    return (
      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">
          <div className="fl w-100 w-10-ns pa2">
            <h3>{this.props.index + 1}</h3>
          </div>

      <div className="fl w-100 w-80-ns pa2">
        {this.state.editMode ? 

              <div>
                <textarea 
                  className="w-100 f3 db border-box hover-black ba b--black-20 pa2 br2 mb2 h4" 
                  value={this.props.text} 
                  onChange={this.props.handleChange} 
                  onKeyDown={this.escFunction}
                />
                <p>{this.props.text.length} / {maxLength} ({maxLength - this.props.text.length} remaining)</p>
              </div>

          :

            <div className="w-100 f3 db border-box hover-black b--black-20 pa2 br2 mb2 h4" onClick={this.enterEditMode} onKeyDown={this.spaceFunction} tabIndex="0">
              {this.props.text}
            </div>
        }
      </div>

        <div className="fl w-100 w-10-ns pa2">
          <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" onClick={this.props.deleteTweet.bind(this)}>Delete</button>
        </div>
      </div>
      </div>
      );
  }
}
