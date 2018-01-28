import React, { Component } from 'react';
import logo from './logo.svg';
import './css/App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      organization: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ organization: event.target.value });
  }

  handleSubmit(event) {
    alert(`A new organization was submitted: ${this.state.organization}`);
    event.preventDefault();

    // TODO: Render issue components
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to ethpull!</h1>
        </header>
        <form onSubmit={this.handleSubmit}>
          Organization:
          <label>
            <input type="text" value={this.state.organization} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <p className="App-intro">
          {this.state.organization}
        </p>
      </div>
    );
  }
}

export default App;
