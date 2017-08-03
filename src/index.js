import React from 'react'
import ReactDOM from 'react-dom'

import ExperimentContainer from './ExperimentContainer.js'

const render = (options) => {
  ReactDOM.render(
      <ExperimentContainer atlasUrl = {options.atlasUrl || `https://www.ebi.ac.uk/gxa/`}
                           pathToResources = {options.pathToResources}
                           {...options.content}
      />,
      (typeof options.target === `string`) ? document.getElementById(options.target) : options.target
  )
}

export {render}
