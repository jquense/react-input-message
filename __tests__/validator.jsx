'use strict';

var Validator = require('../src/Validator');
var ValidatorComponent = require('../src/components/Validator.jsx');
var React= require('react/addons')
  , chai = require('chai');

chai.should()
chai.use(require('chai-as-promised'))
chai.use(require('sinon-chai'))

describe('validator', function(){

  it('should register and unregister elements', function(){
    var spy
      , Input = React.createElement('div')
      , val = new Validator( spy = sinon.spy());

    val.register('field', null, Input)

    return val.validate().should.eventually.be.fulfilled
      .then(() => {
        spy.should.have.been.calledOnce.and.calledWithExactly('field', Input)
        
        val.unregister('field')

        return val.validate().should.eventually.be.fulfilled
          .then(() => {
            spy.should.have.been.calledOnce
          })
      })
  })

  it('should add to group', function(){
    var spy   = sinon.spy()
      , Input = React.createElement('div')
      , val   = new Validator( spy );

    val.register('field', 'group', Input)
    val.register('field', ['groupB', 'groupC'], Input)
    val.register('fieldB', ['groupB', 'groupC'], Input)

    val._groups.should.eql({ 
      group:  ['field'], 
      groupB: ['field', 'fieldB'], 
      groupC: ['field', 'fieldB']
    })
  })

  it('should register errors', function(){
    var spy   = sinon.spy(() => "error")
      , Input = React.createElement('div')
      , val   = new Validator( spy );

    val.register('field', Input)
    val.register('fieldB', Input)

    return val.validate().should.eventually.be.fulfilled
      .then(() => {
        val.errors().should.have.keys(['field', 'fieldB'])

        val.isValid('field').should.not.be.true
        val.isValid('fieldB').should.not.be.true
      })
  })

  it('should remove previous errors', function(){
    var time  = 0
      , spy   = sinon.spy(() => (time++) < 1 ? "error" : null)
      , Input = React.createElement('div')
      , val   = new Validator( spy );

    val.register('field', Input)
    val.register('fieldB', Input)

    return val.validate('field').should.eventually.be.fulfilled
      .then(() => {
        val.errors().should.not.be.empty

        return val.validate().should.eventually.be.fulfilled
          .then(() => {
            val.errors().should.be.empty
          })
      })
  })


  it('should validate groups errors', function(){
    var seen  = []
      , spy   = sinon.spy( path => seen.push(path))
      , Input = React.createElement('div')
      , val   = new Validator( spy );

    val.register('fieldA', 'group', Input)
    val.register('fieldB', Input)
    val.register('fieldC', 'group', Input)

    return val.validate('group')
      .then(() => {
        seen.should.eql(['fieldA', 'fieldC'])
        val.removeFromGroups('fieldC', ['group'])

        seen = []

        return val.validate('group')
          .then(() => {
            seen.should.eql(['fieldA'])
          })
      })
  })

  it('should validate fields', function(){
    var seen  = []
      , spy   = sinon.spy( path => seen.push(path))
      , Input = React.createElement('div')
      , val   = new Validator( spy );

    val.register('fieldA', Input)
    val.register('fieldB', Input)
    val.register('fieldC',Input)

    return val.validateField('fieldA')
      .then(() => {
        seen.should.eql(['fieldA'])
        seen = []

        return val.validateField(['fieldB', 'fieldC'])
          .then(() => {
            seen.should.eql(['fieldB', 'fieldC'])
          })
      })
  })

})

var findAllTag = React.addons.TestUtils.scryRenderedDOMComponentsWithTag


describe('validator component', function() {

  it('should hackily pass context down to children', function(){

    var Child = React.createClass({ 
      mixins: [ require('../src/components/ValidationListenerMixin') ],
      render() { return <span/> }
    })

    var element = React.addons.TestUtils.renderIntoDocument(
          <ValidatorComponent onValidate={()=>{}}>
            <div><Child for='hi'/></div>
          </ValidatorComponent>
        )
      , divs = findAllTag(element, 'div');

      divs.forEach( div => 
        div._currentElement._context
          .should.have.property('validator')
          .that.is.an.instanceof(Validator))
  })
})