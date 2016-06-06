import React from 'react';


function resolveNames(container, props) {
  let { group, 'for': forNames } = props;

  if (!forNames && container)
    forNames = container.namesForGroup(group);

  return forNames ? [].concat(forNames) : [];
}

function defaultMapMessages(messages, props, container) {
  let names = resolveNames(container, props);
  if (!names.length) return messages;

  let messagesForNames = {};

  names.forEach(name => {
    if (messages[name])
      messagesForNames[name] = messages[name]
  })

  return messagesForNames;
}


export default (Component, mapMessages = defaultMapMessages) =>
  class MessageListener extends React.Component {

    static DecoratedComponent = Component

    static contextTypes = {
      messageContainer: React.PropTypes.object,
    }

    componentWillMount() {
      let container = this.context.messageContainer;

      if (container) {
        this.unsubscribe = container.subscribe(messages => {
          if (mapMessages)
            messages = mapMessages(messages, this.props, container)

          this.setState({ messages })
        })
      }
    }

    componentWillReceiveProps(nextProps, nextContext) {
      if (mapMessages && mapMessages.length >= 2) {
        let container = nextContext.messageContainer;
        this.setState({
          messages: mapMessages(this.state.messages, nextProps, container)
        })
      }
    }

    componentWillUnmount() {
      this.unsubscribe && this.unsubscribe()
    }

    render(){
      return <Component {...this.props} {...this.state}/>
    }
  }
