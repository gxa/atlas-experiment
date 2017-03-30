import React from 'react'
import {intersection, union} from 'lodash'
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

const Main = ({columnGroups, selectedColumnIds, onNewSelectedColumnIds}) => {
  const availableColumnIds = determineAvailableColumns(columnGroups)
  return (
    <div>
      <h5>
        {
          `Data columns selected currently: ${selectedColumnIds.length} / ${availableColumnIds.length}`
        }
      </h5>
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
