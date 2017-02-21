import React from 'react'
import {isEqual} from 'lodash'

const FilterPropTypes = {
 name: React.PropTypes.string.isRequired,
 values: React.PropTypes.arrayOf(React.PropTypes.string),
 selected: React.PropTypes.oneOfType([
   React.PropTypes.oneOf(['all','ALL']),
   React.PropTypes.arrayOf(React.PropTypes.string)
 ]),
 groupings: React.PropTypes.arrayOf((props, propName)=> {
     const prop = props[propName];

     if (prop === undefined) {
         return new Error(`${propName} missing in ${props}`)
     } else if (!Array.isArray(prop) || prop.length !==2) {
         return new Error(`${prop} invalid: expected array of length two`)
     } else if (typeof prop[0]!=="string"){
         return new Error(`${prop[0]} should be a string representing name of the grouping`)
     } else if (!Array.isArray(prop[1])) {
         return new Error(`${prop[1]} should be an array with members of the grouping `)
     }
 })
}

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


const queryFromQueryObjects = (initialQueryObjects, queryObjects) => Object.assign({
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

const queryObjectsFromQuery = (initialQueryObjects, query) => ({
  specific: decode(query.specific , "true"),
  geneQuery: decode(query.geneQuery , "\"\""),
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

const CutoffType = React.PropTypes.oneOfType([
  React.PropTypes.shape({
    value : React.PropTypes.number.isRequired
  }),
  React.PropTypes.shape({
    foldChange : React.PropTypes.number.isRequired,
    pValue: React.PropTypes.number.isRequired
  })
])

const RegulationType = React.PropTypes.oneOf([
  'OFF',
  'UP',
  'DOWN',
  'UP_DOWN'
])

const QueryObjectsPropTypes = {
  specific: React.PropTypes.bool.isRequired,
  geneQuery: React.PropTypes.string.isRequired,
  filters: React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired,
  cutoff: CutoffType.isRequired,
  regulation: RegulationType.isRequired
}

const QueryPropTypes = {
  filterFactors : React.PropTypes.string,
  specific: React.PropTypes.string,
  geneQuery: React.PropTypes.string,
  cutoff: React.PropTypes.string,
  regulation: React.PropTypes.string
}


export {FilterPropTypes, queryFromQueryObjects, queryObjectsFromQuery, QueryObjectsPropTypes,CutoffType,RegulationType, QueryPropTypes}
