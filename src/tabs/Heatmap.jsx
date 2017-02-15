import React from 'react'
import FiltersInStages from './settings/FiltersInStages.jsx'

const Heatmap = ({groups}) => (
  <div> Hello I am heatmap
  <FiltersInStages filters={groups} propagateFilterSelection={console.log}/>
  </div>
)



/*
Later:
- try preserve name and selected in the query parameters instead of in state

- put the two modals together
*/
Heatmap.propTypes = {
  groups: React.PropTypes.arrayOf(
    React.PropTypes.shape({
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
  }))
}

export default Heatmap;
