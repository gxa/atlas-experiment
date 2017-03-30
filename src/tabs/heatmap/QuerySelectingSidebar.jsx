import React from 'react'
import {Main as HeatmapColumnsChoice, Summary as HeatmapColumnsSummary} from './column-filters/Main.jsx'
import Cutoff from './Cutoff.jsx'
import CutoffDistribution from './CutoffDistribution.jsx'
import Regulation from './Regulation.jsx'
import {ColumnGroupPropTypes, QueryObjectsPropTypes} from './PropTypes.js'
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
      { onClickApply &&
      <Button bsStyle="primary" onClick={onClickApply}
          style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>Apply</Button>
      }

      <Button onClick={onCloseModal}
          style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>Close</Button>
    </Modal.Footer>
  </Modal>
)

ModalWrapper.propTypes = {
  show: React.PropTypes.bool.isRequired,
  onCloseModal: React.PropTypes.func.isRequired,
  onClickApply: React.PropTypes.func
}



const SidebarAndModal = React.createClass({
  propTypes : {
    isDifferential: React.PropTypes.bool.isRequired,
    geneSuggesterUrlTemplate: React.PropTypes.string.isRequired,
    genesDistributedByCutoffUrl: React.PropTypes.string.isRequired,
    loadingGifUrl: React.PropTypes.string.isRequired,
    columnGroups: React.PropTypes.arrayOf(React.PropTypes.shape(ColumnGroupPropTypes)).isRequired,
    queryObjects: React.PropTypes.shape(QueryObjectsPropTypes).isRequired,
    onChangeQueryObjects: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      showModal: "",
      selectedColumnIds: this.props.queryObjects.selectedColumnIds
    }
  },

  render(){
    const showRegulation = ["UP","DOWN","UP_DOWN"].indexOf(this.props.queryObjects.regulation)>-1
    const columnsName = this.props.isDifferential ? "Comparisons" : "Assay Groups"
    return (
      <div>
        <h4>Genes</h4>
        <GeneAutocomplete
          suggesterUrlTemplate={this.props.geneSuggesterUrlTemplate}
          values={this.props.queryObjects.geneQuery}
          onChangeValues={(newValues)=>{
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {geneQuery: newValues}))
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
              onCloseModal={()=> this.setState({ showModal: ""})}>

              <CutoffDistribution
                cutoff={this.props.queryObjects.cutoff}
                onChangeCutoff={(newCutoff) => {
                  this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {cutoff: newCutoff}))
                  this.setState({showModal:""})
                }}
                genesDistributedByCutoffUrl={this.props.genesDistributedByCutoffUrl}/>

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
        <h4>{columnsName}</h4>
        <OpenerButton onClickButton={()=> this.setState({ showModal: "columns" })} />
        <HeatmapColumnsSummary columnGroups={this.props.columnGroups} selectedColumnIds={this.state.selectedColumnIds}/>

        <ModalWrapper
          title={columnsName}
          show={this.state.showModal == "columns"}
          onCloseModal={()=> this.setState({ showModal: ""})}
          onClickApply={() => {
            this.setState({ showModal: ""})
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {selectedColumnIds: this.state.selectedColumnIds}))
          }} >

          <HeatmapColumnsChoice
            columnGroups={this.props.columnGroups}
            selectedColumnIds={this.state.selectedColumnIds}
            onNewSelectedColumnIds={(selectedColumnIds) => {
              this.setState({selectedColumnIds})
            }}/>

        </ModalWrapper>
    </div>
    )
  }
})

export default SidebarAndModal
