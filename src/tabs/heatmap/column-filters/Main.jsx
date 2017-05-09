import React from 'react'
import {Button, ButtonGroup, Glyphicon} from 'react-bootstrap/lib'

import {isEqual} from 'lodash'

import {ColumnGroupPropTypes} from '../PropTypes.js'
import Section from './ColumnFiltersSection.jsx'

const Main = ({columnGroups, selectedColumnIds, onNewSelectedColumnIds, availableColumnIds, columnsName}) => {

  const oneGroupingColumnGroups = []
  const readOnlyTwoGroupingColumnGroups = []
  const multipleGroupingsColumnGroups = []

  columnGroups.forEach(group => {
    if (group.groupings.length === 1) {
      oneGroupingColumnGroups.push(group)
    } else if (group.groupings.length === 2 &&
               isEqual(new Set(group.groupings[0][1]), new Set(availableColumnIds)) &&
               isEqual(new Set(group.groupings[1][1]), new Set(availableColumnIds))) {
      readOnlyTwoGroupingColumnGroups.push(group)
    } else {
      multipleGroupingsColumnGroups.push(group)
    }
  })

  return (
    <div>
      <h5>
        {
          `${columnsName} selected: ${selectedColumnIds.length} / ${availableColumnIds.length}`
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

      {multipleGroupingsColumnGroups.length > 0 &&
        <div>
          {multipleGroupingsColumnGroups.map(group =>
              <Section key={group.name}
                       availableIds={availableColumnIds}
                       selectedIds={selectedColumnIds}
                       onNewSelectedIds={onNewSelectedColumnIds}
                       readOnly={false}
                       {...group} />
          )}
        </div>
      }

      {readOnlyTwoGroupingColumnGroups.length > 0 &&
      <div className={multipleGroupingsColumnGroups.length > 0 ? `margin-top-xlarge` : ``}>
        {readOnlyTwoGroupingColumnGroups.map(group =>
          <Section key={group.name}
                   availableIds={availableColumnIds}
                   selectedIds={selectedColumnIds}
                   onNewSelectedIds={onNewSelectedColumnIds}
                   readOnly={true}
                   {...group} />
        )}
      </div>
      }

      {oneGroupingColumnGroups.length > 0 &&
      <div className={multipleGroupingsColumnGroups.length > 0 || readOnlyTwoGroupingColumnGroups.length > 0 ?
                      `margin-top-xlarge` : ``}>
        {oneGroupingColumnGroups.map(group =>
          <Section key={group.name}
                   availableIds={availableColumnIds}
                   selectedIds={selectedColumnIds}
                   onNewSelectedIds={onNewSelectedColumnIds}
                   {...group} />
        )}
      </div>
      }

    </div>
  )
}

const ColumnCommonTypes = {
  columnGroups: React.PropTypes.arrayOf(React.PropTypes.shape(ColumnGroupPropTypes).isRequired).isRequired,
  selectedColumnIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  availableColumnIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  columnsName: React.PropTypes.string.isRequired
}

Main.propTypes = Object.assign(
  {}, ColumnCommonTypes , {
    onNewSelectedColumnIds: React.PropTypes.func.isRequired
  }
)

const Summary = ({columnGroups, selectedColumnIds, availableColumnIds}) => (
  <div>
    <p>{`Selected: ${selectedColumnIds.length} / ${availableColumnIds.length}`}</p>
  </div>
)

Summary.propTypes = ColumnCommonTypes

export {
  Main, Summary
}
