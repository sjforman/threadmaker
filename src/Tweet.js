import React from 'react';

class CharacterCounter extends React.Component {
  render() {

    let over = false;
    if (this.props.text.length > this.props.characterLimit) {
      over = true;
    }

    return(
      <p className={over ? "red" : ""}>{this.props.text.length} / {this.props.characterLimit}</p>
    )
  }
}

export class Tweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false 
    }
    this.enterEditMode = this.enterEditMode.bind(this);
    this.escFunction = this.escFunction.bind(this);
  }
  
  escFunction(event){
    if(event.keyCode === 27) {
      this.setState({
        editMode : false
      });
      this.props.handleTweetSubmit()
    }
  }
  
  enterEditMode() {
    this.setState({
      editMode : true
    });
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }


  render() {

    return (

      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">

      <div className="fl w-100 w-10-ns pa2">
        <button className="f6 link dim br1 ba bw1 ph2 pv2 mb2 dib mid-gray" onClick={this.props.moveTweetUp.bind(this)}>move up</button>
        <button className="f6 link dim br1 ba bw1 ph2 pv2 mb2 dib mid-gray" onClick={this.props.moveTweetDown.bind(this)}>move down</button>
      </div>
      {/* TODO: How do I preserve line breaks in the original input when they're rendered in final mode? */}
      {/* TODO: Tweet content in both modes should probably be encapsulated in component(s)? */}
      <div className="fl w-100 w-80-ns pa2">
        {this.state.editMode ? 

              <div>
                <textarea 
                  className="w-100 f3 db border-box hover-black ba b--black-20 pa2 br2 mb2 h4"
                  value={this.props.text} 
                  onChange={this.props.handleChange} 
                  onKeyDown={this.escFunction}
                />
              </div>

          :

            <div className="w-100 f3 db border-box hover-black bl b--black-20 pa2 mb2 h4" 
              onClick={this.enterEditMode}>
              {this.props.text}
            </div>
        }
      </div>

        <div className="fl w-100 w-10-ns pa2">
          {/* TODO: add confirmation step for deleting Tweet */}
          <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" onClick={this.props.deleteTweet.bind(this)}>
            Delete tweet
          </button>
          <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" onClick={this.props.publishTweet.bind(this)}>
            Publish tweet
          </button>
          <CharacterCounter text={this.props.text} characterLimit={this.props.characterLimit} />
        </div>
      </div>
      </div>
      );
  }
}
