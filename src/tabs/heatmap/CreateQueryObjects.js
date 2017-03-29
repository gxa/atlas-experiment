import {isEqual} from 'lodash'
import {determineSelectionFromFilters} from './column-filters/Filters.js'

const overlayFilterFactorsObjectOnFilters = (filters, filterFactors) => {
  const filterFactorsCopy = {}
  Object.keys(filterFactors)
  .forEach((key) => {
    filterFactorsCopy[key.toUpperCase()] = filterFactors[key]
  })
  return (
    filters
    .map((_filter) => Object.assign({}, _filter, {
      selected:
        filterFactorsCopy[_filter.name.toUpperCase()] || _filter.selected || "all"
    }))
  )
}

const makeFilterFactorsObject = (filtersInitially, filters) => {
  const filterFactors = {}

  filtersInitially
  .forEach((f)=> {
    const newF = filters.find((_f)=>_f.name === f.name) || Object.assign({},f)
    if(!isEqual(new Set(f.selected), new Set(newF.selected))){
      filterFactors[newF.name] = newF.selected
    }
  })

  return filterFactors
}

const decode = (v, defaultV) => (
  JSON.parse(decodeURIComponent(v === undefined ? defaultV : v))
)

const encode = (v) => (
  encodeURIComponent(JSON.stringify(v))
)


const toQuery = (initialQueryObjects, queryObjects) => Object.assign({
  specific: encode(queryObjects.specific),
  geneQuery: encode(queryObjects.geneQuery),
  filterFactors: encode(
      makeFilterFactorsObject(initialQueryObjects.filters,queryObjects.filters)
    ),
  cutoff: encode(queryObjects.cutoff)
}, ["UP","DOWN","UP_DOWN"].indexOf(queryObjects.regulation)>-1
    ? {regulation: encode(queryObjects.regulation)}
    : {}
)

const packStringsIntoArrays = (stringOrArray) => (
  typeof stringOrArray == 'string'
  ? [{value: stringOrArray}]
  : stringOrArray
)

const fromQuery = (initialQueryObjects, query) => ({
  specific: decode(query.specific , "true"),
  geneQuery: packStringsIntoArrays(decode(query.geneQuery , "[]")),
  filters: overlayFilterFactorsObjectOnFilters(
    initialQueryObjects.filters,
    decode(query.filterFactors, "{}")
  ),
  cutoff: Object.assign({},
    initialQueryObjects.cutoff,
    decode(query.cutoff, "{}")
  ),
  regulation: decode(query.regulation, `"${initialQueryObjects.regulation}"`)
})

// should be in sync with backend - see ExperimentPageRequestPreferencesPropertyNamesTest.java
// see QueryPropTypes from PropTypes.js
const heatmapCallbackParametersFromQueryObjects = ({
  specific,
  geneQuery,
  filters,
  cutoff,
  regulation
}, isDifferential) => Object.assign(
  {
    specific,
    geneQuery,
    selectedColumnIds: determineSelectionFromFilters(filters)
  },
  isDifferential && regulation!=="OFF"
  ? {regulation} : {},
  isDifferential
    ? {
      cutoff: cutoff.pValue,
      foldChangeCutoff: cutoff.foldChange
    }
    : {
      cutoff: cutoff.value
    }
)

const toBaselineRequestPreferences = (queryObjects) => heatmapCallbackParametersFromQueryObjects(queryObjects, false)
const toDifferentialRequestPreferences = (queryObjects) => heatmapCallbackParametersFromQueryObjects(queryObjects, true)

export {
  toQuery,
  fromQuery,
  toBaselineRequestPreferences,
  toDifferentialRequestPreferences
}
