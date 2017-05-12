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
      <div className="row">
        <div className="small-12 columns margin-top-large">
          <div style={{textAlign:"right"}}>
            <a className="button" style={{margin:"0px"}} href={URI(downloadUrl, atlasUrl).toString()}>
              <span className="glyphicon glyphicon-download-alt" style={{marginRight:"0.5rem"}}/>
              Download
            </a>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="small-12 columns margin-top-large">
            {
                isDifferential
                    ? DifferentialExperimentDesign(table)
                    : BaselineExperimentDesign(table)
            }
        </div>
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
