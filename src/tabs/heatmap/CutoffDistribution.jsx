import {CutoffType} from './PropTypes.js'
import React, { Component } from 'react'
import { connect, PromiseState } from 'react-refetch'
import ReactHighcharts from 'react-highcharts'

const cumulativeDistributionPoints= ({bins, values}) => {
  let total = values.reduce((l,r)=> l+r , 0)
  return bins.map((bin, ix) => {
    const result = {
      x:bin,
      y: 0+total
    }
    total -= values[ix]
    return result
  }).filter(({x,y}) => y>0 && x > 0)
}

const CutoffDistribution = ({cutoff, histogram}) => (
  <div>
  {`Current value: ${cutoff.value}`}
  <ReactHighcharts
    config={{
      xAxis: {
        type: 'logarithmic'
      },
      type:"line",
      series:[{
        name:"Genes passing cutoffs",
        data: cumulativeDistributionPoints(histogram)
      }]
    }} />
  </div>
)

CutoffDistribution.propTypes = {
  cutoff: CutoffType,
  histogram: React.PropTypes.shape({
    bins: React.PropTypes.arrayOf(React.PropTypes.number.isRequired).isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.number.isRequired).isRequired
  })
}

class CutoffDistributionLoader extends Component {
  render() {
    const { genesDistributedByCutoffFetch , loadingGifUrl, cutoff} = this.props

    if (genesDistributedByCutoffFetch.pending) {
      return <img src={loadingGifUrl}/>
    } else if (genesDistributedByCutoffFetch.rejected) {
      return (
        <div>
        Error: {genesDistributedByCutoffFetch.reason}
        </div>
      )
    } else if (genesDistributedByCutoffFetch.fulfilled) {
      return (
        <CutoffDistribution
        cutoff={cutoff} histogram={genesDistributedByCutoffFetch.value} />
      )
    }
  }
}

export default connect(props => ({
  genesDistributedByCutoffFetch: props.genesDistributedByCutoffUrl
}))(CutoffDistributionLoader)
