import React from 'react'
import TablePropTypes from './ExperimentDesignTablePropTypes.js'
import {DifferentialExperimentDesign, BaselineExperimentDesign} from './ExperimentDesignTable.jsx'

const ExperimentDesignTab = ({
  isDifferential,
  downloadUrl,
  table
}) => (
  <div>
  <a href={downloadUrl} style={{padding:"10px"}} >
    Download
  </a>
  {
    isDifferential
    ? DifferentialExperimentDesign(table)
    : BaselineExperimentDesign(table)
  }
  </div>
)

ExperimentDesignTab.propTypes = {
  isDifferential : React.PropTypes.bool.isRequired,
  downloadUrl: React.PropTypes.string.isRequired,
  table: React.PropTypes.shape(TablePropTypes)
}

export default ExperimentDesignTab;
