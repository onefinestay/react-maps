var React = require('react');
var ReactMaps = require('react-maps');

React.renderComponent(
  <ReactMaps.Map />,
  document.getElementById('map')
);

window.React = React;
