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

describe('Message', ()=>{

  it('should use the prop Component', function(){
    var inst = utils.renderIntoDocument(
      <MessageContainer messages={{ fieldA: 'hi', fieldB: 'good day' }} >
        <div>
          <Message for='fieldA' className='msg' component='p'/>
        </div>
      </MessageContainer>)

    var messages = findTag(inst, 'p');
  })

  it('should allow empty `for`', function(){
    var inst = utils.renderIntoDocument(
      <MessageContainer messages={{ fieldA: 'hi', fieldB: 'good day' }} >
        <div>
          <Message className='msg'/>
        </div>
      </MessageContainer>)

    var messages = findType(inst, Message._Message);

    messages.props.messages.should.eql({ fieldA: 'hi', fieldB: 'good day' })
  })

  it('should allow group summaries', function(){
    var inst = utils.renderIntoDocument(
      <MessageContainer messages={{ fieldA: 'hi', fieldB: 'good day' }} >
        <div>
          <MessageTrigger for='fieldA' group='test'>
            <input/>
          </MessageTrigger>
          <Message group='test' className='msg'/>
        </div>
      </MessageContainer>)

    var messages = findType(inst, Message._Message);

    messages.props.messages.should.eql({ fieldA: 'hi' })
  })
})