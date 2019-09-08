import React from 'react'
import ReactDOM from 'react-dom'
import validator from 'validator'
import Validator from 'react-input-messages/validator'
import { MessageContainer, MessageTrigger, Message } from 'react-input-messages'

// module allows for deep property access via a string path: "foo.bar['baz']"
var getter = require('property-expr').getter
var setter = require('property-expr').setter

// lets add two custom validators
validator.extend('isPositive', str => parseFloat(str) > 0)
validator.extend('isRequired', str => !!str.length)

let rules = {
  'personal.name': [
    { rule: validator.isRequired, message: 'please enter a name'}
  ],
  'personal.birthday': [
    { rule: validator.isDate, message: 'please enter a date' }
  ],
  'trivia.favNumber': [
    { rule: validator.isInt, message: 'please enter an integer' },
    { rule: validator.isPositive, message: 'please enter a positive number'}
  ]
}

function FormButton(props) {
  let { group, ...childProps } = props;

  return (
    <MessageTrigger group={group} events={['onClick']}>
      <button {...childProps}/>
    </MessageTrigger>
  )
}

// Simple component to pull it all together
class App extends React.Component {

  constructor(){
    super()

    this._pending = [];

    this.state = {
      trivia: {},
      personal: {}
    }

    // This is the callback used by the validator component
    this.validator = new Validator(name => {
      var validations = rules[name] || []
        , value = getter(name)(this.state)
        , error;

      var valid = validations.every(({ rule, message }) => {
        var valid = rule(value)

        if (!valid) error = message
        return valid
      })

      return error
    })
  }

  _runValidations() {
    var pending = this._pending;

    this._pending = []

    if (pending.length)
      this.validator.validate(pending)
        .then(errors => {
          this.setState({ errors })
        })
  }

  /*
   *  Lets render a form that validates based on rules specified per input
   */
  render(){
    let model = this.state; // the data to bind to the form

    let handleValidationRequest = event => {
      // we will store the paths that need validation and run
      // them after the value has been updated if necessary
      this._pending = event.fields.concat(this._pending)

      if (event.type !== 'onChange')
        this._runValidations();
    }

    /*
    * This is a little factory method that returns a function that updates the state for a given path
    * it creates the `onChange` handlers for our inputs
    */
    let createHandler = path => {
      return val => {
        if (val && val.target) // in case we got a `SyntheticEvent` object; react-widgets pass the value directly to onChange
          val = val.target.value

        setter(path)(this.state, val)
        this.setState(this.state, () => this._runValidations())
      }
    }

    return (
      <div style={{ width: 400 }}>
        <MessageContainer
          messages={this.state.errors}
          onValidationNeeded={handleValidationRequest}
        >
          <form className='form-horizontal' >
            <fieldset>
              <legend>Personal</legend>
              <div className='form-group'>
                <label className='control-label col-sm-3'>name</label>
                <div className='col-sm-8'>
                  {/* we add a prop that we can check in our onValidate method */}
                  <MessageTrigger for='personal.name' group='personal'>
                    <input type='text' className='form-control'
                      value={model.personal.name}
                      onChange={createHandler('personal.name')}/>
                  </MessageTrigger>
                  <Message for='personal.name' className='form-message'/>
                </div>
              </div>
              <div className='form-group'>
                <label className='control-label col-sm-3'>birthday</label>
                <div className='col-sm-8'>

                  <MessageTrigger for='personal.birthday' group='personal'>
                      <input type="text" name="bday"
                      value={model.personal.birthday}
                      onChange={createHandler('personal.birthday')}
                      />
                  </MessageTrigger>

                  <Message for='personal.birthday' className='form-message'/>
                </div>
              </div>
              <div className='form-group'>
                <div className='col-sm-offset-3 col-sm-8'>
                  <FormButton group='personal' type='button' className='btn btn-default'>check</FormButton>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend>Trivia</legend>
              <div className='form-group'>
                <label className='control-label col-sm-3'>favorite number</label>
                <div className='col-sm-8'>
                  <MessageTrigger for='trivia.favNumber'>
                  <input type="text" name="bday"
                      value={model.trivia.favNumber}
                      onChange={createHandler('trivia.favNumber')}
                      />
                  </MessageTrigger>
                  <Message for='trivia.favNumber' className='form-message'/>
                </div>
              </div>
              <div className='form-group'>
                <div className='col-sm-offset-3 col-sm-8'>
                  <FormButton type='button' className='btn btn-primary'>Submit</FormButton>
                </div>
              </div>
            </fieldset>
          </form>
        </MessageContainer>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.body);