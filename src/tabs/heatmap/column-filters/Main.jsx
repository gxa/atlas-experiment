import React from 'react'
import FiltersInStages from './FiltersInStages.jsx'
import {determineSelectionFromFilters, determineAvailableFromFilters} from './Filters.js'
import {FilterPropTypes} from '../PropTypes.js'

const Main = ({propagateFilterSelection, filters}) => (
  <div>
    <h5>
      {
        `Data columns selected currently: ${determineSelectionFromFilters(filters).length} / ${determineAvailableFromFilters(filters).length}`
      }
    </h5>
    <FiltersInStages {...{propagateFilterSelection, filters}} />
  </div>
)

const FiltersType = React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired

Main.propTypes = {
  propagateFilterSelection: React.PropTypes.func.isRequired,
  filters: FiltersType
}

const Summary = ({filters}) => (
  <div>
  {
    `Selected: ${determineSelectionFromFilters(filters).length} / ${determineAvailableFromFilters(filters).length}`
  }
  </div>
)


Summary.PropTypes = {
  filters: FiltersType
}



export {
  Main, Summary
}
