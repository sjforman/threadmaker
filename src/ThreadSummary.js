import React from 'react';

export class ThreadSummary extends React.Component {
  render() {

    return (
      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">
          <div className="fl w-100 w-10-ns pa2">
            <h3>{this.props.index + 1}</h3>
          </div>
        </div>
      </div>
      );
  }
}
