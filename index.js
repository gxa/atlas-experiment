import React from 'react'
import ReactDOM from 'react-dom'

import ExperimentContainer from './src/ExperimentContainer.jsx'


exports.render = function(options){

  ReactDOM.render(
      React.createElement(
          ExperimentContainer,
          Object.assign({atlasHost: options.atlasHost, experimentType: options.experimentType, species: options.species}, options.content || {})
      ),
      (typeof options.target === "string") ? document.getElementById(options.target) : options.target
  );
}
