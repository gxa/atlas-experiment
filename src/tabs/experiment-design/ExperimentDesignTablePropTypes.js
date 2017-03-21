import React from 'react'

export default {
  data: React.PropTypes.arrayOf(React.PropTypes.shape({
    properties: React.PropTypes.oneOfType([
      React.PropTypes.shape({
          analysed: React.PropTypes.bool.isRequired
        }).isRequired,
      React.PropTypes.shape({
          contrastName: React.PropTypes.string.isRequired,
          referenceOrTest: React.PropTypes.oneOf(["reference", "test", ""])
        }).isRequired
    ]),
    values: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired).isRequired
  }).isRequired).isRequired,
  headers: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired
  }).isRequired).isRequired
}
