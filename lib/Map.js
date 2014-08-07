var React = require('react');
var Tolmey = require('tolmey');

var getTileURL = function(x, y, zoom) {
  return `//api.tiles.mapbox.com/v4/onefinestay.j5p58a57/${ zoom }/${ x }/${ y }@2x.png?access_token=pk.eyJ1Ijoib25lZmluZXN0YXkiLCJhIjoiWlpMeWR3ZyJ9.PljQ7mc2imXG3zrUms-HyQ`;
};

var ZoomControl = React.createClass({
  propTypes: {
    min: React.PropTypes.number.isRequired,
    max: React.PropTypes.number.isRequired
  },

  handleZoomIn: function() {
    this.props.onZoomIn();
  },

  handleZoomOut: function() {
    this.props.onZoomOut();
  },

  render: function() {
    return (
      <div className="react-maps-zoom-control">
        <a onClick={this.handleZoomIn}>In</a>
        <a onClick={this.handleZoomOut}>Out</a>
      </div>
    );
  }
});



var Map = React.createClass({
  propTypes: {
    center: React.PropTypes.object.isRequired,
    zoom: React.PropTypes.number.isRequired,
  },
  
  getInitialState: function() {
    return {
      center: this.props.center,
      zoom: this.props.zoom
    };
  },
  
  handleZoomIn: function() {
    this.setState({zoom: this.state.zoom + 1});
  },
  
  handleZoomOut: function() {
    this.setState({zoom: this.state.zoom - 1});
  },

  render: function() {
    var converter = Tolmey.create();
    var lat = this.state.center.lat;
    var long = this.state.center.lng;
    var zoom = this.state.zoom;

    var coords = converter.getMercatorFromGPS(lat, long, zoom);


    var url = getTileURL(coords.x, coords.y, zoom);
    var url2 = getTileURL(coords.x + 1, coords.y, zoom);
    var url3 = getTileURL(coords.x, coords.y + 1, zoom);
    var url4 = getTileURL(coords.x + 1, coords.y + 1, zoom);

    var imgStyle = {
      width: '256px',
      height: '256px'
    };

    var divStyle = {
      width: '512px',
      height: '512px'
    };


    return (
      <div style={divStyle}>
        <ZoomControl onZoomIn={this.handleZoomIn} onZoomOut={this.handleZoomOut} />
        <img src={url} style={imgStyle} />
        <img src={url2} style={imgStyle} />
        <img src={url3} style={imgStyle} />
        <img src={url4} style={imgStyle} />
      </div>
    );
  }
});

module.exports = Map;
