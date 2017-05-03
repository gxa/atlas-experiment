import React from 'react'
import {QueryObjectsPropTypes} from '../PropTypes.js'
import AutocompleteBox from './AutocompleteBox.jsx'

const CommonPropTypes = {
  geneQuery: QueryObjectsPropTypes.geneQuery,
}


const Main = ({geneQuery, onChangeGeneQuery, geneSuggesterUrlTemplate}) => (
  <div>
    <h5>
      Selected
    </h5>
    <div>
      {geneQuery.length
        ? geneQuery.map(({value} )=> (
          <span style={{cursor:"pointer", margin: "0.2rem"}} className="tag" key={value} onClick={()=>{
            onChangeGeneQuery(
              geneQuery.filter(term => term.value !== value)
            )}} >
            {value}
          </span>
        ))
        : (<span style={{opacity: 0.7, margin:"1rem"}}>
            None currently selected
          </span>
        )
      }
    </div>
    <br/>
    <h5>
      Choose genes
    </h5>

    <AutocompleteBox
      suggesterUrlTemplate={geneSuggesterUrlTemplate}
      valuesToSkipInSuggestions={geneQuery.map(({value})=>value)}
      onGeneChosen={(newGene)=> onChangeGeneQuery(
        [].concat(geneQuery, [{value: newGene}])
      )} />
  </div>
)

Main.propTypes = Object.assign({}, CommonPropTypes, {
  onChangeGeneQuery: React.PropTypes.func.isRequired
})

const Summary = ({geneQuery}) => (
  <div>
    {
      !!geneQuery.length && `${geneQuery.length} query term${geneQuery.length>1 ? "s" : ""}`
    }
  </div>
)

Summary.propTypes = CommonPropTypes

export {
  Main, Summary
}
