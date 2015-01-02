'use strict';
var React = require('react/addons')
var Validator = require('../src/components/Validator.jsx')
var FormInput = require('../src/components/ValidationInput.jsx')
var FormButton = require('../src/components/FormButton.jsx')
var ValidationMessage = require('../src/components/ValidationMessage.jsx')
var RW = require('react-widgets')
var assign = require('xtend')

// we'll use yup to define and test our model via a schema
var yup = require('yup')

// module allows for deep propertay access via a string path: "foo.bar['baz']"
var getter = require('property-expr').getter
var setter = require('property-expr').setter

/*
* here we define a schema to use as our validator
*/
var schema = yup.object({
      personal:  yup.object({
        name:      yup.string().required('please provide a name').default(''),
        birthday:  yup.date().required('please provide a date of birth'),
      }),

      trivia: yup.object({

        favNumber: yup.number()
                      .required().default(0)
                      .min(0, 'your favorite number cannot be negative')
      }),

    }).strict();

// Simple component to pull it all together
var App = React.createClass({

  getInitialState: function(){
    // create a default empty model for the initial value
    return schema.default()
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

      if( val && val.target) // in case we got a `SyntheticEvent` object 
        val = val.target.value

      setpath(s, val === null ? undefined : val) // i don't want to allow nullable values so coerce to undefined
      self.setState(s)
    }
  },

  /*
  * This is the callback used by the validator component
  */
  validate( path, input) {
    // The state is updated by widgets, but isn't always synchronous so we check _pendingState first
    var state = this._pendingState || this.state 

    // `reach()` pulls out a child schema so we can test a single path
    var field = yup.reach(schema, path)

    // we also need the specific value for this path
    var value = getter(path)(state);

    return field.validate(value, { strict: true })
      .then(() => void 0)       // if valid return nothing
      .catch(err => err.errors) // if invalid return the errors for this field
  },

  render(){
    var model = this.state; // the data to bind to the form
    
    return (
      <div style={{ width: 400 }}>
        <Validator onValidate={this.validate}>
          <form className='form-horizontal' >
            <fieldset>
              <legend>Personal</legend>
              <div className='form-group'>
                <label className='control-label col-sm-3'>name</label>
                <div className='col-sm-8'>
                  <FormInput for='personal.name' group='personal'>
                    <input type='text' className='form-control' value={model.personal.name} onChange={this.createHandler('personal.name')}/>
                  </FormInput>
                  <ValidationMessage for='personal.name'/>
                </div>
              </div>
              <div className='form-group'>
                <label className='control-label col-sm-3'>birthday</label>
                <div className='col-sm-8'>
                  <FormInput for='personal.birthday' group='personal'>
                    <RW.DateTimePicker time={false} format='d' value={model.personal.birthday} onChange={this.createHandler('personal.birthday')}/>
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
                  <FormInput for='trivia.favNumber'>
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
  }
})

React.render(<App/>, document.body);



