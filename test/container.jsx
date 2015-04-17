'use strict';
var React = require('react/addons')
  , utils = React.addons.TestUtils
  , { 
    MessageContainer
  , MessageTrigger
  , Message } = require('../src');


var findTag = utils.findRenderedDOMComponentWithTag
  , findClass = utils.findRenderedDOMComponentWithClass
  , findAllTag = utils.scryRenderedDOMComponentsWithTag
  , findAllClass = utils.scryRenderedDOMComponentsWithClass
  , findType = utils.findRenderedComponentWithType
  , findAllType = utils.scryRenderedComponentsWithType
  , trigger = utils.Simulate

describe.only('Container', function(){
  var validator;

  it('should pass messages', () => {
    var inst = utils.renderIntoDocument(
      <MessageContainer messages={{ fieldA: ['hi', 'good day'] }} >
        <div>
          <Message for='fieldA' className='msg'/>
          <Message for='fieldB' className='msg'/>
          <Message className='msg'/>
        </div>
      </MessageContainer>)

    var messages = findClass(inst, 'msg'); //will throw if msg 2 is there

    React.findDOMNode(messages).textContent.should.equal('hi, good day')
  })

})