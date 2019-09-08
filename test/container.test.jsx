import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MessageContainer, MessageTrigger, Message } from '../src'
import sinon from 'sinon'

describe('Container', function () {
  it('should pass messages', () => {
    const { getByLabelText, container } = render(
      <MessageContainer messages={{ fieldA: ['hi', 'good day'] }} >
        <label>
          <Message for='fieldA' className='msg' />
          <Message for='fieldB' className='msg' />
        </label>
      </MessageContainer>)

    expect(getByLabelText('hi, good day')).toBeTruthy()

  })

  it('should return names for group', () => {
    let instance
    render(
      <MessageContainer ref={ref => instance = ref}>
        <MessageTrigger for='fieldA' className='msg' group='foo'>
          <input />
        </MessageTrigger>
      </MessageContainer>
    )

    expect(instance.namesForGroup('foo')).toEqual(['fieldA'])
  })
})

describe('nested containers', () => {

  it('should pass messages to inner', () => {
    const { getByLabelText, container } = render(
      <MessageContainer messages={{ first: ['invalid name'] }}>
          <MessageContainer passthrough>
            <label>
              <Message for='first' className='msg'/>
            </label>
          </MessageContainer>
      </MessageContainer>
    )

    expect(getByLabelText('invalid name')).toBeTruthy()
  })

  it('should surface nested triggers', () => {
    let outerSpy = sinon.spy();
    let innerSpy = sinon.spy();

    const { getByLabelText } = render(
      <MessageContainer onValidationNeeded={outerSpy}>
        <div>
          <MessageContainer
            passthrough
            onValidationNeeded={innerSpy}
          >
            <div>
            <label htmlFor="a">target</label>
              <MessageTrigger for='first' className='msg' group='foo'>
                <input id='a' />
              </MessageTrigger>
            </div>
          </MessageContainer>
        </div>
      </MessageContainer>
    )
    fireEvent.change(getByLabelText('target'), { target: { value: 'foo' } })
    expect(outerSpy.calledOnce).toEqual(true)
    expect(outerSpy.calledWithMatch({fields: ['first']})).toEqual(true)
    expect(innerSpy.notCalled).toEqual(true)
  })

  it('should only surface passthrough containers', () => {
    let outerSpy = sinon.spy();
    let innerSpy = sinon.spy();

    const { getByLabelText } = render(
      <MessageContainer onValidationNeeded={outerSpy}>
        <div>
          <MessageContainer onValidationNeeded={innerSpy}>
            <div>
            <label htmlFor="a">target</label>
              <MessageTrigger className='msg' group='foo'>
                <input id='a' />
              </MessageTrigger>
            </div>
          </MessageContainer>
        </div>
      </MessageContainer>
    )
    fireEvent.change(getByLabelText('target'), { target: { value: 'foo' } })
    expect(innerSpy.calledOnce).toEqual(true)
    expect(outerSpy.notCalled).toEqual(true)
  })

  it('should map messages between containers', () => {
    const { getByLabelText } = render(
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
            <label>
              <Message for='first' className='msg'/>
            </label>
          </MessageContainer>
        </div>
      </MessageContainer>
    )
    expect(getByLabelText('invalid name')).toBeTruthy()
  })

  it('should map names between containers', () => {
    let outerSpy = sinon.spy();

    const { getByLabelText } = render(
      <MessageContainer onValidationNeeded={outerSpy}>
        <div>
          <MessageContainer
            passthrough
            mapNames={(names) => names.map(name => `names.${name}`)}
          >
            <div>
            <label htmlFor="a">target</label>
              <MessageTrigger for='first' className='msg' group='foo'>
                <input id='a'/>
              </MessageTrigger>
            </div>
          </MessageContainer>
        </div>
      </MessageContainer>
    )

    fireEvent.change(getByLabelText('target'), { target: { value: 'foo' } })
    expect(outerSpy.calledWithMatch({fields: ['names.first']})).toEqual(true)
  })

  it('should prefer message prop to context', () => {
    const { getByLabelText } = render(
      <MessageContainer messages={{ first: ['invalid name'] }}>
        <div>
          <MessageContainer
            passthrough
            messages={{ first: ['sort of invalid name'] }}
          >
            <label>
              <Message for='first' className='msg inner'/>
            </label>
          </MessageContainer>

          <Message for='first' className='msg outer'/>
        </div>
      </MessageContainer>
    )

    expect(getByLabelText('sort of invalid name')).toBeTruthy()
  })
})

