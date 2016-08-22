import React from 'react';
import $ from 'teaspoon';

let {
    MessageContainer
  , MessageTrigger } = require('../src');

describe('Trigger', ()=>{

  it('should trigger event for name', function(){
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

  it('should trigger event for name with func child', function(){
    var spy = sinon.spy()
      , inst = $(
      <MessageContainer onValidationNeeded={spy} >
        <div>
          <MessageTrigger for='fieldA'>
            {props => <input {...props}/>}
          </MessageTrigger>
        </div>
      </MessageContainer>)

    inst.render().find('input').trigger('change')

    spy.should.have.been.calledOnce
    spy.args[0][0].fields.should.eql(['fieldA'])
  })

  it('should trigger event once with multiple names', function(){
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

  it('should trigger group', function(done) {
    function spy({ fields }) {
      fields.should.eql(['fieldA'])
      done()
    }

    var inst = $(
      <MessageContainer onValidationNeeded={spy}>
        <div>
          <MessageTrigger for={'fieldA'} group='foo'>
            <input />
          </MessageTrigger>
          <MessageTrigger for={'fieldB'}>
            <input />
          </MessageTrigger>

          <MessageTrigger events='onClick' group='foo'>
            <button />
          </MessageTrigger>
        </div>
      </MessageContainer>)

    inst.render()
      .single('button')
      .trigger('click');
  })

  it('should trigger entire form', function(done) {
    function spy({ fields }) {
      fields.should.eql([
        'fieldA',
        'fieldB',
      ])
      done()
    }

    var inst = $(
      <MessageContainer onValidationNeeded={spy}>
        <div>
          <MessageTrigger for={'fieldA'} group='foo'>
            <input />
          </MessageTrigger>
          <MessageTrigger for={'fieldB'}>
            <input />
          </MessageTrigger>

          <MessageTrigger events='onClick' group='@all'>
            <button />
          </MessageTrigger>
        </div>
      </MessageContainer>)

    inst.render()
      .single('button')
      .trigger('click');
  })
})
