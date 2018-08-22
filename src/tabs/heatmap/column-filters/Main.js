import React from 'react'
import PropTypes from 'prop-types'
import {Button, ButtonGroup, Glyphicon} from 'react-bootstrap/lib'

import {isEqual, groupBy} from 'lodash'
const groupIntoPairs = (arr,f) => Object.entries(groupBy(arr,f))

import {ColumnGroupPropTypes} from '../PropTypes.js'
import {MultipleGroupingsSection, OneGroupingReadOnlySection} from './ColumnFiltersSection.js'

const sameIds = (xs, ys) => isEqual(new Set(xs), new Set(ys))

const tryAggregateGroupings = (groupings) =>
  groupIntoPairs(groupings, g => g[1].map(e=>e).sort().join(``))
    .map(p => [
      p[1].map(g => g[0]).sort().join(`, `)
      , p[1][0][1]
    ] )


const Main = ({isDifferential, columnGroups, selectedColumnIds, onNewSelectedColumnIds, availableColumnIds, columnsName}) => {

  const oneGroupingColumnGroups = []
  const gottaBeContrastComparisonColumnGroups = []
  const multipleGroupingsEachCoveringAllIdsColumnGroups = []
  const multipleGroupingsColumnGroups = []

  columnGroups.forEach(group => {
    if (group.groupings.length === 1) {
      oneGroupingColumnGroups.push(group)
    } else if (group.groupings.every( g => sameIds(g[1], availableColumnIds)
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
  const multipleGroupingsAggregatedColumnGroups =
    multipleGroupingsColumnGroups.map(group => Object.assign({}, group, {groupings: tryAggregateGroupings(group.groupings)}))

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

      {multipleGroupingsAggregatedColumnGroups.length > 0 &&
        <div>
          {multipleGroupingsAggregatedColumnGroups.map(group =>
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
      <div className={multipleGroupingsAggregatedColumnGroups.length > 0 ? `margin-top-xlarge` : ``}>
        {gottaBeContrastComparisonColumnGroups.map(group =>
          <OneGroupingReadOnlySection
            key={group.name}
            name={group.name}
            availableIds={availableColumnIds}
            selectedIds={selectedColumnIds}
            text={`${group.groupings[0][0]} vs ${group.groupings[1][0]}`}/>
        )}
      </div>
      }

      {multipleGroupingsEachCoveringAllIdsColumnGroups.length > 0 &&
      <div className={multipleGroupingsAggregatedColumnGroups.length > 0 ? `margin-top-xlarge` : ``}>
        {multipleGroupingsEachCoveringAllIdsColumnGroups.map(group =>
          <OneGroupingReadOnlySection
            key={group.name}
            name={group.name}
            availableIds={availableColumnIds}
            selectedIds={selectedColumnIds}
            text={
              group.groupings
                .map(g=>g[0])
                .join(`, `)}/>
        )}
      </div>
      }

      {oneGroupingColumnGroups.length > 0 &&
      <div className={
        multipleGroupingsAggregatedColumnGroups.length
          + gottaBeContrastComparisonColumnGroups.length
          + multipleGroupingsEachCoveringAllIdsColumnGroups.length  > 0 ?
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
