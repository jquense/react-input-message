var React = require('react')
var shallowEqual = require('./shallowEqual')

var stringOrArrayofStrings = React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ])

module.exports = Component =>
  class MessageListener extends React.Component {

    static DecoratedComponent = Component

    static propTypes = {
      for:   stringOrArrayofStrings,
      group: stringOrArrayofStrings
    }

    static contextTypes = {
      messageContainer: React.PropTypes.object
    }

    shouldComponentUpdate(nextProps, nextState){
      if (!this.state && nextState) return true;
      if (this.state && !nextState) return true;
      if (this.state.active !== nextState.active) return true;

      return !shallowEqual(this.state.messages, nextState.messages)
        || !shallowEqual(this.props, nextProps)
    }

    componentWillMount() {
      let container = this.context.messageContainer;

      this.unsubscribe = container.subscribe(getMessages => {
        this.setState(this._getValidationState(getMessages))
      })
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    render(){
      return <Component {...this.props} {...this.state}/>
    }

    _getValidationState(getMessages){
      var messages = getMessages(this.props.for, this.props.group);

      return {
        messages,
        active: !!(messages && Object.keys(messages).length)
      }
    }
  }
