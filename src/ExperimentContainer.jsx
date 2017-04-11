import React from 'react'

import {BrowserRouter, Route,Switch, Redirect,NavLink, IndexRedirect, withRouter } from 'react-router-dom'
import queryStringUtils from 'qs'

import Heatmap from './tabs/heatmap/Main.jsx'
import ExperimentDesign from './tabs/experiment-design/Main.jsx'
import Resources from './tabs/resources/Main.jsx'
import StaticTable from './tabs/StaticTable.jsx'
import QCReport from './tabs/qc-report/Main.jsx'

//coupled to ExperimentController.java
const componentsPerTab = {
  'heatmap' : Heatmap,
  'experiment-design' : ExperimentDesign,
  'resources' : Resources,
  'static-table' : StaticTable,
  'qc-report' : QCReport
}

const makeTab = (name, props) => {
  const Tab = componentsPerTab[name]
  return ({location:{search}}) => (
    <Tab query={queryStringUtils.parse(search.replace(/^\?/,""))} {...props} />
  )
}

const makeTopRibbon = (tabNames) => (
  withRouter(
    ({location}) =>
      <ul className="tabs" data-tabs role="tablist">
        {tabNames.map(tabName => (
          <li title={tabName} role="presentation" key={tabName} className="tabs-title">
            <NavLink
              to={{pathname:`/${tabName}`, search: location.search, hash: location.hash}}
              style={{fontSize: "medium"}} activeStyle={{color:"white", background:"#666"}}>
              {tabName}
            </NavLink>
          </li>
        ))}
      </ul>
  )
)

const ExperimentContainerRouter = ({
  atlasHost,
  pathToFolderWithBundledResources,
  experimentAccession,
  experimentType,
  species,
  tabs
}) => {

  return (
    <BrowserRouter basename={`/gxa/experiments/${experimentAccession}`}>
      <div>
        <Route path={"/"} component={makeTopRibbon(tabs.map((tab)=>tab.name))} />
        <Switch>
        {
          tabs
          .map((tab)=> (
            <Route
              key={tab.name}
              path={`/${tab.name}`}
              component={makeTab(tab.type,
                Object.assign(
                  {
                    atlasHost,
                    pathToFolderWithBundledResources,
                    experimentAccession,
                    experimentType,
                    species
                  },
                  {
                    isDifferential:
                      experimentType.toLowerCase().indexOf('differential') >-1,
                    isRnaSeq:
                      experimentType.toLowerCase().replace("_","").indexOf('rnaseq') >-1
                  },tab.props)
                )}
              />
          ))
        }
        </Switch>
        <Redirect to={`/${tabs[0].name}`} />
      </div>
    </BrowserRouter>
  )
}

ExperimentContainerRouter.propTypes = {
  atlasHost: React.PropTypes.string.isRequired,
  pathToFolderWithBundledResources: React.PropTypes.string.isRequired,
  experimentAccession: React.PropTypes.string.isRequired,
  experimentType: React.PropTypes.string.isRequired,
  species: React.PropTypes.string.isRequired,
  tabs: React.PropTypes.arrayOf(React.PropTypes.shape({
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    props: React.PropTypes.object.isRequired
  })).isRequired
}

export default ExperimentContainerRouter;
