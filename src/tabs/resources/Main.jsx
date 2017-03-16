import React, { Component } from 'react'
import { connect, PromiseState } from 'react-refetch'
import ResourceType from './ResourcePropTypes.js'
import {Large as LargeResource, Small as SmallResource} from './Resource.jsx'
import {uniq} from 'lodash'

const whichSection = (value) => value.group.split("/")[0]
const whichSubsection = (value) => {
  const s = value.group.split("/")
  return (
    s.length <2
    ? ""
    : s.splice(1).join("/")

  )
}


const ResourcesSection = ({name, values}) => {
  const subsections = uniq(values.map((value)=> (
    whichSubsection(value)
  )))

  return (
    <div className="row">
      <h3>{name}</h3>
        {
          subsections.filter(el=>el).length <2
          ? values.map((value, ix, self) => (
              <LargeResource key={ix}
                className={"small-12 medium-6 large-4 columns " + (ix === self.length -1 ? "end" : "")}
                {...value} />
            ))
          : subsections.map((subsectionName) => (
              <div className="row" key={subsectionName}>
                <h5>{subsectionName}</h5>
                {
                  values.filter((value) => (
                    subsectionName === whichSubsection(value)
                  ))
                  .map((value, ix, self) => (
                      <SmallResource key={ix}
                        className={"small-12 medium-6 columns " + (ix === self.length -1 ? "end" : "")}
                        {...value} />
                  ))
                }
              </div>
          ))
        }
    </div>
  )
}

const ResourcesList = ({values}) => {
  const sections = uniq(values.map((value)=> (
    whichSection(value)
  )))

  return (
    <div>
      {
        sections.map((sectionName, ix) => (
          <ResourcesSection key={ix}
            name = {sectionName}
            values = {
              values.filter((value) => (
                sectionName === whichSection(value)
              ))
            } />
        ))
      }
    </div>
  )

}

ResourcesList.propTypes = React.PropTypes.arrayOf(React.PropTypes.shape(
  ResourceType
).isRequired).isRequired

class ResourcesTab extends Component {
  render() {
    const { resourcesFetch , atlasHost} = this.props

    if (resourcesFetch.pending) {
      return <img src={atlasHost + "/gxa/resources/images/loading.gif"}/>
    } else if (resourcesFetch.rejected) {
      return (
        <div>
        Error: {resourcesFetch.reason}
        </div>
      )
    } else if (resourcesFetch.fulfilled) {
      return <ResourcesList values={resourcesFetch.value} />
    }
  }
}

export default connect(props => ({
  resourcesFetch: props.url
}))(ResourcesTab)
