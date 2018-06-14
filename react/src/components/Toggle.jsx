var React = require('react')

class Toggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isToggleOn: true }
    // this.handleClick = this.handleClick.bind(this);
  }
  handleClick(...P) {
    console.log(P);
    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick.bind(this,1)}>
          {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
      </div>
    )
  }
}

module.exports = Toggle