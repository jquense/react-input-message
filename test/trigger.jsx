import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MessageContainer, MessageTrigger, Message } from '../src'
import sinon from 'sinon'

describe('Trigger', () => {

  it('should trigger event for name', function () {
    var spy = sinon.spy()
    const { getByLabelText } = render(
      <MessageContainer onValidationNeeded={spy} >
        <div>
          <label htmlFor="a">target</label>
          <MessageTrigger for='fieldA'>
            <input id='a' />
          </MessageTrigger>
        </div>
      </MessageContainer>)
    fireEvent.change(getByLabelText('target'), { target: { value: 'foo' } })
    expect(spy.calledOnce).toEqual(true)
    expect(spy.calledWithMatch({ fields: ['fieldA'] })).toEqual(true)
  })

  it('should trigger event for name with func child', function () {
    var spy = sinon.spy()
    const { getByLabelText } = render(
      <MessageContainer onValidationNeeded={spy} >
        <div>
          <label htmlFor="a">target</label>
          <MessageTrigger for='fieldA'>
            {props => <input id='a' {...props} />}
          </MessageTrigger>
        </div>
      </MessageContainer>)

    fireEvent.change(getByLabelText('target'), { target: { value: 'foo' } })
    expect(spy.calledOnce).toEqual(true)
    expect(spy.calledWithMatch({ fields: ['fieldA'] })).toEqual(true)
  })

  it('should trigger event once with multiple names', function () {
    var spy = sinon.spy()
    const { getByLabelText } = render(
      <MessageContainer onValidationNeeded={spy} >
        <div>
          <label htmlFor="a">target</label>
          <MessageTrigger for={['fieldA', 'fieldB']}>
            <input id='a' />
          </MessageTrigger>
        </div>
      </MessageContainer>)

    fireEvent.change(getByLabelText('target'), { target: { value: 'foo' } })
    expect(spy.calledOnce).toEqual(true)
    expect(spy.calledWithMatch({ fields: ['fieldA', 'fieldB'] })).toEqual(true)
  })

  it('should trigger group', function (done) {
    function spy({ fields }) {
      expect(fields).toEqual(['fieldA'])
      done()
    }

    const { getByText } = render(
      <MessageContainer onValidationNeeded={spy}>
        <div>
          <MessageTrigger for={'fieldA'} group='foo'>
            <input />
          </MessageTrigger>
          <MessageTrigger for={'fieldB'}>
            <input />
          </MessageTrigger>

          <MessageTrigger events='onClick' group='foo'>
            <button >click</button>
          </MessageTrigger>
        </div>
      </MessageContainer>)

    fireEvent.click(getByText('click'))
  })

  it('should trigger entire form', function (done) {
    function spy({ fields }) {
      expect(fields).toEqual([
        'fieldA',
        'fieldB',
      ])
      done()
    }

    const { getByText } = render(
      <MessageContainer onValidationNeeded={spy}>
        <div>
          <MessageTrigger for={'fieldA'} group='foo'>
            <input />
          </MessageTrigger>
          <MessageTrigger for={'fieldB'}>
            <input />
          </MessageTrigger>

          <MessageTrigger events='onClick' group='@all'>
            <button >click</button>
          </MessageTrigger>
        </div>
      </MessageContainer>)

    fireEvent.click(getByText('click'))
  })
})
