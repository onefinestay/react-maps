var React = require('react');
var ReactMaps = require('react-maps');

var position = {
  lat: 51.5623900,
  lng: -0.1409180
};

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    React.renderComponent(
      <ReactMaps.Map center={center} zoom={12} />,
      document.getElementById('map')
    );

  });
} else {
  React.renderComponent(
    <ReactMaps.Map center={position} zoom={12} />,
    document.getElementById('map')
  );
}



window.React = React;
