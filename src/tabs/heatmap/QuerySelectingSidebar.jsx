import React from 'react'
import {Main as HeatmapColumnsChoice, Summary as HeatmapColumnsSummary} from './column-filters/Main.jsx'
import Cutoff from './Cutoff.jsx'
import CutoffDistribution from './CutoffDistribution.jsx'
import Regulation from './Regulation.jsx'
import Specificity from './Specificity.jsx'
import {ColumnGroupPropTypes, QueryObjectsPropTypes} from './PropTypes.js'
import {Modal, Button, Glyphicon} from 'react-bootstrap/lib'
import GeneAutocomplete from 'gene-autocomplete'
import {intersection, union, isEqual} from 'lodash'
import pluralize from 'pluralize'
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

const determineAvailableColumns = (columnGroups) => (
  intersection.apply([],
    columnGroups.map((group) => (
      union.apply([],
        group.groupings
        .map((g)=> g[1])
      )
    ))
  )
)

const determineColumnNameFromFirstGroup = (availableColumnIds, group) => {
  const prettyName = (name) => (
    name
    .replace(/_/g," ")
    .toLowerCase()
    .replace(/\w\S*/, (txt) => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
  )
  const groupingValues = group.groupings.map((g)=> g[1])
  if (isEqual(
    new Set(availableColumnIds),
    new Set([].concat.apply([], groupingValues))
  ) && groupingValues.every((ids)=> ids.length == 1)){
    return pluralize(prettyName(group.name))
  } else {
    return ""
  }
}

const Header = ({text}) => (
    <h4>
      {text}
    </h4>
)

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
    const availableColumnIds = determineAvailableColumns(this.props.columnGroups)
    const columnsName =
      this.props.isDifferential
      ? "Comparisons"
      : determineColumnNameFromFirstGroup(availableColumnIds, this.props.columnGroups[0])
        || "Sample properties"

    return (
      <div>
        <Header text="Genes"/>
        <GeneAutocomplete
          suggesterUrlTemplate={this.props.geneSuggesterUrlTemplate}
          values={this.props.queryObjects.geneQuery.map(({value})=>value)}
          onChangeValues={(newValues)=>{
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects,
              {geneQuery: newValues.map((value)=> ({value}))}))
          }}/>
        <Specificity
          specific={this.props.queryObjects.specific}
          onChangeSpecific={(specific)=>{
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {specific}))
          }} />
        {showRegulation &&
          <Regulation
          regulation={this.props.queryObjects.regulation}
          onChangeRegulation={(regulation)=>{
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {regulation}))
          }}/>}
        <Cutoff
          cutoff={this.props.queryObjects.cutoff}
          onChangeCutoff={(cutoff) => {
            this.props.onChangeQueryObjects(Object.assign({}, this.props.queryObjects, {cutoff}))
          }}
        />
        {this.props.genesDistributedByCutoffUrl
          && (
          <div>
            <a href="#" onClick={()=> this.setState({ showModal: "cutoff"})} style={{marginBottom:"0.5rem", fontSize:"85%"}}>
              <Glyphicon glyph="stats"/>
              <span style={{marginLeft:"0.25rem"}}>
              {`See distribution`}
              </span>
            </a>
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
        <br/>
        <Header text={columnsName}/>
        <OpenerButton onClickButton={()=> this.setState({ showModal: "columns" })} />
        <HeatmapColumnsSummary
          columnGroups={this.props.columnGroups}
          selectedColumnIds={this.state.selectedColumnIds}
          {...{availableColumnIds,columnsName}}
          />

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
            {...{availableColumnIds,columnsName}}
            onNewSelectedColumnIds={(selectedColumnIds) => {
              this.setState({selectedColumnIds})
            }}/>

        </ModalWrapper>
    </div>
    )
  }
})

export default SidebarAndModal
