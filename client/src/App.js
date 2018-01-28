import React, { Component } from 'react';
import Issues from './Issues.js';
import logo from './logo.svg';
import './css/App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      organization: '',
      repo: '',
      issues: []
    };
  }

  callIssuesApi = async (organization, repo) => {
    const response = await fetch('/api/issues', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organization: organization,
        repo: repo
      }),
    });
    const body = await response.json();

    if (response.status !== 200) throw new Error(body.message);

    const issues = body.data; // Extract issues array from JSON

    console.log(issues);

    this.setState({issues: issues});
  }

  handleOrgChange = (event) => {
    this.setState({ organization: event.target.value});
  }

  handleRepoChange = (event) => {
    this.setState({ repo: event.target.value });
  }

  handleSubmit = (event) => {
    console.log(`A new organization was submitted: ${this.state.organization}`);
    event.preventDefault();

    this.callIssuesApi(this.state.organization, this.state.repo); // When an organization is submitted, render their issues.
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to ethpull!</h1>
        </header>
        <form id="organizationForm" onSubmit={this.handleSubmit}>
          Organization:
          <label>
            <input type="text" value={this.state.organization} onChange={this.handleOrgChange} />
            <input type="text" value={this.state.repo} onChange={this.handleRepoChange} />
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <p className="App-intro">
          {this.state.organization}
        </p>
        <div id="issuesRow">
          {
            this.state.issues.map((issue, i) => {
              return <Issues title={issue.title} description={issue.body} author={issue.author} key={i} data={i} />
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
