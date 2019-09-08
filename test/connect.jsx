import React from 'react'
import { render } from '@testing-library/react'
import { MessageContainer, MessageTrigger, Message } from '../src'

describe('Message', () => {
  it('should use the prop Component', function () {
    const { container } = render(
      <MessageContainer messages={{ fieldA: 'hi', fieldB: 'good day' }} >
        <Message for='fieldA' className='msg' component='p' />
      </MessageContainer>)
    expect(container.innerHTML).toEqual('<p class="msg">hi</p>')
  })

  it('should allow empty `for`', function () {
    let instance
    render(
      <MessageContainer ref={ref => instance = ref} messages={{ fieldA: 'hi', fieldB: 'good day' }} >
        <Message className='msg' />
      </MessageContainer>)
    expect(instance.props.messages).toEqual({ fieldA: 'hi', fieldB: 'good day' })
  })

  it('should allow group summaries', function () {
    const { getByLabelText, container } = render(
      <MessageContainer messages={{ fieldA: ['foo', 'hi'], fieldB: 'good day' }} >
        <MessageTrigger for='fieldA' group='test'>
          <input />
        </MessageTrigger>
        <label>
          <Message group='test' className='msg' />
        </label>
      </MessageContainer>)
    expect(getByLabelText('foo, hi')).toBeTruthy()
  })
})
