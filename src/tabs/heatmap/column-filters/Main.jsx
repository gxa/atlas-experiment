import React from 'react'
import {intersection, union, isEqual} from 'lodash'
import pluralize from 'pluralize'
import {Button, ButtonGroup, Glyphicon} from 'react-bootstrap/lib'
import {ColumnGroupPropTypes} from '../PropTypes.js'
import Section from './ColumnFiltersSection.jsx'

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

const prettyName = (name) => (
  name
  .replace(/_/g," ")
  .toLowerCase()
  .replace(/\w\S*/, (txt) => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
)

const determineColumnNameFromFirstGroup = (availableColumnIds, group) => {
  const groupingValues = group.groupings.map((g)=> g[1])
  if (isEqual(
    new Set(availableColumnIds),
    new Set([].concat.apply([], groupingValues))
  ) && groupingValues.every((ids)=> ids.length == 1)){
    return pluralize(prettyName(group.name))
  } else {
    return "Data columns"
  }
}


const Main = ({columnGroups, selectedColumnIds, onNewSelectedColumnIds}) => {
  const availableColumnIds = determineAvailableColumns(columnGroups)
  return (
    <div>
      <h5>
        {
          `${determineColumnNameFromFirstGroup(availableColumnIds, columnGroups[0])} selected currently: ${selectedColumnIds.length} / ${availableColumnIds.length}`
        }
      </h5>
      <ButtonGroup>
        <Button
          bsSize="xsmall"
          onClick={() => {
            onNewSelectedColumnIds(availableColumnIds)
          }}
          style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
          <Glyphicon glyph="plus"/>
          <span style={{verticalAlign: `middle`}}> Choose all</span>
        </Button>
        <Button
          bsSize="xsmall"
          onClick={() => {
            onNewSelectedColumnIds([])
          }}
          style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
          <Glyphicon glyph="minus"/>
          <span style={{verticalAlign: `middle`}}> Remove all</span>
        </Button>
      </ButtonGroup>
      <div>
      {
        columnGroups.map((group)=>(
          <Section key={group.name}
            availableIds={availableColumnIds}
            selectedIds={selectedColumnIds}
            onNewSelectedIds={onNewSelectedColumnIds}
            {...group} />
        ))
      }
      </div>
    </div>
  )
}
const ColumnCommonTypes = {
  columnGroups: React.PropTypes.arrayOf(React.PropTypes.shape(ColumnGroupPropTypes).isRequired).isRequired,
  selectedColumnIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
}
Main.propTypes = Object.assign(
  {}, ColumnCommonTypes , {
    onNewSelectedColumnIds: React.PropTypes.func.isRequired
  }
)

const Summary = ({columnGroups, selectedColumnIds}) => (
  <div>
  {
    `Selected: ${selectedColumnIds.length} / ${determineAvailableColumns(columnGroups).length}`
  }
  </div>
)


Summary.propTypes = ColumnCommonTypes


export {
  Main, Summary
}
