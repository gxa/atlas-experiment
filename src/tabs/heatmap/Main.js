import React from 'react'
import PropTypes from 'prop-types'

import Sidebar from './QuerySelectingSidebar.js'
import {toQuery as queryFromQueryObjects, fromConfigAndQuery as queryObjectsFromConfigAndQuery,
  toBaselineRequestPreferences, toDifferentialRequestPreferences} from './CreateQueryObjects.js'
import {InitialColumnGroupPropTypes, QueryPropTypes} from './PropTypes.js'
import {withRouter} from 'react-router-dom'
import ExpressionAtlasHeatmap from 'expression-atlas-heatmap-highcharts'
import URI from 'urijs'
import queryStringUtils from 'qs'


const Main = React.createClass({
  propTypes : {
    experimentAccession: PropTypes.string.isRequired,
    accessKey: PropTypes.string,
    isDifferential: PropTypes.bool.isRequired,
    isRnaSeq: PropTypes.bool.isRequired,
    atlasUrl: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(PropTypes.shape(InitialColumnGroupPropTypes)).isRequired,
    genesDistributedByCutoffUrl:PropTypes.string.isRequired,
    availableDataUnits:PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    query: PropTypes.shape(QueryPropTypes).isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
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
              useEbiFramework={false}
            />
        </div>
      </div>
    )
  }
})


export default withRouter(Main);
