import {CutoffType} from './PropTypes.js'
import React, { Component } from 'react'
import { connect } from 'react-refetch'
import ReactHighcharts from 'react-highcharts'

const cumulativeDistributionPoints= ({bins, counts}) => {
  return bins
    .map((bin, ix) => ({x: bin, y: counts.slice(ix).reduce((v, acc) => v + acc, 0)}))
    .filter(v => v.y > 0);
}

const CutoffDistribution = ({cutoff, onChangeCutoff, histogram}) => (
  <div>
  {`Current value: ${cutoff.value}`}
  <ReactHighcharts
    config={{
      title: ``,
      xAxis: {
        title: {
          text: `Cutoff value`
        },
        type: `logarithmic`
      },
      yAxis: {
        title: {
          text: `# genes`
        },
      },
      type: `line`,
      series:[{
        cursor: `pointer`,
        name: `Genes expressed in this experiment at value higher than cutoff`,
        data: cumulativeDistributionPoints(histogram),
      }],
      tooltip: {
        useHTML: true,
        formatter: function() {
          return `<div>Cutoff: <b> ${this.x}</b> (${this.y} genes past this cutoff)</div>`
        }
      },
      credits: {
        enabled: false
      },
    }} />
  </div>
)

CutoffDistribution.propTypes = {
  cutoff: CutoffType,
  //onChangeCutoff: React.PropTypes.func.isRequired,
  histogram: React.PropTypes.shape({
    bins: React.PropTypes.arrayOf(React.PropTypes.number.isRequired).isRequired,
    counts: React.PropTypes.arrayOf(React.PropTypes.number.isRequired).isRequired
  })
}

class CutoffDistributionLoader extends Component {
  render() {
    const { genesDistributedByCutoffFetch , loadingGifUrl, cutoff, onChangeCutoff} = this.props

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
        histogram={genesDistributedByCutoffFetch.value}
        {...{cutoff, onChangeCutoff}} />
      )
    }
  }
}

export default connect(props => ({
  genesDistributedByCutoffFetch: props.genesDistributedByCutoffUrl
}))(CutoffDistributionLoader)
