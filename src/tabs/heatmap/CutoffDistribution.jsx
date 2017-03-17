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

const CutoffDistribution = ({cutoff,onChangeCutoff, histogram}) => (
  <div>
  {`Current value: ${cutoff.value}`}
  <ReactHighcharts
    config={{
      title: "",
      xAxis: {
        title: {
          text: 'Cutoff value'
        },
        crosshair: true,
        type: 'logarithmic'
      },
      tooltip: {
        pointFormat: '<span style="color:{point.color};cursor: crosshair;">\u25CF</span> Select cutoff: <b>{point.y}</b><br/>'
      },
      yAxis: {
        title: {
          text: '# genes'
        },
      },
      type:"line",
      series:[{
        cursor:"pointer",
        name:"Genes expressed in this experiment at value higher than cutoff",
        data: cumulativeDistributionPoints(histogram),
        events : {
          click: (event) => {
            onChangeCutoff({value: event.point.x})
          }
        }
      }],
      tooltip: {
        useHTML: true,
        formatter: function() {
          return `<div>Select cutoff: <b> ${this.x}</b> (${this.y} genes past this cutoff)</div>`
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
  onChangeCutoff: React.PropTypes.func.isRequired,
  histogram: React.PropTypes.shape({
    bins: React.PropTypes.arrayOf(React.PropTypes.number.isRequired).isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.number.isRequired).isRequired
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
