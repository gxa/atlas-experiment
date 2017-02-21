import React from 'react'
import ReactDOM from 'react-dom'
import Sidebar from './QuerySelectingSidebar.jsx'
import {FilterPropTypes, queryFromQueryObjects, queryObjectsFromQuery, QueryPropTypes} from './PropTypes.js'
import {Link, withRouter} from 'react-router'
import {determineSelectionFromFilters} from './Filters.js'
import {ExpressionAtlasHeatmapHighcharts} from 'expression-atlas-heatmap-highcharts'
import URI from 'urijs'


const Main = React.createClass({
  propTypes : {
    experimentType: React.PropTypes.string.isRequired,
    atlasHost: React.PropTypes.string.isRequired,
    species: React.PropTypes.string.isRequired,
    groups: React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired,
    query: React.PropTypes.shape(QueryPropTypes).isRequired,
    router: React.PropTypes.object.isRequired
  },

  _isBaseline(){
    return this.props.experimentType.toLowerCase().indexOf('baseline') >-1
  },

  _initialQueryObjects(){
    return {
      filters: this.props.groups,
      cutoff:
        this._isBaseline()
        ? {
          value: 0.5
        }
        : {
          foldChange: 1.0,
          pValue: 0.05
        },
      regulation:
        this._isBaseline()
        ? "OFF"
        : "UP_DOWN"
    }
  },

  render() {
    //TODO make the right url from query
    const x = URI(this.props.atlasHost+"/gxa/fexperiments")
    return (
      <div className="row">
        <div className="small-3 medium-2 columns" >
          <Sidebar
            geneSuggesterUrlTemplate={`${this.props.atlasHost}/gxa/json/suggestions?query={0}&species=${this.props.species}`}
            queryObjects={queryObjectsFromQuery(this._initialQueryObjects(), this.props.query)}
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
              params: 'geneQuery=zinc finger&species=mus%20musculus'
            }} />
        </div>
      </div>
    )
  }
})


export default withRouter(Main);
