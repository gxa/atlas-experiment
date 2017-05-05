import React from 'react'
import {Button, ButtonGroup, Glyphicon} from 'react-bootstrap/lib'
import {ColumnGroupPropTypes} from '../PropTypes.js'
import Section from './ColumnFiltersSection.jsx'

const Main = ({columnGroups, selectedColumnIds, onNewSelectedColumnIds, availableColumnIds, columnsName}) => {
  const oneGroupingColumnGroups = columnGroups.filter(group => group.groupings.length === 1)
  const multipleGroupingColumnGroups = columnGroups.filter(group => group.groupings.length > 1)

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

      {multipleGroupingColumnGroups.length > 0 &&
        <div>
          {multipleGroupingColumnGroups.map(group =>
              <Section key={group.name}
                       availableIds={availableColumnIds}
                       selectedIds={selectedColumnIds}
                       onNewSelectedIds={onNewSelectedColumnIds}
                       {...group} />
          )}
        </div>
      }

      {oneGroupingColumnGroups.length > 0 &&
      <div className={multipleGroupingColumnGroups.length > 0 ? `margin-top-xlarge` : ``}>
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
  {
    `Selected: ${selectedColumnIds.length} / ${availableColumnIds.length}`
  }
  </div>
)

Summary.propTypes = ColumnCommonTypes

export {
  Main, Summary
}
