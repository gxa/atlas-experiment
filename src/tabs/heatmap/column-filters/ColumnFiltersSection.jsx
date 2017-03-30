import React from 'react'
import {Button,Glyphicon} from 'react-bootstrap/lib'
import {ColumnGroupPropTypes} from '../PropTypes.js'
import {xor, difference, intersection, union} from 'lodash'
require('./Components.less');

/*
Make me work!
I want the following features:
- can open and close
- shows checkboxes that can be in three states (off, partial, on) and the callbacks are right
- (I think) partial looks more like a kind of on so clicking on it should switch things off

- there are no excluded filters any more so showing/hiding the excluded ones doesn't apply
- we could shorten into summary and "please show" separately:
-+ filters which are fully inside the current selection of ids
-+ filters which are partially inside the current selection of ids
-+ filters which are outside the current selection of ids

*/


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
  <div className={"checkboxGrouping "+selection}>
    <input type="checkbox"
      value={text}
      onChange={onToggle}
      checked={[SELECTION.SELECTED, SELECTION.PARTIAL].indexOf(selection)>-1}
      ref={checkbox => {checkbox ? checkbox.indeterminate = selection === SELECTION.PARTIAL : null}}
      />
    <span>
      {text}
    </span>
  </div>
)
CheckboxGrouping.propTypes = GroupingPropTypes

/*
TODO make this hide excessive groupings :)
*/
const PlainSectionBody = ({groupings, selectedIds, onNewSelectedIds}) => (
  <div className="groupingsInColumnsSectionBody">
    {
      groupings.map((grouping) => (
        <CheckboxGrouping {...makeGroupingProps({selectedIds,onNewSelectedIds}, grouping)} />
      ))
    }
  </div>
)

const filterGroupingsBySelections = ({selectedIds}, selectionsAllowed, groupings) => (
  groupings
  .filter((grouping) => (
    selectionsAllowed.indexOf(makeGroupingProps({selectedIds}, grouping).selection) > -1
  ))
)

class SectionBody extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectionsToShow:
        difference(SELECTION_LIST, this.props.togglableSelectionGroups)
    }
  }

  render() {
    return (
      <div className="sectionBody">
        <div className="linksForToggleShow">
          {
            this.props.togglableSelectionGroups
            .map((selection) => (
              <span key={selection}
                onClick={() => {
                  this.setState(({selectionsToShow})=>({
                    selectionsToShow: xor(selectionsToShow, selection)
                  }))
              }}>
                  {`toggle ${selection} TODO nice text including off/on and how many hidden / shown`}
              </span>
            ))
          }
        </div>
        <div className="groupingsInColumns">
          {
            filterGroupingsBySelections(this.props, this.state.selectionsToShow, this.props.groupings)
            .map((grouping) => (
              <CheckboxGrouping {...makeGroupingProps(this.props, grouping)} />
            ))
          }
        </div>
      </div>
    )
  }
}

SectionBody.propTypes = Object.assign({},CommonPropTypes, {
  togglableSelectionGroups: React.PropTypes.arrayOf(React.PropTypes.oneOf(SELECTION_LIST)).isRequired
})

class Section extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: this.props.groupings.length < 5
    }
  }


  render() {
    const headerName = prettyName(this.props.name)+": "
    if(this.props.groupings.length == 1) {
      return (
        <div className="gxaSection">
          <span className="title">
            {headerName}
          </span>
          <ReadOnlyGrouping {...makeGroupingProps(this.props, this.props.groupings[0])} />
        </div>
      )
    } else {
      return (
        <div className="gxaSection">
          <div className="title openable"
             onClick={this.toggleOpen}
             href="#">
             {headerName}
             {
               <Glyphicon style={{fontSize: `x-small`, paddingLeft: `5px`}} glyph={this.state.open? "menu-up" : "menu-down"}/>
             }
          </div>
          <SectionBody {...this.props}
            togglableSelectionGroups={SELECTION_LIST.filter((selection)=> (
              filterGroupingsBySelections(this.props, [selection], this.props.groupings)
              .length > 20
            ))} />
        </div>
      )
    }
  }
}

Section.propTypes = CommonPropTypes

export default Section;
