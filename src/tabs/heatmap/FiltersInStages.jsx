import React from 'react'
import {xor, intersection,curry} from 'lodash'
import FlatFilter from './FlatFilter.jsx'
import {FilterPropTypes} from './PropTypes.js'

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

const FiltersInStages = ({
  propagateFilterSelection,
  filters
}) => (
  <div>
  {
    createStagesFromFilters(filters)
    .map((stage,ix) => (
      <FlatFilter {...stage}
      key={ix}
      onNewSelected={(newSelected) => {
        propagateFilterSelection(
          changeOneFilter(filters, ix, newSelected)
        )
      }}/>
    ))
  }
  </div>
)


export default FiltersInStages

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
