import React from 'react'
import {FilterPropTypes} from './PropTypes.js'

const prettyName = (name) => (
  name
  .toLowerCase()
  .replace(/_/g," ")
  .replace(/\w\S*/, (txt) => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
)

const FilterChoiceSummary = ({filters}) => (
  <div>
    {filters
      .map((_filter)=>(
      <div key={_filter.name}>
        <h5>
          {prettyName(_filter.name)}
        </h5>
          {["all","ALL"].indexOf(_filter.selected)===-1
          ? <ul>
            {
              _filter.selected.map((selected) => (
                <li key={selected}>
                {selected}
                </li>
              ))
            }
            </ul>
          : _filter.groupings.length < 2
            ? <ul>
              {
                _filter.groupings.map((g)=>(
                  <i key={g[0]}>
                    {g[0]}
                  </i>)
                )
              }
              </ul>
            : <ul> ALL </ul>
          }
      </div>
    ))}
  </div>
)

FilterChoiceSummary.propTypes = {
  filters: React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired
}

export default FilterChoiceSummary
