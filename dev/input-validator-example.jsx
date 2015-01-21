'use strict';
var React = require('react/addons')
var Validator = require('../src/components/Validator.jsx')
var FormInput = require('../src/components/ValidationInput.jsx')
var FormButton = require('../src/components/ValidateButton.jsx')
var ValidationMessage = require('../src/components/ValidationMessage.jsx')
var RW = require('react-widgets')
var assign = require('xtend')


/*
 *  This a simple example showing how you can hook up valiation based on specified rules (the traditional way)
 *  To do this we are going to use `node-validator` as the validation engine and specify validation rules on the 
 *  <FormInput/> with a simple syntax i just made up 
 */
var validator = require('validator')


// module allows for deep property access via a string path: "foo.bar['baz']"
var getter = require('property-expr').getter
var setter = require('property-expr').setter

// lets add two custom validators
validator.extend('isPositive', str => parseFloat(str) > 0)
validator.extend('isRequired', str => !!str.length)

// Simple component to pull it all together
var App = React.createClass({

  getInitialState: function(){
    // create an empty model for the initial value
    return {
      personal: {},
      trivia: {}
    }
  },

  /*
   *  Lets render a form that validates based on rules specified per input
   */
  render(){
    var model = this.state; // the data to bind to the form
    
    function onvalidate(...args){
      console.log(args)
    }

    return (
      <div style={{ width: 400 }}>
        <Validator validate={this.validate} onValidate={onvalidate}>
          <form className='form-horizontal' >
            <fieldset>
              <legend>Personal</legend>
              <div className='form-group'>
                <label className='control-label col-sm-3'>name</label>
                <div className='col-sm-8'>
                  {/* we add a prop that we can check in our onValidate method */}
                  <FormInput for='personal.name' group='personal' 
                    validations={['isRequired']} 
                    messages={['please enter a name']}>

                    <input type='text' className='form-control' 
                      value={model.personal.name} 
                      onChange={this.createHandler('personal.name')}/>

                  </FormInput>
                  <ValidationMessage for='personal.name'/>
                </div>
              </div>
              <div className='form-group'>
                <label className='control-label col-sm-3'>birthday</label>
                <div className='col-sm-8'>
                  <FormInput for='personal.birthday' group='personal' 
                    validations={['isDate']} messages={['please enter a date']}>
                      <RW.DateTimePicker time={false} format='d' 
                        value={model.personal.birthday} 
                        onChange={this.createHandler('personal.birthday')}/>
                  </FormInput>
                  <ValidationMessage for='personal.birthday'/>
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
                  <FormInput for='trivia.favNumber' 
                    validations={['isInt', 'isPositive']} 
                    messages={['please enter an integer', 'please enter a positive number']}>
                      <RW.NumberPicker value={model.trivia.favNumber} onChange={this.createHandler('trivia.favNumber')}/>
                  </FormInput>
                  <ValidationMessage for='trivia.favNumber'/>
                </div>
              </div>
              <div className='form-group'>
                <div className='col-sm-offset-3 col-sm-8'>
                  <FormButton type='button' className='btn btn-primary'>Submit</FormButton>
                </div>
              </div>
            </fieldset>
          </form>
        </Validator>
      </div>
    )
  },

  /*
  * This is the callback used by the validator component
  */
  validate( path, input) {
    // The state is updated by widgets, but isn't always synchronous so we check _pendingState first
    var value = getter(path)(this._pendingState || this.state );

    var validations = input.props.validations // validations we specified below
      , messages = input.props.messages
      , valid, error;

    valid = validations.every( (method, idx) => {
      var valid =  validator[method](value)

      if(!valid) error = messages[idx]
      return valid
    })

    return error
  },

  /*
  * This is a little factory method that returns a function that updates the state for a given path
  * it creates the `onChange` handlers for our inputs
  */
  createHandler(path){
    var self = this
      , setpath = setter(path)

    return function(val){
      var s = assign(self.state); // copy state so we can update without mutating

      if( val && val.target) // in case we got a `SyntheticEvent` object, react-widgets pass the value directly to onChange
        val = val.target.value

      setpath(s, val)
      self.setState(s)
    }
  },
})

React.render(<App/>, document.body);



