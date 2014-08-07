var React = require('react');
var Tolmey = require('tolmey');
var _ = require('underscore');

const TILE_DIM = 256;

var getTileURL = function(x, y, zoom) {
  return `//api.tiles.mapbox.com/v4/onefinestay.j5p58a57/${ zoom }/${ x }/${ y }@2x.png?access_token=pk.eyJ1Ijoib25lZmluZXN0YXkiLCJhIjoiWlpMeWR3ZyJ9.PljQ7mc2imXG3zrUms-HyQ`;
};

var getContainerOffset = function(width, height){
  return {
    top: Math.floor((height - TILE_DIM * 3) / 2), // the canvas is 3x3 tiles
    left: Math.floor((width - TILE_DIM * 3) / 2)
  }
}

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
    zoom: React.PropTypes.number.isRequired
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

    var urls = [
      getTileURL(coords.x - 1, coords.y - 1, zoom),   // NW
      getTileURL(coords.x, coords.y - 1, zoom),       // N
      getTileURL(coords.x + 1, coords.y - 1, zoom),   // NE
      getTileURL(coords.x - 1, coords.y, zoom),       // W
      getTileURL(coords.x, coords.y, zoom),           // CENTER
      getTileURL(coords.x + 1, coords.y, zoom),       // E
      getTileURL(coords.x - 1, coords.y + 1, zoom),   // SW
      getTileURL(coords.x, coords.y + 1, zoom),       // S
      getTileURL(coords.x + 1, coords.y + 1, zoom)    // SE
    ];

    var imgStyle = {
      width: String(TILE_DIM) + 'px',
      height: String(TILE_DIM) + 'px'
    };
    var tileImages = _.map(urls, function(url){
      return <img src={url} style={imgStyle} />
    })

    var divHeight = 300;
    var divWidth = 500;


    var offsets = getContainerOffset(divWidth, divHeight);

    var divStyle = {
      width: String(divWidth) + 'px',
      height: String(divHeight) + 'px',
      overflow: 'hidden'
    };

    var canvasStyle = {
      marginTop: String(offsets.top) + 'px',
      marginLeft: String(offsets.left) + 'px',
      width: String(TILE_DIM * 3) + 'px',
      height: String(TILE_DIM * 3) + 'px'
    };

    return (
      <div>
        <div className="controls">
          <ZoomControl onZoomIn={this.handleZoomIn} onZoomOut={this.handleZoomOut} />
        </div>
        <div className="visor" style={divStyle}>
          <div className="canvas" style={canvasStyle}>
            {tileImages}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Map;
