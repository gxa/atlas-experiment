import React from 'react'
import PropTypes from 'prop-types'
import {Button, ButtonGroup, Glyphicon} from 'react-bootstrap/lib'

import {isEqual} from 'lodash'

import {ColumnGroupPropTypes} from '../PropTypes.js'
import {MultipleGroupingsSection, OneGroupingReadOnlySection} from './ColumnFiltersSection.js'

const Main = ({isDifferential, columnGroups, selectedColumnIds, onNewSelectedColumnIds, availableColumnIds, columnsName}) => {

  const oneGroupingColumnGroups = []
  const gottaBeContrastComparisonColumnGroups = []
  const multipleGroupingsEachCoveringAllIdsColumnGroups = []
  const multipleGroupingsColumnGroups = []

  columnGroups.forEach(group => {
    if (group.groupings.length === 1) {
        oneGroupingColumnGroups.push(group)
    } else if (group.groupings.every( g =>
            isEqual(new Set(g[1]), new Set(availableColumnIds))
        )) {
        if(isDifferential && group.groupings.length === 2){
            gottaBeContrastComparisonColumnGroups.push(group)
        } else {
            multipleGroupingsEachCoveringAllIdsColumnGroups.push(group)
        }
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
              <MultipleGroupingsSection key={group.name}
                       availableIds={availableColumnIds}
                       selectedIds={selectedColumnIds}
                       onNewSelectedIds={onNewSelectedColumnIds}
                       readOnly={false}
                       {...group} />
          )}
        </div>
      }

      {gottaBeContrastComparisonColumnGroups.length > 0 &&
      <div className={multipleGroupingsColumnGroups.length > 0 ? `margin-top-xlarge` : ``}>
        {gottaBeContrastComparisonColumnGroups.map(group =>
          <OneGroupingReadOnlySection
                key={group.name}
                name={group.name}
                availableIds={availableColumnIds}
                selectedIds={selectedColumnIds}
                text={
                    isDifferential
                        ? `${group.groupings[0][0]} vs ${group.groupings[1][0]}`
                        : group.groupings
                            .map(g=>g[0])
                            .join(", ")
                    }/>
        )}
      </div>
      }

      {multipleGroupingsEachCoveringAllIdsColumnGroups.length > 0 &&
      <div className={multipleGroupingsColumnGroups.length > 0 ? `margin-top-xlarge` : ``}>
        {multipleGroupingsEachCoveringAllIdsColumnGroups.map(group =>
          <OneGroupingReadOnlySection
                key={group.name}
                name={group.name}
                availableIds={availableColumnIds}
                selectedIds={selectedColumnIds}
                text={
                    group.groupings
                    .map(g=>g[0])
                    .join(", ")}/>
        )}
      </div>
      }

      {oneGroupingColumnGroups.length > 0 &&
      <div className={multipleGroupingsColumnGroups.length > 0 || readOnlyTwoGroupingColumnGroups.length > 0 ?
                      `margin-top-xlarge` : ``}>
        {oneGroupingColumnGroups.map(group =>
            <OneGroupingReadOnlySection
                key={group.name}
                name={group.name}
                availableIds={availableColumnIds}
                selectedIds={selectedColumnIds}
                text={group.groupings[0][0]} />
        )}
      </div>
      }

    </div>
  )
}

const ColumnCommonTypes = {
  columnGroups: PropTypes.arrayOf(PropTypes.shape(ColumnGroupPropTypes).isRequired).isRequired,
  selectedColumnIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  availableColumnIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnsName: PropTypes.string.isRequired
}

Main.propTypes = Object.assign(
  {}, ColumnCommonTypes , {
    isDifferential : PropTypes.bool.isRequired,
    onNewSelectedColumnIds: PropTypes.func.isRequired
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
