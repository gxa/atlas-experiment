import React from 'react'

const ColumnGroupPropTypes = {
 name: React.PropTypes.string.isRequired,
 primary: React.PropTypes.bool.isRequired,
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
 }).isRequired
}

const InitialColumnGroupPropTypes = Object.assign({},
  ColumnGroupPropTypes,
  {
    selected: React.PropTypes.oneOfType([
      React.PropTypes.oneOf(['all','ALL']),
      React.PropTypes.arrayOf(React.PropTypes.string)
    ])
  }
)

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

const UnitType = React.PropTypes.string

const QueryObjectsPropTypes = {
  specific: React.PropTypes.bool.isRequired,
  geneQuery: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    category: React.PropTypes.string
  }).isRequired).isRequired,
  selectedColumnIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  cutoff: CutoffType.isRequired,
  regulation: RegulationType.isRequired,
  unit: UnitType.isRequired
}

const QueryPropTypes = {
  filterFactors : React.PropTypes.string,
  specific: React.PropTypes.string,
  geneQuery: React.PropTypes.string,
  cutoff: React.PropTypes.string,
  regulation: React.PropTypes.string,
  unit: React.PropTypes.string
}

export {ColumnGroupPropTypes,InitialColumnGroupPropTypes,QueryObjectsPropTypes,CutoffType,RegulationType,UnitType,QueryPropTypes}
