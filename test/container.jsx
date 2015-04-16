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

  // it('should pass messages', () => {
  //   var inst = utils.renderIntoDocument(
  //     <MessageContainer messages={{ fieldA: 'hi' }} >
  //       <div>
  //         <Message for='fieldA' className='msg'/>
  //         <Message for='fieldB' className='msg'/>
  //       </div>
  //     </MessageContainer>)

  //   var messages = findClass(inst, 'msg');

  //   console.log(messages)

  //   messages[0].props.active.should.equal(true)
  //   messages[0].props.messages.should.equal('hi')

  //   messages[1].props.active.should.equal(false)
  // })

})