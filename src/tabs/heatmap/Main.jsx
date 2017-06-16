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
    accessKey: React.PropTypes.string,
    isDifferential: React.PropTypes.bool.isRequired,
    isRnaSeq: React.PropTypes.bool.isRequired,
    atlasUrl: React.PropTypes.string.isRequired,
    species: React.PropTypes.string.isRequired,
    groups: React.PropTypes.arrayOf(React.PropTypes.shape(InitialColumnGroupPropTypes)).isRequired,
    genesDistributedByCutoffUrl:React.PropTypes.string.isRequired,
    availableDataUnits:React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
    query: React.PropTypes.shape(QueryPropTypes).isRequired,
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired
  },

  render() {
    const queryObjects = queryObjectsFromConfigAndQuery(this.props, this.props.query)
    return (
      <div className="row expanded column margin-top-large">
        <div className="small-3 medium-2 columns padding-left-none" >
          <Sidebar
            isDifferential={this.props.isDifferential}
            geneSuggesterUri={URI(`json/suggestions`, this.props.atlasUrl).addSearch(this.props.species ? {species: this.props.species} : {})}
            genesDistributedByCutoffUrl={
              this.props.isDifferential ? "" :
              URI(this.props.genesDistributedByCutoffUrl, this.props.atlasUrl).addSearch(this.props.isRnaSeq ? {unit: queryObjects.unit} : {}).toString()}
            loadingGifUrl={URI(`resources/images/loading.gif`, this.props.atlasUrl).toString()}
            columnGroups={this.props.groups}
            defaultQuery={Object.keys(this.props.query).length === 0}
            availableDataUnits={this.props.availableDataUnits}
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
        <div className="small-9 medium-10 columns padding-right-none">
          <ExpressionAtlasHeatmap
              atlasUrl={this.props.atlasUrl}
              isWidget={false}
              isMultiExperiment={false}
              isDifferential={this.props.isDifferential}
              query={
                URI(`json/experiments/${this.props.experimentAccession}`)
                  .addSearch(this.props.accessKey ? {accessKey: this.props.accessKey} : {})
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
