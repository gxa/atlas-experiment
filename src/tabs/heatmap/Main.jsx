import React from 'react'
import ReactDOM from 'react-dom'
import FiltersInStages from './FiltersInStages.jsx'
import FilterChoiceSummary from './FilterChoiceSummary.jsx'
import {FilterPropTypes, queryFromQueryObjects, queryObjectsFromQuery, QueryPropTypes} from './PropTypes.js'
import {Modal, Button, Glyphicon} from 'react-bootstrap/lib'
import {Link, withRouter} from 'react-router'
import {determineSelectionFromFilters} from './Filters.js'
import {render as renderHeatmap} from 'expression-atlas-heatmap-highcharts'
import URI from 'urijs'
import GeneAutocomplete from 'gene-autocomplete'

const Main = React.createClass({
  propTypes : {
    atlasHost: React.PropTypes.string.isRequired,
    species: React.PropTypes.string.isRequired,
    groups: React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired,
    query: QueryShape.isRequired,
    router: React.PropTypes.object.isRequired
  },

  _initialQueryObjects(){
    return (
      {filters: this.props.groups}
    )
  },

  render() {
    //TODO make the right url from query
    const x = URI(this.props.atlasHost+"/gxa/fexperiments")

    return (
      <div className="row">
        <div className="small-3 medium-2 columns" >
          <SidebarAndModal
            geneSuggesterUrlTemplate={`${this.props.atlasHost}/gxa/json/suggestions?query={0}&species=${this.props.species}`}
            queryObjects={queryObjectsFromQuery(this._initialQueryObjects(), this.props.query)}
            onChangeQueryObjects={ (newQueryObjects) => {
              this.props.router.push({
                query: queryFromQueryObjects(this._initialQueryObjects(), newQueryObjects)
              })
            }
            }
          />
        </div>
        <div ref="heatmapBody" className="small-9 medium-10 columns"/>
      </div>
    )
  },

  _renderHeatmap(){
    /*
    Not using our widget as a component because it didn't work :(
    There were issues with the highchart being a ref.
    TODO I think it's because of npm link and react not being a peer dependency i.e. easily solvable.
    */
    renderHeatmap({
      atlasBaseURL: this.props.atlasHost,
      isWidget:false,
      params: 'geneQuery=zinc finger&species=mus%20musculus',
      target: ReactDOM.findDOMNode(this.refs.heatmapBody)
    })
  },

  componentDidMount(){
    this._renderHeatmap()
  },

  componentDidUpdate() {
    this._renderHeatmap()
  }
})


export default withRouter(Main);
