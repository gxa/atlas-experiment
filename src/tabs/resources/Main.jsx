import React, { Component } from 'react'
import { connect, PromiseState } from 'react-refetch'
import ResourceType from './ResourcePropTypes.js'
import Icon from './Icon.jsx'
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


const ResourcesSection = ({name, values, pathToFolderWithBundledResources}) => {
  const subsections = uniq(values.map((value)=> (
    whichSubsection(value)
  )))

  return (
    <div className="row" style={{fontSize:"larger"}}>
      <h3>{name}</h3>
      <ul style={{listStyle: "none"}}>
        {
          subsections.filter(el=>el).length <2
          ? values.map((value, ix, self) => (
              <li key={ix}>
                <a href={value.url}>
                <p>
                  <Icon type={value.type} {...{pathToFolderWithBundledResources}}  />
                  {value.description}
                </p>
                </a>
              </li>
            ))
          : subsections.map((subsectionName, ix) => (
              <li key={ix}>
              <ul style={{listStyle: "none", marginLeft:"0rem"}}>
                <i>{
                  subsectionName}
                </i>
                {
                  values.filter((value) => (
                    subsectionName === whichSubsection(value)
                  ))
                  .map((value, jx, self) => (
                    <li key={jx} style={{marginLeft:"1.25rem"}}>
                      <a href={value.url}>
                      <div>
                        <Icon type={value.type} {...{pathToFolderWithBundledResources}} />
                        {value.description}
                      </div>
                      </a>
                    </li>
                  ))
                }
              </ul>
              <br/>
              </li>
          ))
        }
      </ul>
    </div>
  )
}

const ResourcesList = ({values, pathToFolderWithBundledResources}) => {
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
            } {...{pathToFolderWithBundledResources}}/>
        ))
      }
    </div>
  )

}

ResourcesList.propTypes = {
  values: React.PropTypes.arrayOf(React.PropTypes.shape(ResourceType)).isRequired,
  pathToFolderWithBundledResources: React.PropTypes.string.isRequired
}


class ResourcesTab extends Component {
  render() {
    const { resourcesFetch , atlasHost, pathToFolderWithBundledResources} = this.props

    if (resourcesFetch.pending) {
      return <img src={atlasHost + "/gxa/resources/images/loading.gif"}/>
    } else if (resourcesFetch.rejected) {
      return (
        <div>
        Error: {resourcesFetch.reason}
        </div>
      )
    } else if (resourcesFetch.fulfilled) {
      return (
        <ResourcesList values={resourcesFetch.value}
        {...{pathToFolderWithBundledResources}} />
      )
    }
  }
}

export default connect(props => ({
  resourcesFetch: props.url
}))(ResourcesTab)
