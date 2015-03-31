var React = require('react')

module.exports = Component =>
  class MessageListener extends React.Component {

    static propTypes = {
      for: React.PropTypes.oneOfType([
             React.PropTypes.string,
             React.PropTypes.arrayOf(React.PropTypes.string)
           ]).isRequired
    }

    static contextTypes ={
      messages: React.PropTypes.func,
      listen:   React.PropTypes.func
    }

    getContext(){
      return process.env.NODE_ENV !== 'production' 
        ? this.context
        : this._reactInternalInstance._context
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
      var messages = this.getContext().messages(this.props.for);

      return { 
        messages,
        active: messages && Object.keys(messages).length
      }
    }

  }