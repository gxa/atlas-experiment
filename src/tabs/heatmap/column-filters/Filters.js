import {xor, intersection,curry} from 'lodash'

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

const _idsInGrouping = (_filter) => _filter.groupings.map((a)=>a[0])

const selectedInFilter = (_filter) => (
  _filter.selected === "all" || _filter.selected === "ALL"
  ? _idsInGrouping(_filter)
  : _filter.selected
)

const stageFromNextFilter = (allFilters, acc, nextFilter) => {
  const values = nextFilter.groupings.map((g) => g[0])
  let available;
  if(!acc.length){
    available = values;
  } else {
    const optionsStillLeft = valueOfSelectionSequence(acc.map(selectedInFilter) , allFilters)
    const choiceStillFeasible = (optionsForChoice) => (
      intersection(optionsStillLeft,optionsForChoice).length >0
    )
    available = values.filter((value)=> choiceStillFeasible(nextFilter.groupings.find((g)=>g[0]==value)[1]))
  }

  const selectedIntended = selectedInFilter(nextFilter)

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

const determineSelectionFromFilters = (filters) => (
  valueOfSelectionSequence(filters.map(selectedInFilter), filters)
)

const determineAvailableFromFilters = (filters) => (
  valueOfSelectionSequence(filters.map(_idsInGrouping), filters)
)

export {createStagesFromFilters, determineSelectionFromFilters, determineAvailableFromFilters}
