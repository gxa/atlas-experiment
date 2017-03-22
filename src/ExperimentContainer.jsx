import React from 'react'

import { hashHistory, Router, Route, Link, IndexRedirect, withRouter } from 'react-router'

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
  return ({location:{query}}) => (
    <Tab query={query} {...props} />
  )
}

const makeContainer = (tabNames) => {

  return ({children}) => (
    <div>
      <ul className="nav nav-tabs" role="tablist">
        {tabNames.map(tabName => (
          <li title={tabName} role="presentation" key={tabName}>
            <Link to={tabName} activeStyle={{color:"red"}}>
              {tabName}
            </Link>
          </li>
        ))}
      </ul>
        {children}
    </div>
  )
}

const ExperimentContainerRouter = ({
  atlasHost,
  pathToFolderWithBundledResources,
  experimentAccession,
  experimentType,
  species,
  tabs
}) => {
  return (
    <Router history={hashHistory} >
        <Route path="/" component={makeContainer(tabs.map((tab)=>tab.name))}>
        <IndexRedirect to={tabs[0].name} />
        {
          tabs
          .map((tab)=> (
            <Route
              key={tab.name}
              path={tab.name}
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
                )} />
          ))
        }
        </Route>
    </Router>
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
