/** @jsx React.DOM */

var React = require('react');

var ZoomControl = React.createClass({
  propTypes: {
    zoom: React.PropTypes.number.isRequired,
    min: React.PropTypes.number.isRequired,
    max: React.PropTypes.number.isRequired
  },

  handleZoomIn: function() {
    if (this.props.zoom < this.props.max) {
      this.props.onZoomIn();
    }
  },

  handleZoomOut: function() {
    if (this.props.zoom > this.props.min) {
      this.props.onZoomOut();
    }
  },

  render: function() {
    return (
      <div className="react-maps-zoom-control">
        <a onClick={this.handleZoomIn}>In</a>
        {this.props.zoom}
        <a onClick={this.handleZoomOut}>Out</a>
      </div>
    );
  }
});

module.exports = ZoomControl;
