import React from 'react';

export class ThreadSummary extends React.Component {
  render() {

    const threadlink = '/thread/' + this.props.id;

    return (
      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">
          <div className="fl w-100 w-10-ns pa2">
            <h3>{this.props.index + 1}</h3>
            <a href={threadlink}>{this.props.id}</a>
          </div>
        </div>
      </div>
      );
  }
}
