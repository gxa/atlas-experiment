import React from 'react'

import { hashHistory,Router, Route, Link, IndexRedirect, withRouter } from 'react-router'
import { configureUrlQuery } from 'react-url-query'

import Heatmap from './tabs/heatmap/Main.jsx'
import ExperimentDesign from './tabs/ExperimentDesign.jsx'
import ExternalResource from './tabs/ExternalResource.jsx'

configureUrlQuery({
  history: hashHistory,
  addRouterParams: true,
});


//coupled to ExperimentController.java
const componentsPerTab = {
  'heatmap' : Heatmap,
  'experiment-design' : ExperimentDesign,
  'external-resource' : ExternalResource
}

const makeTab = (name, props) => {
  const Tab = componentsPerTab[name]
  return () => (
    <Tab {...props} />
  )
}

const makeContainer = (tabNames) => {

  return ({children}) => (
    <div>
      <h3>TABS below!</h3>
      <ul>
        {tabNames.map(tabName => (
          <li key={tabName}>
            <Link to={tabName} activeStyle={{color:"red"}}>
              {tabName}
            </Link>
          </li>
        ))}
      </ul>

      <h3>Children below!</h3>
        {children}
    </div>
  )
}

const ExperimentContainerRouter = ({
  atlasHost,
  experimentType,
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
              component={makeTab(tab.type, Object.assign({atlasHost, experimentType},tab.props))} />
          ))
        }
        </Route>
    </Router>
  )
}

// TODO custom validation for tabs to ensure
// tabs nonempty
// componentsPerTab.hasOwnProperty(tab.type)
ExperimentContainerRouter.propTypes = {
  atlasHost: React.PropTypes.string.isRequired,
  experimentType: React.PropTypes.string.isRequired,
  tabs: React.PropTypes.arrayOf(React.PropTypes.shape({
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    props: React.PropTypes.object.isRequired
  })).isRequired
}

export default ExperimentContainerRouter;
