'use strict';

var Validator = require('../src/components/Validator.jsx');
var ValidationMessage = require('../src/components/ValidationMessage.jsx');
var FormInput = require('../src/components/FormInput.jsx');
var React= require('react/addons')
  , utils = React.addons.TestUtils
  , chai = require('chai');

chai.should()
chai.use(require('chai-as-promised'))
chai.use(require('sinon-chai'))


var findTag = utils.findRenderedDOMComponentWithTag
  , findClass = utils.findRenderedDOMComponentWithClass
  , findAllTag = utils.scryRenderedDOMComponentsWithTag
  , findAllClass = utils.scryRenderedDOMComponentsWithClass
  , findType = utils.findRenderedComponentWithType
  , findAllType = utils.scryRenderedComponentWithType
  , trigger = utils.Simulate

describe('Input', function() {

  it('should register the input', function(){
    var form = utils.renderIntoDocument(
      <Validator onValidate={()=> 'error' }>
        <FormInput for='Field_A' group='Group_A' errorClass='field-error'>
         <input type='text' />
        </FormInput>
      </Validator>)

    form._validator._inputs.should.have.key('Field_A')
    form._validator._groups.should.have.key('Group_A')
  })

  it('should validate input', function(done){
    var form = utils.renderIntoDocument(
      <Validator onValidate={()=> 'error'}>
        <FormInput for='Field_A' errorClass='field-error'>
         <input type='text' />
        </FormInput>
      </Validator>)

    var input = findType(form, FormInput)

    trigger.change(input.getDOMNode())

    process.nextTick(() => {
      chai.expect(input.getDOMNode().className.match(/\bfield-error\b/)).to.be.ok
      done()
    })
  })


  it('should update when props change input', function(done){
    var Input = React.createClass({
      render(){
        var state = this.state || {}
        return (
          <Validator ref='form' onValidate={()=> 'error'}>
            <FormInput for={ state.for || 'Field_A'}>
              <input type='text' />
            </FormInput>
          </Validator>)
      } 
    })

    var form = utils.renderIntoDocument(<Input/>)
      , validator = form.refs.form._validator

    validator._inputs.should.have.key('Field_A')

    form.setState({ for: 'Field_B'}, function(){
      validator._inputs
        .should.have.key('Field_B').and.not.have.key('Field_A')

      done()
    })
  })

})



// var form = utils.renderIntoDocument(
//       <Validator onValidate={()=>{}}>
//         <FormInput for='Field_A' group='dates'>
//           <input type='text' className='form-control'/>
//         </FormInput>
//         <FormInput for='Field_B' group='dates'>
//           <input type='date' className='form-control'/>
//         </FormInput>
//         <ValidationMessage for={['Field_A', 'Field_B']}/>
//         <FormInput for='Field_C'>
//           <input type='number' className='form-control'/>
//         </FormInput>
//         <ValidationMessage for='Field_C'/>
//       </Validator>)