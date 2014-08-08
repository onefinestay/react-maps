/** @jsx React.DOM */

var React = require('react');
var ReactMaps = require('react-maps');

var position = {
  lat: 51.5067021,
  lng: -0.1735015
};

var marker = <ReactMaps.Marker position={position} />;
var markers = [marker];

React.renderComponent(
  <ReactMaps.Map center={position} zoom={12} markers={markers} />,
  document.getElementById('map')
);



window.React = React;
