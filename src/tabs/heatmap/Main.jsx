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
    atlasUrl: React.PropTypes.string.isRequired,
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
            geneSuggesterUrlTemplate={URI(`json/suggestions`, this.props.atlasUrl).search({query: `{0}`, species: this.props.species}).toString()}
            genesDistributedByCutoffUrl={this.props.isDifferential? "" : this.props.genesDistributedByCutoffUrl}
            loadingGifUrl={URI(`resources/images/loading.gif`, this.props.atlasUrl).toString()}
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
              atlasUrl={this.props.atlasUrl}
              isWidget={false}
              isMultiExperiment={false}
              isDifferential={this.props.isDifferential}
              query={
                URI("json/experiments/"+this.props.experimentAccession)
                .addSearch((this.props.isDifferential
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
