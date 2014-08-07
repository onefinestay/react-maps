/** @jsx React.DOM */

var constants = require('./constants');

var TILE_DIM = constants.TILE_DIM;

var React = require('react');
var Tolmey = require('tolmey');
var ZoomControl = require('./controls/ZoomControl');
var _ = require('underscore');


var TileCanvas = React.createClass({

  getTileURL: function(x, y, zoom) {
    return `//api.tiles.mapbox.com/v4/onefinestay.j5p58a57/${ zoom }/${ x }/${ y }@2x.png?access_token=pk.eyJ1Ijoib25lZmluZXN0YXkiLCJhIjoiWlpMeWR3ZyJ9.PljQ7mc2imXG3zrUms-HyQ`;
  },

  getCanvasOffset: function(){
    return {
        top: Math.floor((this.props.height - constants.TILE_DIM * this.getCanvasDimension(this.props.height)) / 2),
        left: Math.floor((this.props.width - constants.TILE_DIM * this.getCanvasDimension(this.props.width)) / 2)
      }
  },

  getCanvasDimension: function(lenght){
    var dim = Math.ceil(lenght / constants.TILE_DIM);
    return dim % 2 == 0 ? dim + 1 : dim;
  },

  getTileUrls: function(){
    var dimX = this.getCanvasDimension(this.props.width);
    var dimY = this.getCanvasDimension(this.props.height);
    var centerX = Math.floor(dimX/2);
    var centerY = Math.floor(dimY/2);

    var urls = [];
    var x;
    var y;
    var c = 0

    for (indexY = 0; indexY < dimY; indexY++) {
      for (indexX = 0; indexX < dimX; indexX++) {
        x = this.props.coords.x + indexX - centerX;
        y = this.props.coords.y + indexY - centerY;
        urls.push({
          x: x,
          y: y,
          url: this.getTileURL(x, y, this.props.zoom)
        });

      }
    }
    return urls;
  },

  render: function(){
    var offsets = this.getCanvasOffset();

    var canvasStyle = {
      marginTop: String(offsets.top) + 'px',
      marginLeft: String(offsets.left) + 'px',
      width: String(constants.TILE_DIM * this.getCanvasDimension(this.props.width)) + 'px',
      height: String(constants.TILE_DIM * this.getCanvasDimension(this.props.height)) + 'px'
    };

    var imgStyle = {
      width: String(constants.TILE_DIM) + 'px',
      height: String(constants.TILE_DIM) + 'px'
    };

    var tileUrls = this.getTileUrls();

    var tileImages = _.map(tileUrls, function(tileUrl){
      return <img key={String(tileUrl.x) + '-' + String(tileUrl.y)} src={tileUrl.url} style={imgStyle} />
    })

    return (
      <div className="canvas" style={canvasStyle}>
        {tileImages}
      </div>
    );
  }
});


var Map = React.createClass({
  propTypes: {
    center: React.PropTypes.object.isRequired,
    zoom: React.PropTypes.number.isRequired
  },

  getDefaultProps: function() {
    return {
      minZoom: 0,
      maxZoom: 20
    };
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

    var divHeight = 1000;
    var divWidth = 1000;

    var divStyle = {
      width: String(divWidth) + 'px',
      height: String(divHeight) + 'px',
      overflow: 'hidden'
    };


    return (
      <div>
        <div className="controls">
          <ZoomControl zoom={this.state.zoom} max={this.props.maxZoom} min={this.props.minZoom} onZoomIn={this.handleZoomIn} onZoomOut={this.handleZoomOut} />
        </div>
        <div className="visor" style={divStyle}>
          <TileCanvas width={divWidth} height={divHeight} coords={coords} zoom={zoom} />
        </div>
      </div>
    );
  }
});

module.exports = Map;
