import React from 'react'
import ReactDOM from 'react-dom'
import Sidebar from './QuerySelectingSidebar.jsx'
import {toQuery as queryFromQueryObjects, fromConfigAndQuery as queryObjectsFromConfigAndQuery,
  toBaselineRequestPreferences, toDifferentialRequestPreferences} from './CreateQueryObjects.js'
import {InitialColumnGroupPropTypes, QueryPropTypes} from './PropTypes.js'
import {Link, withRouter} from 'react-router'
import {ExpressionAtlasHeatmapHighcharts} from 'expression-atlas-heatmap-highcharts'
import URI from 'urijs'

const Main = React.createClass({
  propTypes : {
    experimentAccession: React.PropTypes.string.isRequired,
    isDifferential: React.PropTypes.bool.isRequired,
    isRnaSeq: React.PropTypes.bool.isRequired,
    atlasHost: React.PropTypes.string.isRequired,
    species: React.PropTypes.string.isRequired,
    groups: React.PropTypes.arrayOf(React.PropTypes.shape(InitialColumnGroupPropTypes)).isRequired,
    genesDistributedByCutoffUrl:React.PropTypes.string.isRequired,
    query: React.PropTypes.shape(QueryPropTypes).isRequired,
    router: React.PropTypes.object.isRequired
  },

  render() {
    const queryObjects = queryObjectsFromConfigAndQuery(this.props, this.props.query)
    return (
      <div className="row">
        <div className="small-3 medium-2 columns" >
          <Sidebar
            isDifferential={this.props.isDifferential}
            geneSuggesterUrlTemplate={`${this.props.atlasHost}/gxa/json/suggestions?query={0}&species=${this.props.species}`}
            genesDistributedByCutoffUrl={this.props.isDifferential? "" : this.props.genesDistributedByCutoffUrl}
            loadingGifUrl={`${this.props.atlasHost}/gxa/resources/images/loading.gif`}
            columnGroups={this.props.groups}
            queryObjects={queryObjects}
            onChangeQueryObjects={ (newQueryObjects) => {
              this.props.router.push(Object.assign({},
                this.props.router.location,
                {query: queryFromQueryObjects(this.props, newQueryObjects)}
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
              isDifferential: this.props.isDifferential,
              sourceURL:
                URI(this.props.atlasHost+"/gxa/json/experiments/"+this.props.experimentAccession)
                .addQuery((this.props.isDifferential
                  ? toDifferentialRequestPreferences
                  : toBaselineRequestPreferences)(queryObjects))
                .toString()
            }} />
        </div>
      </div>
    )
  }
})


export default withRouter(Main);
