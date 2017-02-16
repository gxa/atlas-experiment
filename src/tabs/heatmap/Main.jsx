import React from 'react'
import ButtonOpeningOurModal from './OurModal.jsx'
import FiltersInStages from './FiltersInStages.jsx'
import {FilterPropTypes} from './PropTypes.js'


const Heatmap = React.createClass({
  propTypes: {
    groups: React.PropTypes.arrayOf(React.PropTypes.shape(FilterPropTypes)).isRequired
  },
  getInitialState() {
    return {
      filters: this.props.groups
    }
  },

  render() {
    return (
      <div>
      <h2> I am a heatmap </h2>
      <div style={{width:"50%", backgroundColor: "fuchsia"}}>
        query box

        <ButtonOpeningOurModal
          onClickClose={()=> this.setState(this.getInitialState())}
          onClickApply={()=> console.log("Apply! Would update URL now!")}
          >
          <FiltersInStages
            filters={this.state.filters}
            propagateFilterSelection={(filters) => {
              this.setState({filters})
            }}/>
        </ButtonOpeningOurModal>

      </div>

      <div style={{width:"50%", backgroundColor: "gainsboro"}}>
        Heatmap goes here
        Heatmap goes here
        Heatmap goes here
        Heatmap goes here
        Heatmap goes here
        Heatmap goes here
      </div>
      </div>
    )
  }
})

/*
Later:
- try preserve name and selected in the query parameters instead of in state

- put the two modals together
*/

export default Heatmap;
