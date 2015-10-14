import React from 'react';
import $ from 'teaspoon';

let {
    MessageContainer
  , MessageTrigger
  , Message } = require('../src');

describe('Trigger', ()=>{

  it('should trigger event for path', function(){
    var spy = sinon.spy()
      , inst = $(
      <MessageContainer onValidationNeeded={spy} >
        <div>
          <MessageTrigger for='fieldA'>
            <input />
          </MessageTrigger>
        </div>
      </MessageContainer>)

    inst.render().find('input').trigger('change')

    spy.should.have.been.calledOnce
    spy.args[0][0].fields.should.eql(['fieldA'])
  })

  it('should trigger event once with multiple fields', function(){
    var spy = sinon.spy()
      , inst = $(
      <MessageContainer onValidationNeeded={spy} >
        <div>
          <MessageTrigger for={['fieldA', 'fieldB']}>
            <input />
          </MessageTrigger>
        </div>
      </MessageContainer>)

    inst.render().find('input').trigger('change')

    spy.should.have.been.calledOnce
    spy.args[0][0].fields.should.eql(['fieldA', 'fieldB'])
  })
})
