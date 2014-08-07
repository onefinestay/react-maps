/** @jsx React.DOM */

var React = require('react');
var ReactMaps = require('react-maps');

var position = {
  lat: 51.5623900,
  lng: -0.1409180
};

React.renderComponent(
  <ReactMaps.Map center={position} zoom={12} />,
  document.getElementById('map')
);



window.React = React;
