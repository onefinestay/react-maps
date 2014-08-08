/** @jsx React.DOM */

var constants = require('./constants');
var SphericalMercator = require('sphericalmercator');

var TILE_DIM = constants.TILE_DIM;

var ImageLoader = require('react-imageloader');
var React = require('react');
var Tolmey = require('tolmey');
var ZoomControl = require('./controls/ZoomControl');
var _ = require('underscore');

var mercator = new SphericalMercator({
    size: TILE_DIM
});


var TilePlaceholder = React.createClass({
  render: function() {
    var style = {
      display: 'inline-block',
      'vertical-align': 'bottom',
      'background-color': '#ccc',
      width: String(constants.TILE_DIM) + 'px',
      height: String(constants.TILE_DIM) + 'px'
    };
    return <div style={style} />;
  },
});

var MissingTile = React.createClass({
  render: function() {
    var style = {
      display: 'inline-block',
      'vertical-align': 'bottom',
      'background-color': '#ccc',
      color: '#222',
      'font-size': '12px',
      width: String(constants.TILE_DIM) + 'px',
      height: String(constants.TILE_DIM) + 'px'
    };
    return (
      <div style={style}>
        Tile couldn't be found at this zoom level;
      </div>
    );
  },
});


var MapCanvas = React.createClass({

  getTileURL: function(x, y, zoom) {
    return `//api.tiles.mapbox.com/v4/onefinestay.j5p58a57/${ zoom }/${ x }/${ y }@2x.png?access_token=pk.eyJ1Ijoib25lZmluZXN0YXkiLCJhIjoiWlpMeWR3ZyJ9.PljQ7mc2imXG3zrUms-HyQ`;
  },

  getCanvasOffset: function(){
    return {
        top: Math.floor((this.props.height - constants.TILE_DIM * this.getCanvasDimension(this.props.height)) / 2),
        left: Math.floor((this.props.width - constants.TILE_DIM * this.getCanvasDimension(this.props.width)) / 2)
      }
  },

  getCanvasDimension: function(length){
    var dim = Math.ceil(length / constants.TILE_DIM);
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

    var offsetX = offsets.left + this.props.offsetX;
    var offsetY = offsets.top + this.props.offsetY;

    var canvasStyle = {
      marginTop: offsetY + 'px',
      marginLeft: offsetX + 'px',
      width: String(constants.TILE_DIM * this.getCanvasDimension(this.props.width)) + 'px',
      height: String(constants.TILE_DIM * this.getCanvasDimension(this.props.height)) + 'px',
      cursor: this.props.dragging ? '-webkit-grabbing' : '-webkit-grab',
    };

    var imgStyle = {
      width: String(constants.TILE_DIM) + 'px',
      height: String(constants.TILE_DIM) + 'px'
    };

    var tileUrls = this.getTileUrls();
    var zoom = this.props.zoom;

    var tileImages = _.map(tileUrls, function(tileUrl){
      var key = `${ zoom }-${ tileUrl.x}-${ tileUrl.y}`;

      return (
        <ImageLoader
          key={key}
          src={tileUrl.url}
          draggable="false"
          preloader={TilePlaceholder}
          style={imgStyle}>
          <MissingTile />
        </ImageLoader>
      );
    })

    return (
      <div
        className="canvas"
        style={canvasStyle}
        onContextMenu={this.props.onContextMenu}
        onMouseLeave={this.props.onMouseLeave}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onMouseMove={this.props.onMouseMove}>
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
      dragging: false,
      center: this.props.center,
      zoom: this.props.zoom,
      viewportHeight: 1000,
      viewportWidth: 1000
    };
  },

  handleZoomIn: function() {
    if (this.state.zoom < this.props.maxZoom){
      this.setState({zoom: this.state.zoom + 1});
    }
  },

  handleZoomOut: function() {
    if (this.state.zoom > this.props.minZoom){
      this.setState({zoom: this.state.zoom - 1});
    }
  },

  handleMouseLeave: function(event) {
    this.setState({
      dragging: false
    });
  },

  handleMouseDown: function(event) {
    this.setState({
      dragging: true,
      prevX: event.clientX,
      prevY: event.clientY
    });
  },

  handleMouseUp: function(event) {
    if (this.state.dragging) {
      var tick = new Date().getTime();
      var nextX = event.clientX;
      var nextY = event.clientY;
      var prevX = this.state.prevX;
      var prevY = this.state.prevY;

      var dX = this.state.lastDX;
      var dY = this.state.lastDY
      var dT = tick - this.state.prevTick;

      var vX = dX / dT;
      var vY = dY / dT;

      this.setState({
        velocity: {x: vX||0, y:vY||0},
        prevInertiaTick: new Date().getTime(),
        inertiaTimer: setInterval(this.inertiaStep, 4),
        dragging: false,
        lastDX: null,
        lastDY: null,
        prevTick: null,
        prevX: null,
        prevY: null
      });
    }
  },

  inertiaStep: function() {
    if (!this.state.velocity) {
      this.inertiaStop();
      return;
    }

    var vX = this.state.velocity.x;
    var vY = this.state.velocity.y;
    var time = new Date().getTime();

    var isDone = (Math.abs(vX) + Math.abs(vY)) < 0.001;

    if (isDone) {
      this.inertiaStop();
      return;
    }

    var multiplier = 1 - 0.2;

    vX *= multiplier;
    vY *= multiplier;

    var interval = time - this.state.prevInertiaTick;

    var dX = vX * interval;
    var dY = vY * interval;

    var currentCoords = this.getPixelCenter();
    var newCoords = [currentCoords[0] + dY, currentCoords[1] + dX];
    var newCenter = mercator.ll(newCoords, this.state.zoom);

    this.setState({
      velocity: {x: vX, y: vY},
      prevInertiaTick: time,
      center: {lat: newCenter[0], lng: newCenter[1]}
    });
  },

  inertiaStop: function() {
    clearInterval(this.state.inertiaTimer);
    this.setState({
      velocity: null,
      inertiaTimer: null,
      prevInertiaTick: null
    });
  },

  handleMouseMove: function(event) {
    if (this.state.dragging) {
      var nextX = event.clientX;
      var nextY = event.clientY;
      var prevX = this.state.prevX;
      var prevY = this.state.prevY;

      var dX = nextX - prevX;
      var dY = nextY - prevY;

      var currentCoords = this.getPixelCenter();
      var newCoords = [currentCoords[0] + dY, currentCoords[1] + dX];
      var newCenter = mercator.ll(newCoords, this.state.zoom);

      this.setState({
        center: {lat: newCenter[0], lng: newCenter[1]},
        prevTick: new Date().getTime(),
        lastDX: dX,
        lastDY: dY,
        prevX: nextX,
        prevY: nextY
      });
    }
  },

  handleContextMenu: function(event) {
    event.preventDefault();
  },

  handleOnWheel: function(event){
    var nextX = event.clientX;
    var nextY = event.clientY;
    var prevX = this.refs.viewport.getDOMNode().offsetLeft + Math.floor(this.state.viewportWidth / 2);
    var prevY = this.refs.viewport.getDOMNode().offsetTop + Math.floor(this.state.viewportHeight / 2);

    var dX = nextX - prevX;
    var dY = nextY - prevY;

    console.log(dY, dX);

    var currentCoords = this.getPixelCenter();
    console.log(currentCoords);

    var newCoords = [currentCoords[0] - dY, currentCoords[1] - dX];
    console.log(newCoords);
    var newCenter = mercator.ll(newCoords, this.state.zoom);

    if (event.deltaY < 0 ){
      if (this.state.zoom < this.props.maxZoom){
        this.setState({
          zoom: this.state.zoom + 1,
          center: {lat: newCenter[0], lng: newCenter[1]},
        });
      }
    } else {
      if (this.state.zoom > this.props.minZoom){
        this.setState({
          zoom: this.state.zoom - 1,
          center: {lat: newCenter[0], lng: newCenter[1]},
        });
      }
    }
  },

  getPixelCenter: function() {
    return mercator.px([this.state.center.lat, this.state.center.lng], this.state.zoom);
  },

  render: function() {
    var converter = Tolmey.create();
    var lat = this.state.center.lat;
    var long = this.state.center.lng;
    var zoom = this.state.zoom;
    var coords = converter.getMercatorFromGPS(lat, long, zoom);

    var tileBounds = mercator.bbox(coords.x, coords.y, zoom);

    var NW = mercator.px([tileBounds[0], tileBounds[1]], zoom);
    var SE = mercator.px([tileBounds[2], tileBounds[3]], zoom);

    var tileCenter = [(NW[0] + SE[0]) / 2, (NW[1] + SE[1]) / 2];
    var center = mercator.px([long, lat], zoom);

    var offsetX = tileCenter[0] - center[0];
    var offsetY = tileCenter[1] - center[1];

    var divHeight = this.state.viewportHeight;
    var divWidth = this.state.viewportWidth;

    var divStyle = {
      width: String(divWidth) + 'px',
      height: String(divHeight) + 'px',
      overflow: 'hidden'
    };

    return (
      <div>
        <div className="controls">
          <ZoomControl
            zoom={this.state.zoom}
            max={this.props.maxZoom}
            min={this.props.minZoom}
            onZoomIn={this.handleZoomIn}
            onZoomOut={this.handleZoomOut} />
        </div>
        <div className="visor" style={divStyle} ref="viewport" onWheel={this.handleOnWheel}>
          <MapCanvas
            dragging={this.state.dragging}
            width={divWidth}
            height={divHeight}
            coords={coords}
            zoom={zoom}
            offsetX={offsetX}
            offsetY={offsetY}
            onContextMenu={this.handleContextMenu}
            onMouseLeave={this.handleMouseLeave}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseMove={this.handleMouseMove} />
        </div>
      </div>
    );
  }
});

module.exports = Map;
