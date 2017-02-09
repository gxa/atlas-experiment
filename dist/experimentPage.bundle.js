var experimentPage =
webpackJsonp_name_([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(146);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _ExperimentContainer = __webpack_require__(491);

	var _ExperimentContainer2 = _interopRequireDefault(_ExperimentContainer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.render = function (options) {

	    _reactDom2.default.render(_react2.default.createElement(_ExperimentContainer2.default, Object.assign({ atlasHost: options.atlasHost, experimentType: options.experimentType }, options.content || {})), typeof options.target === "string" ? document.getElementById(options.target) : options.target);
	};

/***/ },

/***/ 491:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(435);

	var _Heatmap = __webpack_require__(492);

	var _Heatmap2 = _interopRequireDefault(_Heatmap);

	var _ExperimentDesign = __webpack_require__(493);

	var _ExperimentDesign2 = _interopRequireDefault(_ExperimentDesign);

	var _ExternalResource = __webpack_require__(494);

	var _ExternalResource2 = _interopRequireDefault(_ExternalResource);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//coupled to ExperimentController.java
	var componentsPerTab = {
	  'heatmap': _Heatmap2.default,
	  'experiment-design': _ExperimentDesign2.default,
	  'external-resource': _ExternalResource2.default
	};

	var makeTab = function makeTab(name, props) {
	  // TODO use React.createElement instead so that you can set displayName?
	  var Tab = componentsPerTab[name];
	  return function () {
	    return _react2.default.createElement(Tab, props);
	  };
	};

	var makeContainer = function makeContainer(tabNames) {

	  return function (_ref) {
	    var children = _ref.children;
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'h3',
	        null,
	        'TABS below!'
	      ),
	      _react2.default.createElement(
	        'ul',
	        null,
	        tabNames.map(function (tabName) {
	          return _react2.default.createElement(
	            'li',
	            { key: tabName },
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { to: tabName, activeStyle: { color: "red" } },
	              tabName
	            )
	          );
	        })
	      ),
	      _react2.default.createElement(
	        'h3',
	        null,
	        'Children below!'
	      ),
	      children
	    );
	  };
	};

	var ExperimentContainerRouter = function ExperimentContainerRouter(_ref2) {
	  var atlasHost = _ref2.atlasHost,
	      experimentType = _ref2.experimentType,
	      tabs = _ref2.tabs;

	  return _react2.default.createElement(
	    _reactRouter.Router,
	    { history: _reactRouter.hashHistory },
	    _react2.default.createElement(
	      _reactRouter.Route,
	      { path: '/', component: makeContainer(tabs.map(function (tab) {
	          return tab.name;
	        })) },
	      _react2.default.createElement(_reactRouter.IndexRedirect, { to: tabs[0].name }),
	      tabs.map(function (tab) {
	        return _react2.default.createElement(_reactRouter.Route, {
	          key: tab.name,
	          path: tab.name,
	          component: makeTab(tab.type, Object.assign({ atlasHost: atlasHost, experimentType: experimentType }, tab.props)) });
	      })
	    )
	  );
	};

	// TODO custom validation for tabs to ensure
	// tabs nonempty
	// componentsPerTab.hasOwnProperty(tab.type)
	ExperimentContainerRouter.propTypes = {
	  atlasHost: _react2.default.PropTypes.string.isRequired,
	  experimentType: _react2.default.PropTypes.string.isRequired,
	  tabs: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
	    type: _react2.default.PropTypes.string.isRequired,
	    name: _react2.default.PropTypes.string.isRequired,
	    props: _react2.default.PropTypes.object.isRequired
	  })).isRequired
	};

	exports.default = ExperimentContainerRouter;

/***/ },

/***/ 492:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Heatmap = function Heatmap() {
	  return _react2.default.createElement(
	    'div',
	    null,
	    ' Hello I am heatmap '
	  );
	};

	Heatmap.propTypes = {};

	exports.default = Heatmap;

/***/ },

/***/ 493:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ExperimentDesign = function ExperimentDesign() {
	  return _react2.default.createElement(
	    'div',
	    null,
	    ' Hello I am ExperimentDesign '
	  );
	};

	ExperimentDesign.propTypes = {};

	exports.default = ExperimentDesign;

/***/ },

/***/ 494:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ExternalResource = function ExternalResource() {
	  return _react2.default.createElement(
	    'div',
	    null,
	    ' Hello I am ExternalResource '
	  );
	};

	ExternalResource.propTypes = {};

	exports.default = ExternalResource;

/***/ }

});