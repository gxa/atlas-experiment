import React from 'react'
import FiltersInStages from './FiltersInStages.jsx'
import {FilterPropTypes} from './PropTypes.js'
import { addUrlProps, UrlQueryParamTypes, UrlUpdateTypes, subquery} from 'react-url-query'
import {isEqual} from 'lodash'
import {Modal, Button, Glyphicon} from 'react-bootstrap/lib'
import { Link} from 'react-router'


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
  onClickApply,
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
      <Button bsStyle="primary" onClick={onClickApply}
          style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>Apply</Button>
      <Button onClick={onCloseModal}
          style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>Close</Button>
    </Modal.Footer>
  </Modal>
)

ModalWrapper.propTypes = {
  show: React.PropTypes.bool.isRequired,
  onCloseModal: React.PropTypes.func.isRequired,
  onClickApply : React.PropTypes.func.isRequired
}


const overlayFilterFactorsObjectOnFilters = (filters, filterFactors) => {
  const filterFactorsCopy = {}
  Object.keys(filterFactors)
  .forEach((key) => {
    filterFactors[key.toUpperCase()] = this.props.filterFactors[key]
  })
  return (
    filters
    .map((_filter) => Object.assign({}, _filter, {
      selected:
        filterFactorsCopy[_filter.name.toUpperCase()] || "all"
    }))
  )
}

const urlPropsQueryConfig = {
  filterFactors: { type: UrlQueryParamTypes.object , updateType: UrlUpdateTypes.pushIn }
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

const Heatmap = React.createClass({
  propTypes: {
    groups: React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired,
    filterFactors: React.PropTypes.object.isRequired,
    onChangeFilterFactors: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      filterFactors:{}
    }
  },
  getInitialState() {
    return {
      showModal:
        false,
      filters:
        overlayFilterFactorsObjectOnFilters(this.props.groups, this.props.filterFactors)
    }
  },


  _apply() {
    this.props.onClickApply()
    this.setState({ showModal: false })
  },

  _openModal() {
    this.setState({ showModal: true })
  },

  render() {
    return (
      <div>
      <h2> I am a heatmap </h2>
      <div style={{width:"50%", backgroundColor: "fuchsia"}}>>
        <FiltersButton onClickButton={this._openModal} />

        <ModalWrapper
          show={this.state.showModal}
          onCloseModal={()=> this.setState({ showModal: false})}
          onClickApply={()=> {
            this.setState({ showModal: false})
            this.props.onChangeFilterFactors(makeFilterFactorsObject(this.props.groups,this.state.filters))
          }} >
          <FiltersInStages
            filters={this.state.filters}
            propagateFilterSelection={(filters) => {
              this.setState({filters})
            }}/>

        </ModalWrapper>

      </div>

      <div style={{width:"50%", backgroundColor: "gainsboro"}}>
        Heatmap goes here
        Heatmap goes here
        Heatmap goes here
        Heatmap goes here
        Heatmap goes here
        Heatmap goes here
      </div>
      </div>
    )
  }
})

export default addUrlProps({urlPropsQueryConfig})(Heatmap);
