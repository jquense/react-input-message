'use strict';

module.exports = {
  Validator: require('./lib/Validator'),

  MessageSource: require('./lib/MessageSource'),
  MessageTrigger:  require('./lib/MessageTrigger'),
  MessageContainer: require('./lib/MessageContainer'),
  Message: require('./lib/Message'),

  connectToMessageContainer:  require('./lib/connectToMessageContainer')
}

