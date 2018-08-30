import React from 'react'
import PropTypes from 'prop-types'

class Checkbox extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isChecked: this.props.value,
    }
  }

  toggleCheckbox () {
    this.setState({
      isChecked: !this.state.isChecked,
    })

    this.props.onChangeValue(!this.state.isChecked)
  }

  render() {
    return (
      <div className="margin-top-large">
        <input type="checkbox"
          checked={this.state.isChecked}
          name={`menu-item-${this.state.isChecked}`}
          id={`menu-item-${this.state.isChecked}`}
          onChange={this.toggleCheckbox.bind(this)}
        />
        <label>
                    Most specific
        </label>
      </div>
    )
  }
}

Checkbox.propTypes = {
  value: PropTypes.any.isRequired,
  onChangeValue: PropTypes.func.isRequired
}

export default Checkbox