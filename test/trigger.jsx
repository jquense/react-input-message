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

describe('Trigger', ()=>{

  it('should trigger event for path', function(){
    var spy = sinon.spy()
      , inst = utils.renderIntoDocument(
      <MessageContainer onValidationNeeded={spy} >
        <div>
          <MessageTrigger for='fieldA'>
            <input />
          </MessageTrigger>
        </div>
      </MessageContainer>)

    
    trigger.change(findTag(inst, 'input').getDOMNode())

    spy.should.have.been.calledOnce
    spy.args[0][0].fields.should.eql(['fieldA'])
  })

  it('should trigger event once with multiple fields', function(){
    var spy = sinon.spy()
      , inst = utils.renderIntoDocument(
      <MessageContainer onValidationNeeded={spy} >
        <div>
          <MessageTrigger for={['fieldA', 'fieldB']}>
            <input />
          </MessageTrigger>
        </div>
      </MessageContainer>)

    trigger.change(findTag(inst, 'input').getDOMNode())

    spy.should.have.been.calledOnce
    spy.args[0][0].fields.should.eql(['fieldA', 'fieldB'])
  })
})