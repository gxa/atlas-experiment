const React = require(`react`);
const Button = require(`react-bootstrap/lib/Button`);
const Glyphicon = require(`react-bootstrap/lib/Glyphicon`);
const PropTypes = require(`./PropTypes.js`);
const xor = require(`lodash/xor`);
require('./Components.less');


const prettyName = (name) => (
  name
  .replace(/_/g," ")
  .replace(/\w\S*/g, (txt) => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
)

const Filter = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    available: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    selected: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onNewSelected: React.PropTypes.func.isRequired
  },

  getInitialState(){
    return {
      open: this.props.available.length != this.props.selected.length,
      showAll: false
    }
  },


  toggleAll(evt){
    /*
    Maybe we'll add it back? :)
    <input type="checkbox"
      value={this.props.name}
      onChange={this.toggleAll}
      checked={this.props.available.every((v) => this.props.selected.indexOf(v)>-1)}/>
    */
    this.props.onNewSelected(
      xor(this.props.values,this.props.selected).length
      ? this.props.values
      : []
    )
  },

  toggleOne(which, evt){
    this.props.onNewSelected(xor(this.props.selected,[which]))
  },

  toggleOpen(evt){
    this.setState((previousState)=>({open:!previousState.open}))
  },

  toggleShowAll(evt){
    this.setState((previousState)=>({showAll:!previousState.showAll}))
  },

  render(){
    const unavailable =
      this.props.values
      .filter((value)=> this.props.available.indexOf(value) == -1)
    return (
      <div className="filterBody">
        <div className="groupName"
           onClick={this.toggleOpen}
           href="#">
           {prettyName(this.props.name)}
           {
             <Glyphicon style={{fontSize: `x-small`, paddingLeft: `5px`}} glyph={this.state.open? "menu-up" : "menu-down"}/>
           }
        </div>
        {this.state.open &&
          <div className="options">
          {this.props.available
            .map((value) => (
            <div className="option" key={value}>
              <input type="checkbox"
                value={value}
                onChange={(evt)=>this.toggleOne(value, evt)}
                checked={this.props.selected.indexOf(value)>-1}
                />
                <span> {value}</span>
            </div>
          ))}
          { (unavailable.length > 7 && !this.state.showAll)
            ? <span onClick={this.toggleShowAll} style={{cursor:"pointer"}}>
                {`+ ${unavailable.length} excluded (show)`}
              </span>
            : unavailable
              .map((value) => (
              <div className="option" key={value}>
                <input type="checkbox"
                  value={value}
                  checked={false}
                  disabled={true}
                  />
                  <span style={{color:"grey"}}> {value}</span>
              </div>
          ))
          }
          {this.state.showAll && <span onClick={this.toggleShowAll} style={{cursor:"pointer"}}> (... show less) </span>}
          </div>
        }
      </div>
    )
  }
})

export default Filter;
