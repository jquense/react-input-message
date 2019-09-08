import { Validator } from '../src'
import sinon from 'sinon'

describe('validator', function () {
  var validator;

  it('should use passed in validation function', () => {
    var spy
      , context = {}
      , validator = new Validator(spy = sinon.spy())

    return validator.validate('field', context).then(() => {
      expect(spy.calledWith('field', context)).toEqual(true)
    })
  })

  it('should validate an array of fields', () => {
    var spy
      , validator = new Validator(spy = sinon.spy())

    return validator.validate(['fieldA', 'fieldB']).then(() => {
      expect(spy.callCount).toEqual(2)
    })
  })

  it('should track errors', () => {
    var validator = new Validator(field => 'invalid')

    return validator.validate(['fieldA','fieldB']).then(() => {
      const errors = validator.errors()
      expect(Object.keys(errors)).toEqual(['fieldA','fieldB'])
      expect(errors['fieldA']).toHaveLength(1)

      expect(errors['fieldA'][0]).toEqual('invalid')
      expect(errors['fieldB'][0]).toEqual('invalid')
    })
    
  })

  it('should remove errors', () => {
    var count = 0
      , validator = new Validator( field => (count++) ? undefined : 'invalid')

    return validator.validate('fieldA').then(() => {
        expect(Object.keys(validator.errors())).toEqual(['fieldA'])

        return validator.validate('fieldA').then(() => {
            expect(Object.keys(validator.errors())).toEqual([])
          })
      })
  })
})
