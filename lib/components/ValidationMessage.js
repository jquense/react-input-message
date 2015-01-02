'use strict';
var React = require('react');

var ValidationMessage = React.createClass({displayName: "ValidationMessage",

  mixins: [ require('./ValidationListenerMixin') ],

  propTypes: {
    for: React.PropTypes.oneOfType([
           React.PropTypes.string,
           React.PropTypes.arrayOf(React.PropTypes.string)
         ]).isRequired
  },

  getDefaultProps:function() {
    return {
      component: 'span'
    }
  },

  render:function() {
    var classes = 'rv-validation-message'
      , errors = this.state.errors;

    errors = Object.keys(errors)
        .reduce( function(errs, grp)  {return errs.concat(errors[grp]);}, []);

    if (!this.state.valid)
      classes += ' field-error'

    return React.createElement(this.props.component, {
      className: classes,
    }, errors.join(', '));
  }
});

module.exports = ValidationMessage;