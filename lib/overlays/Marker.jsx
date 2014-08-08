/** @jsx React.DOM */

var React = require('react');


var Marker = React.createClass({

  render: function() {
    var style = {
      width: '10px',
      height: '10px',
      'border-radius': '50%',
      'background-color': 'red',
      'margin-top': '-5px',
      'margin-left': '-5px'
    };

    return (
      <div style={style} />
    );
  }
});

module.exports = Marker;