import React from 'react'
import ReactDOM from 'react-dom'
import FiltersInStages from './FiltersInStages.jsx'
import FilterChoiceSummary from './FilterChoiceSummary.jsx'
import {FilterPropTypes, QueryObjectsPropTypes} from './PropTypes.js'
import {Modal, Button, Glyphicon} from 'react-bootstrap/lib'
import GeneAutocomplete from 'gene-autocomplete'
import Toggle from 'react-bootstrap-toggle'




const FiltersButton = ({
  onClickButton
}) => (
  <Button bsSize="large" onClick={onClickButton}
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
  onClickApply: React.PropTypes.func.isRequired,
  nextQueryParamsOnApply: React.PropTypes.shape({
    filterFactors: React.PropTypes.string.isRequired
  }).isRequired
}

const SidebarAndModal = React.createClass({
  propTypes : {
    geneSuggesterUrlTemplate: React.PropTypes.string.isRequired,
    queryObjects: React.PropTypes.shape(QueryObjectsPropTypes).isRequired,
    onChangeQueryObjects: React.PropTypes.func.isRequired
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
        <h4>Gene(s)</h4>
        <GeneAutocomplete
          suggesterUrlTemplate={this.props.geneSuggesterUrlTemplate}
          value={this.props.queryObjects.geneQuery}
          onGeneChosen={(newGeneChosen)=>{
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {geneQuery: newGeneChosen}))
          }}/>
        <h4>Specificity</h4>
        <Toggle
          active={this.props.queryObjects.specific}
          onClick={() => {
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {specific: !this.props.queryObjects.specific}))
          }}
        />

        <h4>Filters</h4>
        <FilterChoiceSummary filters={this.state.filters} />
        <FiltersButton onClickButton={this._openModal} />

        <ModalWrapper
          show={this.state.showModal}
          onCloseModal={()=> this.setState({ showModal: false})}
          onClickApply={() => {
            this.setState({ showModal: false})
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {filters: this.state.filters}))
          }} >

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

export default SidebarAndModal
