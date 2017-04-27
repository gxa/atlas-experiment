import React from 'react'
import Sidebar from './QuerySelectingSidebar.jsx'
import {toQuery as queryFromQueryObjects, fromConfigAndQuery as queryObjectsFromConfigAndQuery,
  toBaselineRequestPreferences, toDifferentialRequestPreferences} from './CreateQueryObjects.js'
import {InitialColumnGroupPropTypes, QueryPropTypes} from './PropTypes.js'
import {withRouter} from 'react-router-dom'
import {ExpressionAtlasHeatmap} from 'expression-atlas-heatmap-highcharts'
import URI from 'urijs'
import queryStringUtils from 'qs'


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
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired
  },

  render() {
    const queryObjects = queryObjectsFromConfigAndQuery(this.props, this.props.query)
    return (
      <div className="row expanded">
        <div className="small-3 medium-2 columns" >
          <Sidebar
            isDifferential={this.props.isDifferential}
            geneSuggesterUrlTemplate={`${this.props.atlasHost}/gxa/json/suggestions?query={0}&species=${this.props.species}`}
            genesDistributedByCutoffUrl={this.props.isDifferential? "" : this.props.genesDistributedByCutoffUrl}
            loadingGifUrl={`${this.props.atlasHost}/gxa/resources/images/loading.gif`}
            columnGroups={this.props.groups}
            queryObjects={queryObjects}
            onChangeQueryObjects={ (newQueryObjects) => {
              this.props.history.push(Object.assign({},
                this.props.location,
                {search: queryStringUtils.stringify(queryFromQueryObjects(this.props, newQueryObjects))}
              ))
            }
            }
          />
        </div>
        <div className="small-9 medium-10 columns">
          <ExpressionAtlasHeatmap
              atlasUrl={this.props.atlasHost+"/gxa/"}
              isWidget={false}
              isMultiExperiment={false}
              isDifferential={this.props.isDifferential}
              query={
                URI("json/experiments/"+this.props.experimentAccession)
                .addQuery((this.props.isDifferential
                  ? toDifferentialRequestPreferences
                  : toBaselineRequestPreferences)(queryObjects))
                .toString()}
            />
        </div>
      </div>
    )
  }
})


export default withRouter(Main);
