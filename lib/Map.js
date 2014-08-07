var React = require('react');

var Map = React.createClass({
  propTypes: {
    center: React.PropTypes.object.isRequired,
    zoom: React.PropTypes.number.isRequired,
  },

  render: function() {
    return (
      <div>Hello world!</div>
    );
  }
});

module.exports = Map;
