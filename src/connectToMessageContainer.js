var React = require('react')
var shallowEqual = require('react-pure-render/shallowEqual')

var stringOrArrayofStrings = React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ])

var useRealContext = /^0\.14/.test(React.version);

module.exports = Component =>
  class MessageListener extends React.Component {

    static propTypes = {
      for:   stringOrArrayofStrings,
      group: stringOrArrayofStrings,
      immutable: React.PropTypes.bool
    }

    static contextTypes ={
      messages: React.PropTypes.func,
      listen:   React.PropTypes.func
    }

    getContext(){
      return useRealContext
        ? this.context
        : this._reactInternalInstance._context
    }

    shouldComponentUpdate(nextProps, nextState){
      if (!this.state && nextState) return true;
      if (this.state && !nextState) return true;
      if (this.state.active !== nextState.active) return true;

      return !shallowEqual(this.state.messages, nextState.messages)
        || !shallowEqual(this.props, nextProps)
    }

    componentWillMount() {
      this._removeChangeListener = this.getContext()
        .listen(() => this.setState(this._getValidationState()))

      this.setState(this._getValidationState())
    }

    componentWillUnmount() {
      this._removeChangeListener()
    }

    render(){
      return <Component {...this.props} {...this.state}/>
    }

    _getValidationState(){
      var messages = this.getContext().messages(this.props.for, this.props.group);

      return {
        messages,
        active: !!(messages && Object.keys(messages).length)
      }
    }

  }