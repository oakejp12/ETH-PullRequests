import React, { Component } from 'react';
import './css/Issues.css';

class Issues extends Component {

  render() {
    return (
      <div id="issueTemplate">
        <div className="col-sm-6 col-md-4 col-lg-3">
          <div className="panel panel-default panel-pet">
            <div className="panel-heading">
              <h3>{this.props.title}</h3>
            </div>
            <div className="panel-body">
              <p>
                <strong>Description</strong>: <span>{this.props.description}</span>
              </p>
              <p>
                <strong>Author</strong>: <span>{this.props.author}</span>
              </p>
              <button className="btn btn-default btn-vote" type="button" data-id={this.props.data}>Vote on Issue</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Issues;