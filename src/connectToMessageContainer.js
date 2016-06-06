import React from 'react';


function defaultResolveNames(props, container) {
  let { group, 'for': forNames } = props;

  if (!forNames && container)
    forNames = container.namesForGroup(group);

  return forNames ? [].concat(forNames) : [];
}

function defaultMapMessages(messages, names) {
  if (!names.length) return messages;

  let messagesForNames = {};
  names.forEach(name => {
    if (messages[name])
      messagesForNames[name] = messages[name]
  })

  return messagesForNames
}

function mapMessages(messages, resolveNames, props, container) {
  let names = resolveNames ? resolveNames(props, container) : [];
  let { mapMessages } = props;

  return (mapMessages || defaultMapMessages)(messages, names, props, container)
}

export default (Component, resolveNames = defaultResolveNames) =>
  class MessageListener extends React.Component {

    static DecoratedComponent = Component

    static propTypes = {
      mapMessages: React.PropTypes.func,
    }

    static contextTypes = {
      messageContainer: React.PropTypes.object,
    }

    componentWillMount() {
      let container = this.context.messageContainer;

      if (container) {
        this.unsubscribe = container.subscribe(messages => {
          messages = mapMessages(messages, resolveNames, this.props, container)

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
