import React from 'react';

export default Component =>
  class MessageListener extends React.Component {

    static DecoratedComponent = Component

    static contextTypes = {
      messageContainer: React.PropTypes.object
    }

    componentWillMount() {
      let container = this.context.messageContainer;

      if (container) {
        this.unsubscribe = container.subscribe(messages => {
          this.setState({ messages })
        });
      }
    }

    componentWillUnmount() {
      this.unsubscribe && this.unsubscribe()
    }

    render(){
      return <Component {...this.props} {...this.state}/>
    }
  }
