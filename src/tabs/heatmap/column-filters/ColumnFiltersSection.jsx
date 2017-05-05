import React from 'react'
import {Glyphicon} from 'react-bootstrap/lib'
import {ColumnGroupPropTypes} from '../PropTypes.js'
import {xor, difference, intersection, union,isEqual} from 'lodash'
require('./Components.less');

const prettyName = (name) => (
  name
  .replace(/_/g," ")
  .replace(/\w\S*/g, (txt) => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
)

const CommonPropTypes = {
  name: ColumnGroupPropTypes.name,
  groupings: ColumnGroupPropTypes.groupings,
  availableIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  selectedIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  onNewSelectedIds: React.PropTypes.func.isRequired
}

const SELECTION = {
  UNSELECTED: "unselected",
  PARTIAL: "partiallySelected",
  SELECTED: "selected"
}

const SELECTION_LIST = [
  SELECTION.UNSELECTED,
  SELECTION.PARTIAL,
  SELECTION.SELECTED
]

const GroupingPropTypes = {
  text: React.PropTypes.string.isRequired,
  selection: React.PropTypes.oneOf(SELECTION_LIST).isRequired,
  onToggle: React.PropTypes.func.isRequired
}

const makeGroupingProps = ({selectedIds,onNewSelectedIds}, grouping) => {
  const idsInGroupingAndSelected = intersection(selectedIds, grouping[1])
  const idsInGroupingButNotSelected = difference(grouping[1], idsInGroupingAndSelected)
  const isFullySelected = grouping[1].length > 0 && idsInGroupingButNotSelected.length == 0
  const isFullyUnselected = idsInGroupingAndSelected.length == 0
  return {
    key: grouping[0],
    text: grouping[0],
    selection:
      isFullyUnselected
       ? SELECTION.UNSELECTED
       : isFullySelected
         ? SELECTION.SELECTED
         : SELECTION.PARTIAL ,
    onToggle:
      isFullyUnselected
      ? () => {
        onNewSelectedIds(union(grouping[1], selectedIds))
      }
      : () => {
        onNewSelectedIds(difference(selectedIds, grouping[1]))
      }
  }
}

const ReadOnlyGrouping = ({text, selection}) => (
  <span className={"readOnlyGrouping "+selection}>
    {
      text
    }
  </span>
)
ReadOnlyGrouping.propTypes = GroupingPropTypes

const CheckboxGrouping = ({text, selection, onToggle}) => (
  <div className={"checkboxGrouping " + selection}>
    <input type="checkbox"
      value={text}
      onChange={onToggle}
      checked={[SELECTION.SELECTED, SELECTION.PARTIAL].indexOf(selection)>-1}
      ref={checkbox => {checkbox ? checkbox.indeterminate = selection === SELECTION.PARTIAL : null}}
      />
    { text
      ? <span>
          {text}
        </span>
      : <span style={{opacity: 0.5, fontStyle:"italic"}}>
          missing
        </span>
    }
  </div>
)
CheckboxGrouping.propTypes = GroupingPropTypes

const PlainSectionBody = ({groupings, selectedIds, onNewSelectedIds}) => (
  <div className="sectionBody">
    {
      groupings
      .map((e)=>e)
      .sort((g1, g2)=> (
        g1[0].localeCompare(g2[0])
      ))
      .map((grouping) => (
        <CheckboxGrouping {...makeGroupingProps({selectedIds,onNewSelectedIds}, grouping)} />
      ))
    }
  </div>
)
PlainSectionBody.propTypes = CommonPropTypes

const filterGroupingsBySelections = ({selectedIds}, selectionsAllowed, groupings) => (
  groupings
  .filter((grouping) => (
    selectionsAllowed.indexOf(makeGroupingProps({selectedIds}, grouping).selection) > -1
  ))
)

const SELECTION_DESCRIPTIONS = {}
SELECTION_DESCRIPTIONS[SELECTION.UNSELECTED] = "currently not selected"
SELECTION_DESCRIPTIONS[SELECTION.PARTIAL] = "partially selected"
SELECTION_DESCRIPTIONS[SELECTION.SELECTED] = ""

const SelectionOption = ({selection,isCurrentlyShown,groupingsForThisSelection}) => (
  <span className="linksForToggleShow">
    {
      `${groupingsForThisSelection.length} options ${SELECTION_DESCRIPTIONS[selection]} - ${isCurrentlyShown?"hide":"show"} ...`
    }
  </span>
)

SelectionOption.propTypes = {
  selection: React.PropTypes.oneOf(SELECTION_LIST).isRequired,
  isCurrentlyShown: React.PropTypes.bool.isRequired,
  groupingsForThisSelection: ColumnGroupPropTypes.groupings
}

class SectionBodyWithCollapsableLinks extends React.Component {
  _countUnselected() {
    return filterGroupingsBySelections(this.props, [SELECTION.UNSELECTED], this.props.groupings).length
  }
  _countPartiallySelected() {
    return filterGroupingsBySelections(this.props, [SELECTION.PARTIAL], this.props.groupings).length
  }
  _countSelected() {
    return filterGroupingsBySelections(this.props, [SELECTION.SELECTED], this.props.groupings).length
  }
  constructor(props) {
    super(props)

    this.state = {
      showUnselected:
        this._countUnselected() < 7,
      showPartiallySelected:
        this._countPartiallySelected() < 7
    }
  }

  render() {
    const { groupings, selectedIds, onNewSelectedIds } = this.props
    const { showUnselected, showPartiallySelected} = this.state
    const unselectedGroupingsCount = this._countUnselected()
    const partiallySelectedGroupingsCount = this._countPartiallySelected()
    const selectedGroupingsCount = this._countSelected()
    return (
      <div className="sectionBody">
        {
          filterGroupingsBySelections(
            {selectedIds},
            [].concat(
              showUnselected ? [SELECTION.UNSELECTED] : [],
              showPartiallySelected ? [SELECTION.PARTIAL] : [],
              [SELECTION.SELECTED]
            ),
            groupings
          )
          .sort((g1, g2)=> (
            g1[0].localeCompare(g2[0])
          ))
          .map((grouping) => (
            <CheckboxGrouping {...makeGroupingProps({selectedIds,onNewSelectedIds}, grouping)} />
          ))
        }
        { !!unselectedGroupingsCount &&
          <span className="linkForToggleShow" onClick={()=>{
            this.setState(({showUnselected})=>({showUnselected:!showUnselected}))
          }}>
            {
              showUnselected
              ? `(hide unselected)`
              : `${selectedGroupingsCount ? "+ ": ""}${unselectedGroupingsCount} unselected (show...)`
            }
          </span>
        }
        <br/>
        { !!partiallySelectedGroupingsCount &&
          <span className="linkForToggleShow"  onClick={()=>{
            this.setState(({showPartiallySelected})=>({showPartiallySelected:!showPartiallySelected}))
          }}>
          {
            showPartiallySelected
            ? `(hide partially selected)`
            : `${selectedGroupingsCount ? "+ ": ""}${this._countPartiallySelected()} partially selected (show...)`
          }
          </span>
        }
      </div>
    )
  }
}

SectionBodyWithCollapsableLinks.propTypes = CommonPropTypes

class Section extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: this.props.primary
    }
  }


  render() {
    const {name, groupings, availableIds} = this.props
    const {open} = this.state
    const headerName = prettyName(name)+": "
    if(this.props.groupings.length === 1) {
      return (
        <div className="margin-top-large gxaSection">
          <span className="title">
            {headerName}
          </span>
          <ReadOnlyGrouping {...makeGroupingProps(this.props, groupings[0])} />
        </div>
      )
    } else if (
      groupings.length === 2
      && isEqual(new Set(groupings[0][1]), new Set(availableIds))
      && isEqual(new Set(groupings[1][1]), new Set(availableIds))){
      return (
        <div className="margin-top-large gxaSection">
          <span className="title">
            {headerName}
          </span>
          <ReadOnlyGrouping
            {...makeGroupingProps(this.props, groupings[0])}
            text={`${groupings[0][0]} vs ${groupings[1][0]}`}
             />
        </div>
      )
    } else {
      return (
        <div className="margin-top-large gxaSection">
          <div className="title openable"
             onClick={()=>{
               this.setState(({open})=>({open:!open}))
             }}
             href="#">
             {headerName}
             {
               <Glyphicon style={{fontSize: `x-small`, paddingLeft: `5px`}} glyph={open? "menu-up" : "menu-down"}/>
             }
          </div>
          {
            open && (groupings.length > 10
            ? <SectionBodyWithCollapsableLinks {...this.props} />
            : <PlainSectionBody {...this.props} />)
          }
        </div>
      )
    }
  }
}

Section.propTypes = CommonPropTypes

export default Section;
