import React from 'react';
import $ from 'teaspoon';

let {
    MessageContainer
  , MessageTrigger
  , Message } = require('../src');


describe('Message', ()=>{

  it('should use the prop Component', function(){
    var inst = $(
      <MessageContainer messages={{ fieldA: 'hi', fieldB: 'good day' }} >
        <div>
          <Message for='fieldA' className='msg' component='p'/>
        </div>
      </MessageContainer>)

    inst.render().single('p')
  })

  it('should allow empty `for`', function(){
    var inst = $(
      <MessageContainer messages={{ fieldA: 'hi', fieldB: 'good day' }} >
        <div>
          <Message className='msg'/>
        </div>
      </MessageContainer>)

    var messages = inst.render().single(Message._Message)[0];

    messages.props.messages.should.eql({ fieldA: 'hi', fieldB: 'good day' })
  })

  it('should allow group summaries', function(){
    var inst = $(
      <MessageContainer messages={{ fieldA: 'hi', fieldB: 'good day' }} >
        <div>
          <MessageTrigger for='fieldA' group='test'>
            <input/>
          </MessageTrigger>
          <Message group='test' className='msg'/>
        </div>
      </MessageContainer>)

    var messages = inst.render().single(Message._Message)[0];

    messages.props.messages.should.eql({ fieldA: 'hi' })
  })
})
