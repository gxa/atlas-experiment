import React from 'react'
import Filter from './OpenableCheckboxesFilter.jsx'
import {FilterPropTypes} from '../PropTypes.js'
import {createStagesFromFilters} from './Filters.js'



const changeOneFilter = (filters, whichFilterChanges, newSelected) => (
  filters
  .map((_filter, ix) => (
    ix === whichFilterChanges
    ? Object.assign({}, _filter, {selected: newSelected})
    : _filter
  ))
)

// Not sure if I need this
const windUpSelectedAll = (filters) => (
  filters
  .map((_filter) => (
    Object.assign({}, _filter,
      {selected:
         _filter.selected.length == _filter.groupings.length
         ? "all"
         : _filter.selected
       })
  ))
)

const FiltersInStages = ({
  propagateFilterSelection,
  filters
}) => (
  <div>
  {
    createStagesFromFilters(filters)
    .map((stage,ix) => (
      <Filter {...stage}
      key={ix}
      onNewSelected={(newSelected) => {
        propagateFilterSelection(
          windUpSelectedAll(
            changeOneFilter(filters, ix, newSelected)
          )
        )
      }}/>
    ))
  }
  </div>
)


export default FiltersInStages
