import React from 'react';

export class Tweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false 
    }
    this.enterEditMode = this.enterEditMode.bind(this);
    this.escFunction = this.escFunction.bind(this);
    this.formatText = this.formatText.bind(this);
  }
  
  escFunction(event){
    if(event.keyCode === 27) {
      this.setState({
        editMode : false
      });
      this.props.handleTweetSubmit()
    }
  }
  
  formatText() {
    var extraText = '';
    if (this.props.text.length > this.props.characterLimit) {
      extraText = this.props.text.substring(this.props.characterLimit)
    }
    console.log(extraText);
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
    this.formatText()

    return (

      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">

      {/* TODO: How do I preserve line breaks in the original input when they're rendered in final mode? */}
      {/* TODO: Tweet content in both modes should probably be encapsulated in component(s)? */}
      <div className="fl w-100 w-80-ns pa2">
        {this.state.editMode ? 

              <div>
                <textarea 
                  className="w-100 f3 db border-box hover-black ba b--black-20 pa2 br2 mb2 h5"
                  value={this.props.text} 
                  onChange={this.props.handleChange} 
                  onKeyDown={this.escFunction}
                />
              </div>

          :

            <div className="w-100 f3 db border-box hover-black bl b--black-20 pa2 mb2 h5" 
              onClick={this.enterEditMode}>
              {this.props.text}
            </div>
        }
      </div>

        <div className="fl w-100 w-10-ns pa2">
          <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" onClick={this.props.deleteTweet.bind(this)}>-</button>
          <p>{this.props.text.length} / {this.props.characterLimit}</p>
        </div>
      </div>
      </div>
      );
  }
}
