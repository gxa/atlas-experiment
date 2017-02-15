const React = require(`react`);
const Button = require(`react-bootstrap/lib/Button`);
const Glyphicon = require(`react-bootstrap/lib/Glyphicon`);
const xor = require(`lodash/xor`);
const intersection = require(`lodash/intersection`)
const curry = require(`lodash/curry`)
require('./Components.less');
import FlatFilter from './FlatFilter.jsx'

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
/*
or! enforce gradual choice and make it clear that the options are narrowing down
then provide a "swap order"

Organism part
selected : leg
available: leg, lung, tooth, ear, eye

Disease
selected: trench foot
available: trench foot, blisters
other: asthma, bronchitis, cholera, dengue, Ebola


xn "available" and "other" depend on whether or not there's x1 ... xn-1 in "selected" such that at least one gi has (x1 ... xn)


const filters = [
  {
    name: "a or b",
    selected: ["choice a"],
    groupings: [["choice a", [1, 2, 3, 4, 5, 6, 7]], ["choice b", [8, 9]]]
    },
  {
    name: "A or B or C",
    selected: "all",
    groupings: [["choice A", [1, 2, 3, 4, 5]], ["choice B", [6, 7, 8]], [
      "choice C", [9]]]
}
]
=>

[{
  "values": ["choice a", "choice b"],
  "available": ["choice a", "choice b"],
  "selected": ["choice a"]
}, {
  "values": ["choice A", "choice B", "choice C"],
  "available": ["choice A", "choice B"],
  "selected": ["choice A", "choice B"]
}]
*/

const valueOfSelectionSequence = (selections, allFilters) => (
  intersection.apply([],
    selections
    .map((selected, ix) => (
      [].concat.apply([],
        allFilters[ix].groupings
        .filter((g) => selected.indexOf(g[0]) > -1 )
        .map((g) => g[1])
      )
    ))
  )
)

const stageFromNextFilter = (allFilters, acc, nextFilter) => {
  const values = nextFilter.groupings.map((g) => g[0])
  let available;
  if(!acc.length){
    available = values;
  } else {
    const optionsStillLeft = valueOfSelectionSequence(acc.map((f)=> f.selected) , allFilters)
    const choiceStillFeasible = (optionsForChoice) => (
      intersection(optionsStillLeft,optionsForChoice).length >0
    )
    available = values.filter((value)=> choiceStillFeasible(nextFilter.groupings.find((g)=>g[0]==value)[1]))
  }

  const selectedIntended =
    nextFilter.selected === "all" || nextFilter.selected === "ALL"
    ? nextFilter.groupings.map((a)=>a[0])
    : nextFilter.selected
  return acc.concat([{
    name: nextFilter.name,
    values: values,
    available: available,
    selected:
      selectedIntended.filter((x)=>available.indexOf(x)>-1)
  }])
}

const createStagesFromFilters = (filters) => (
  filters.reduce(
    curry(stageFromNextFilter , 3)(filters),
    []
  )
)

const changeOneFilter = (filters, whichFilterChanges, newSelected) => (
  filters
  .map((_filter, ix) => (
    ix === whichFilterChanges
    ? Object.assign({}, _filter, {selected: newSelected})
    : _filter
  ))
)

const FiltersAndTheirChoices = React.createClass({
  propTypes: {
      propagateFilterSelection: React.PropTypes.func.isRequired,
      filters: React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired
  },

  getInitialState() {
    return {
      filters: this.props.filters
    }
  },

  _currentlySelected() {
    return valueOfSelectionSequence(
      createStagesFromFilters(this.state.filters)
      .map((f)=> f.selected),
      this.state.filters
    )
  },

  render() {
    const allFilters = this.state.filters
    return (
      <div>
      <div>
        {"Selected: "+JSON.stringify(this._currentlySelected())}
      </div>
      {
        createStagesFromFilters(allFilters)
        .map((stage,ix) => (
          <FlatFilter {...stage}
          key={ix}
          onNewSelected={(newSelected) => {
            this.setState({filters: changeOneFilter(allFilters, ix, newSelected)})
          }}/>
        ))
      }
      </div>
    )
  },
  componentDidUpdate() {
    this.props.propagateFilterSelection(
      this._currentlySelected()
    )
  }
})

export default FiltersAndTheirChoices
