import React from 'react'

class Checkbox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isChecked: this.props.value,
        };
    }

    toggleCheckbox () {
        this.setState({
            isChecked: !this.state.isChecked,
        });

        this.props.onChangeValue(!this.state.isChecked);
    };

    render() {
        return (
            <div>
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
        );
    }
}

Checkbox.propTypes = {
    value: React.PropTypes.any.isRequired,
    onChangeValue: React.PropTypes.func.isRequired
};

export default Checkbox