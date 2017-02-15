const React = require(`react`);
const Button = require(`react-bootstrap/lib/Button`);
const Glyphicon = require(`react-bootstrap/lib/Glyphicon`);
const xor = require(`lodash/xor`);
require('./Components.less');


const FlatFilter = ({
  name,
  values,
  available,
  selected,
  onNewSelected
}) => {

  const toggleOne = (which, evt) => {
    onNewSelected(xor(selected,[which]))
  }

  const other = values.filter((value) => available.indexOf(value) == -1)

  return (
    <div className="filterBody">
      {name}
      <div>
        <div>
          Selected
          {selected.map((value)=>(
            <span key={value} onClick={()=>toggleOne(value)}>
              {"- "+value}
            </span>
          ))}
          </div>
        <div>
          Available
          {available
            .filter((value) => selected.indexOf(value) == -1)
            .map((value)=>(
            <span key={value} onClick={()=>toggleOne(value)}>
              {"+ "+value}
            </span>
          ))}
        </div>
        {!!other.length && <div>
          Other
          {other.map((value)=>(
            <span key={value}>
              {value}
            </span>
          ))}
        </div>}
      </div>
    </div>
  )
}

FlatFilter.propTypes = {
  name: React.PropTypes.string.isRequired,
  values: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  available: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  selected: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  onNewSelected: React.PropTypes.func.isRequired
}

export default FlatFilter
