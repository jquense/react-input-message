import React from 'react';
import tsp from 'teaspoon';

let {
    MessageContainer
  , Message
  , MessageTrigger } = require('../src');

describe('Container', function(){

  it('should pass messages', () => {
    var inst = tsp(
      <MessageContainer messages={{ fieldA: ['hi', 'good day'] }} >
        <div>
          <Message for='fieldA' className='msg'/>
          <Message for='fieldB' className='msg'/>
        </div>
      </MessageContainer>)


    inst.render().find('.msg:dom').text()
      .should.equal('hi, good day')
  })

  it('should return names for group', () => {
    var inst = tsp(
      <MessageContainer>
        <MessageTrigger for='fieldA' className='msg' group='foo'>
          <input />
        </MessageTrigger>
      </MessageContainer>
    )
    .render()
    .unwrap();

    inst.namesForGroup('foo').should.eql(['fieldA'])
  })

  describe('nested containers', () => {

    it('should pass messages to inner', () => {
      let inst = tsp(
        <MessageContainer messages={{ first: ['invalid name'] }}>
          <div>
            <MessageContainer passthrough>
              <div>
                <Message for='first' className='msg'/>
              </div>
            </MessageContainer>
          </div>
        </MessageContainer>
      )
      .render();

      inst.single('.msg:dom').text().should.equal('invalid name')
    })

    it('should surface nested triggers', () => {
      let outerSpy = sinon.spy();
      let innerSpy = sinon.spy();

      tsp(
        <MessageContainer onValidationNeeded={outerSpy}>
          <div>
            <MessageContainer
              passthrough
              onValidationNeeded={innerSpy}
            >
              <div>
                <MessageTrigger for='first' className='msg' group='foo'>
                  <input />
                </MessageTrigger>
              </div>
            </MessageContainer>
          </div>
        </MessageContainer>
      )
      .render()
      .find('input')
      .trigger('change', { target: { value: 'foo' }});

      outerSpy.should.have.been.calledOnce;
      outerSpy.getCall(0).args[0].fields.should.eql(['first']);

      innerSpy.should.not.have.been.called;
    })

    it('should only surface passthrough containers', () => {
      let outerSpy = sinon.spy();
      let innerSpy = sinon.spy();

      tsp(
        <MessageContainer onValidationNeeded={outerSpy}>
          <div>
            <MessageContainer onValidationNeeded={innerSpy}>
              <div>
                <MessageTrigger className='msg' group='foo'>
                  <input />
                </MessageTrigger>
              </div>
            </MessageContainer>
          </div>
        </MessageContainer>
      )
      .render()
      .find('input')
      .trigger('change', { target: { value: 'foo' }});

      innerSpy.should.have.been.calledOnce;
      outerSpy.should.not.have.been.called;
    })

    it('should map messages between containers', () => {
      let inst = tsp(
        <MessageContainer messages={{ 'names.first': ['invalid name'] }}>
          <div>
            <MessageContainer
              passthrough
              mapMessages={messages =>
                Object.keys(messages).reduce((obj, key) => {
                  obj[key.replace('names.', '')] = messages[key]
                  return obj
                }, {})
              }
            >
              <div>
                <Message for='first' className='msg'/>
              </div>
            </MessageContainer>
          </div>
        </MessageContainer>
      )
      .render();

      inst.single('.msg:dom').text().should.equal('invalid name')
    })

    it('should map names between containers', () => {
      let outerSpy = sinon.spy();

      tsp(
        <MessageContainer onValidationNeeded={outerSpy}>
          <div>
            <MessageContainer
              passthrough
              mapNames={(names) => names.map(name => `names.${name}`)}
            >
              <div>
                <MessageTrigger for='first' className='msg' group='foo'>
                  <input />
                </MessageTrigger>
              </div>
            </MessageContainer>
          </div>
        </MessageContainer>
      )
      .render()
      .find('input')
      .trigger('change', { target: { value: 'foo' }});

      outerSpy.getCall(0).args[0].fields
        .should.eql(['names.first']);
    })

    it('should prefer message prop to context', () => {
      let inst = tsp(
        <MessageContainer messages={{ first: ['invalid name'] }}>
          <div>
            <MessageContainer
              passthrough
              messages={{ first: ['sort of invalid name'] }}
            >
              <div>
                <Message for='first' className='msg inner'/>
              </div>
            </MessageContainer>

            <Message for='first' className='msg outer'/>
          </div>
        </MessageContainer>
      )
      .render();

      inst.single('.msg.inner:dom').text().should.equal('sort of invalid name')
    })
  })

})
