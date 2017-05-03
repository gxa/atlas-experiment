import React from 'react';
import ReactDOM from 'react-dom';

import ExperimentContainer from './src/ExperimentContainer.jsx';

exports.render = function(options) {
  ReactDOM.render(
      <ExperimentContainer atlasUrl = {options.atlasUrl || `https://www.ebi.ac.uk/gxa/`}
                           pathToFolderWithBundledResources = {options.pathToFolderWithBundledResources}
                           {...options.content}
      />,
      (typeof options.target === `string`) ? document.getElementById(options.target) : options.target
  );
};
