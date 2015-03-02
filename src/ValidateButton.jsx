'use strict';
var React  = require('react')

var FormButton = React.createClass({

  mixins: [ 
    require('./mixins/ValidationTrigger') 
  ],

  propTypes: {
    component: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.func
               ]).isRequired,
    group:  React.PropTypes.oneOfType([
              React.PropTypes.string,
              React.PropTypes.arrayOf(React.PropTypes.string)
            ])
  },

  getDefaultProps: function() {
    return {
      component: 'button'
    }
  },

  render() {
    var { 
        children
      , component
      , ...props } = this.props;

    return React.createElement(
        component
      , { ...props, onClick: this._click }
      , children);
  },

  _click(...args){
    this.validate(this.props.group, args)
      .catch( e => setTimeout( ()=>{ throw e }))
      
    this.props.onClick && this.props.onClick.apply(this, { args })
  }

});

module.exports = FormButton;
