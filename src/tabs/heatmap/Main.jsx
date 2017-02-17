import React from 'react'
import ReactDOM from 'react-dom'
import FiltersInStages from './FiltersInStages.jsx'
import {FilterPropTypes} from './PropTypes.js'
import {isEqual} from 'lodash'
import {Modal, Button, Glyphicon} from 'react-bootstrap/lib'
import { Link} from 'react-router'
import {determineSelectionFromFilters} from './Filters.js'
import {render as renderHeatmap} from 'expression-atlas-heatmap-highcharts'
import URI from 'urijs'



const FiltersButton = ({
  onClickButton
}) => (
  <Button bsSize="small" onClick={onClickButton}
      style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
    <Glyphicon glyph="equalizer"/>
    <span style={{verticalAlign: `middle`}}> Filters</span>
  </Button>
)
FiltersButton.propTypes = {
  onClickButton : React.PropTypes.func.isRequired
}

const ModalWrapper = ({
  show,
  onCloseModal,
  nextQueryParamsOnApply,
  children
}) => (
  <Modal show={show} onHide={onCloseModal} bsSize="large">
    <Modal.Header closeButton>
      <Modal.Title>Filters</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    {
      children
    }
    </Modal.Body>
    <Modal.Footer>
      <Link to={{query: nextQueryParamsOnApply}}>
      <Button bsStyle="primary" onClick={onCloseModal}
          style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>Apply</Button>

      </Link>
      <Button onClick={onCloseModal}
          style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>Close</Button>
    </Modal.Footer>
  </Modal>
)

ModalWrapper.propTypes = {
  show: React.PropTypes.bool.isRequired,
  onCloseModal: React.PropTypes.func.isRequired,
  nextQueryParamsOnApply: React.PropTypes.shape({
    filterFactors: React.PropTypes.string.isRequired
  }).isRequired
}

const overlayFilterFactorsObjectOnFilters = (filters, filterFactors) => {
  const filterFactorsCopy = {}
  Object.keys(filterFactors)
  .forEach((key) => {
    filterFactorsCopy[key.toUpperCase()] = filterFactors[key]
  })
  return (
    filters
    .map((_filter) => Object.assign({}, _filter, {
      selected:
        filterFactorsCopy[_filter.name.toUpperCase()] || "all"
    }))
  )
}

const makeFilterFactorsObject = (filtersInitially, filters) => {
  const filterFactors = {}

  filtersInitially
  .forEach((f)=> {
    const newF = filters.find((_f)=>_f.name === f.name) || Object.assign({},f)
    if(!isEqual(new Set(f.selected), new Set(newF.selected))){
      filterFactors[newF.name] = newF.selected
    }
  })

  return filterFactors
}

const prettyName = (name) => (
  name
  .toLowerCase()
  .replace(/_/g," ")
  .replace(/\w\S*/, (txt) => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
)

const FilterChoiceSummary = ({filters}) => (
  <div>
    {filters
      .map((_filter)=>(
      <div key={_filter.name}>
        <h5>
          {prettyName(_filter.name)}
        </h5>
          {["all","ALL"].indexOf(_filter.selected)>-1
          ? <ul> ALL </ul>
          : <ul>
            {
              _filter.selected.map((selected) => (
                <li key={selected}>
                {selected}
                </li>
              ))
            }
            </ul>
          }
      </div>
    ))}
  </div>
)

FilterChoiceSummary.propTypes = {
  filters: React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired
}

const SidebarAndModal = React.createClass({
  propTypes : {
    filters: React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired
  },

  getInitialState() {
    return {
      showModal: false,
      filters: this.props.filters
    }
  },

  _openModal() {
    this.setState({ showModal: true })
  },

  render(){
    return (
      <div>
        <FilterChoiceSummary filters={this.state.filters} />
        <FiltersButton onClickButton={this._openModal} />

        <ModalWrapper
          show={this.state.showModal}
          onCloseModal={()=> this.setState({ showModal: false})}
          nextQueryParamsOnApply={{filterFactors: encodeURIComponent(JSON.stringify(makeFilterFactorsObject(this.props.filters,this.state.filters)))} } >

          <FiltersInStages
            filters={this.state.filters}
            propagateFilterSelection={(filters) => {
              this.setState({filters})
            }}/>

        </ModalWrapper>
    </div>
    )
  }
})


const Main = React.createClass({
  propTypes : {
    atlasHost: React.PropTypes.string.isRequired,
    groups: React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired,
    query: React.PropTypes.shape({
      //TODO all in one object maybe?
      filterFactors : React.PropTypes.string
    }).isRequired
  },

  _getFilters() {
    return (
      overlayFilterFactorsObjectOnFilters(
        this.props.groups,
        JSON.parse(decodeURIComponent(this.props.query.filterFactors || "{}"))
      )
    )
  },

  render() {
    const x = URI(this.props.atlasHost+"/gxa/fexperiments")

    return (
      <div className="row">
      <div className="small-3 medium-2 columns" >
      <SidebarAndModal
        filters={this._getFilters()}
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


export default Main;
