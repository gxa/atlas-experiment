import PropTypes from 'prop-types'

const ColumnGroupPropTypes = {
  name: PropTypes.string.isRequired,
  primary: PropTypes.bool.isRequired,
  groupings: PropTypes.arrayOf((props, propName)=> {
    const prop = props[propName]

    if (prop === undefined) {
      return new Error(`${propName} missing in ${props}`)
    } else if (!Array.isArray(prop) || prop.length !==2) {
      return new Error(`${prop} invalid: expected array of length two`)
    } else if (typeof prop[0]!==`string`){
      return new Error(`${prop[0]} should be a string representing name of the grouping`)
    } else if (!Array.isArray(prop[1])) {
      return new Error(`${prop[1]} should be an array with members of the grouping `)
    }
  }).isRequired
}

const InitialColumnGroupPropTypes = Object.assign({},
  ColumnGroupPropTypes,
  {
    selected: PropTypes.oneOfType([
      PropTypes.oneOf([`all`,`ALL`]),
      PropTypes.arrayOf(PropTypes.string)
    ])
  }
)

const CutoffType = PropTypes.oneOfType([
  PropTypes.shape({
    value : PropTypes.number.isRequired
  }),
  PropTypes.shape({
    foldChange : PropTypes.number.isRequired,
    pValue: PropTypes.number.isRequired
  })
])

const RegulationType = PropTypes.oneOf([
  `OFF`,
  `UP`,
  `DOWN`,
  `UP_DOWN`
])

const UnitType = PropTypes.string

const QueryObjectsPropTypes = {
  specific: PropTypes.bool.isRequired,
  geneQuery: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    category: PropTypes.string
  }).isRequired).isRequired,
  selectedColumnIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  cutoff: CutoffType.isRequired,
  regulation: RegulationType.isRequired,
  unit: UnitType.isRequired
}

const QueryPropTypes = {
  filterFactors : PropTypes.string,
  specific: PropTypes.string,
  geneQuery: PropTypes.string,
  cutoff: PropTypes.string,
  regulation: PropTypes.string,
  unit: PropTypes.string
}

export {ColumnGroupPropTypes,InitialColumnGroupPropTypes,QueryObjectsPropTypes,CutoffType,RegulationType,UnitType,QueryPropTypes}
