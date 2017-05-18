import React from 'react'
import TablePropTypes from './ExperimentDesignTablePropTypes.js'
import {DifferentialExperimentDesign, BaselineExperimentDesign} from './ExperimentDesignTable.jsx'
import URI from 'urijs'

const ExperimentDesignTab = ({
  isDifferential,
  downloadUrl,
  atlasUrl,
  table
}) => (
    <div>
      <div className="row expanded column margin-top-large">
        <a className="button float-right margin-bottom-none" href={URI(downloadUrl, atlasUrl).toString()}>
          <span className="glyphicon glyphicon-download-alt margin-right-medium"/>
          Download
        </a>
      </div>
      <div className="row expanded column margin-top-large">
          {
              isDifferential
                  ? DifferentialExperimentDesign(table)
                  : BaselineExperimentDesign(table)
          }
      </div>
    </div>
)

ExperimentDesignTab.propTypes = {
  isDifferential : React.PropTypes.bool.isRequired,
  downloadUrl: React.PropTypes.string.isRequired,
  atlasUrl: React.PropTypes.string.isRequired,
  table: React.PropTypes.shape(TablePropTypes)
}

export default ExperimentDesignTab;
