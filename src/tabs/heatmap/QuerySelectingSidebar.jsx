import React from 'react'
import FiltersInStages from './FiltersInStages.jsx'
import FilterChoiceSummary from './FilterChoiceSummary.jsx'
import Cutoff from './Cutoff.jsx'
import CutoffDistribution from './CutoffDistribution.jsx'
import Regulation from './Regulation.jsx'
import {FilterPropTypes, QueryObjectsPropTypes} from './PropTypes.js'
import {Modal, Button, Glyphicon} from 'react-bootstrap/lib'
import GeneAutocomplete from 'gene-autocomplete'
import Toggle from 'react-bootstrap-toggle'
require('./bootstrap-toggle.min.css')



const OpenerButton = ({
  onClickButton
}) => (
  <Button bsSize="large" onClick={onClickButton}
      style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
    <Glyphicon glyph="equalizer"/>
    <span style={{verticalAlign: `middle`}}> Select </span>
  </Button>
)
OpenerButton.propTypes = {
  onClickButton : React.PropTypes.func.isRequired
}

const ModalWrapper = ({
  title,
  show,
  onCloseModal,
  onClickApply,
  children
}) => (
  <Modal show={show} onHide={onCloseModal} bsSize="large">
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
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
  onClickApply: React.PropTypes.func.isRequired
}



const SidebarAndModal = React.createClass({
  propTypes : {
    geneSuggesterUrlTemplate: React.PropTypes.string.isRequired,
    genesDistributedByCutoffUrl: React.PropTypes.string.isRequired,
    loadingGifUrl: React.PropTypes.string.isRequired,
    queryObjects: React.PropTypes.shape(QueryObjectsPropTypes).isRequired,
    onChangeQueryObjects: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      showModal: "",
      cutoff: this.props.queryObjects.cutoff,
      filters: this.props.queryObjects.filters
    }
  },

  render(){
    const showRegulation = ["UP","DOWN","UP_DOWN"].indexOf(this.props.queryObjects.regulation)>-1
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
          size="l"
          active={this.props.queryObjects.specific}
          onClick={() => {
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {specific: !this.props.queryObjects.specific}))
          }}/>
        {showRegulation &&
          <h4>Regulation</h4>
        }
        {showRegulation &&
          <Regulation
          regulation={this.props.queryObjects.regulation}
          onChangeRegulation={(newRegulation)=>{
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {regulation: newRegulation}))
          }}/>}
        <h4>Cutoff</h4>
        {this.props.genesDistributedByCutoffUrl
          && (
          <div>
            <OpenerButton onClickButton={()=> this.setState({ showModal: "cutoff" })} />
            <ModalWrapper
              title={"Cutoff - distribution of genes"}
              show={this.state.showModal == "cutoff"}
              onCloseModal={()=> this.setState({ showModal: ""})}
              onClickApply={() => {
                this.setState({ showModal: "cutoff"})
                this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {cutoff: newCutoff}))
              }} >

              <CutoffDistribution
                cutoff={this.state.cutoff}
                genesDistributedByCutoffUrl={this.props.genesDistributedByCutoffUrl}
                propagateFilterSelection={(cutoff) => {
                  this.setState({cutoff})
                }}/>

            </ModalWrapper>
          </div>
          )
        }
        <Cutoff
          cutoff={this.props.queryObjects.cutoff}
          onChangeCutoff={(newCutoff) => {
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {cutoff: newCutoff}))
          }}
        />
        <h4>Filters</h4>
        <OpenerButton onClickButton={()=> this.setState({ showModal: "filters" })} />
        <FilterChoiceSummary filters={this.state.filters} />

        <ModalWrapper
          title={"Filters"}
          show={this.state.showModal == "filters"}
          onCloseModal={()=> this.setState({ showModal: ""})}
          onClickApply={() => {
            this.setState({ showModal: "filters"})
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
