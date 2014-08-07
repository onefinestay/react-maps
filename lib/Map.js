var React = require('react');
var Tolmey = require('tolmey');

var getTileURL = function(x, y, zoom) {
  return `http://api.tiles.mapbox.com/v4/onefinestay.j5p58a57/${ zoom }/${ x }/${ y }@2x.png?access_token=pk.eyJ1Ijoib25lZmluZXN0YXkiLCJhIjoiWlpMeWR3ZyJ9.PljQ7mc2imXG3zrUms-HyQ`;
};


var Map = React.createClass({
  propTypes: {
    center: React.PropTypes.object.isRequired,
    zoom: React.PropTypes.number.isRequired,
  },

  render: function() {
    var converter = Tolmey.create();
    var lat = this.props.center.lat;
    var long = this.props.center.lng;
    var zoom = this.props.zoom;

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
        <img src={url} style={imgStyle} />
        <img src={url2} style={imgStyle} />
        <img src={url3} style={imgStyle} />
        <img src={url4} style={imgStyle} />
      </div>
    );
  }
});

module.exports = Map;
