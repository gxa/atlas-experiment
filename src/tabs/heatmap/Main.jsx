import React from 'react'
import ReactDOM from 'react-dom'
import Sidebar from './QuerySelectingSidebar.jsx'
import {FilterPropTypes, queryFromQueryObjects, queryObjectsFromQuery, QueryPropTypes} from './PropTypes.js'
import {Link, withRouter} from 'react-router'
import {determineSelectionFromFilters} from './Filters.js'
import {ExpressionAtlasHeatmapHighcharts} from 'expression-atlas-heatmap-highcharts'
import URI from 'urijs'

// should be in sync with backend - see ExperimentPageRequestPreferencesPropertyNamesTest.java
const heatmapCallbackParametersFromQueryObjects = ({
  specific,
  geneQuery,
  filters,
  cutoff,
  regulation
}, isDifferential) => Object.assign(
  {
    specific,
    geneQuery,
    selectedColumnIds: determineSelectionFromFilters(filters)
  },
  isDifferential && regulation!=="OFF"
  ? {regulation} : {},
  isDifferential
    ? {
      cutoff: cutoff.pValue,
      foldChangeCutoff: cutoff.foldChange
    }
    : {
      cutoff: cutoff.value
    }
)

const Main = React.createClass({
  propTypes : {
    experimentAccession: React.PropTypes.string.isRequired,
    experimentType: React.PropTypes.string.isRequired,
    atlasHost: React.PropTypes.string.isRequired,
    species: React.PropTypes.string.isRequired,
    groups: React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired,
    query: React.PropTypes.shape(QueryPropTypes).isRequired,
    router: React.PropTypes.object.isRequired
  },

  isDifferential(){
    return this.props.experimentType.toLowerCase().indexOf('differential') >-1
  },

  _initialQueryObjects(){
    return {
      filters: this.props.groups,
      cutoff:
        this.isDifferential()
        ? {
          foldChange: 1.0,
          pValue: 0.05
        }
        : {
          value: 0.5
        }
      ,
      regulation:
        this.isDifferential()
        ? "UP_DOWN"
        : "OFF"
    }
  },

  render() {
    const queryObjects = queryObjectsFromQuery(this._initialQueryObjects(), this.props.query)
    return (
      <div className="row">
        <div className="small-3 medium-2 columns" >
          <Sidebar
            geneSuggesterUrlTemplate={`${this.props.atlasHost}/gxa/json/suggestions?query={0}&species=${this.props.species}`}
            queryObjects={queryObjects}
            onChangeQueryObjects={ (newQueryObjects) => {
              this.props.router.push(Object.assign({},
                this.props.router.location,
                {query: queryFromQueryObjects(this._initialQueryObjects(), newQueryObjects)}
              ))
            }
            }
          />
        </div>
        <div className="small-9 medium-10 columns">
          <ExpressionAtlasHeatmapHighcharts
            options={{
              atlasBaseURL: this.props.atlasHost,
              isWidget:false,
              isMultiExperiment:false,
              isDifferential: this.isDifferential(),
              sourceURL:
                URI(this.props.atlasHost+"/gxa/json/experiments/"+this.props.experimentAccession)
                .addQuery(heatmapCallbackParametersFromQueryObjects(queryObjects, this.isDifferential()))
                .toString()
            }} />
        </div>
      </div>
    )
  }
})


export default withRouter(Main);
