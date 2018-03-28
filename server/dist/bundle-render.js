module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _overallRatings = __webpack_require__(4);

var _overallRatings2 = _interopRequireDefault(_overallRatings);

var _restaurants = __webpack_require__(5);

var _restaurants2 = _interopRequireDefault(_restaurants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      id: props.id,
      data: []
    };
    _this.fetch = _this.fetch.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.fetch();
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      var _this2 = this;

      // const env = process.env.aws ? process.env.aws : '';
      _jquery2.default.ajax({
        url: '/restaurants/' + this.state.id + '/reviews',
        method: 'GET',
        success: function success(data) {
          _this2.setState({
            data: data
          });
        },
        error: function error(_error) {
          console.log('error: ', _error);
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_overallRatings2.default, { restaurants: this.state.data }),
        _react2.default.createElement(_restaurants2.default, { restaurantsList: this.state.data })
      );
    }
  }]);

  return App;
}(_react2.default.Component);

App.propTypes = {
  id: _propTypes2.default.number.isRequired
};

exports.default = App;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("jquery");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OverallRatings = function OverallRatings(_ref) {
  var restaurants = _ref.restaurants;
  return _react2.default.createElement(
    'div',
    null,
    restaurants.map(function (restaurant) {
      var reviews = restaurant.restaurantReviews;
      var revNum = reviews.length;
      var avgRating = reviews.length > 0 ? reviews.reduce(function (acc, item) {
        return acc + item.rating;
      }, 0) / reviews.length : 'N/A';
      var foodRating = avgRating === 'N/A' ? 'N/A' : (avgRating + (Math.random() - 0.5)).toFixed(1);
      var serviceRating = avgRating === 'N/A' ? 'N/A' : (avgRating + (Math.random() - 0.5)).toFixed(1);
      var ambienceRating = avgRating === 'N/A' ? 'N/A' : (avgRating + (Math.random() - 0.5)).toFixed(1);
      var valueRating = avgRating === 'N/A' ? 'N/A' : (avgRating + (Math.random() - 0.5)).toFixed(1);
      var pctRecommend = Math.floor(70 + Math.random() * 30);
      var noiseLevel = ['Quiet', 'Moderate', 'Loud'][restaurant.restaurantId % 3];
      var imgString = 'data:image/png;base64,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';

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'restaurantName' },
          _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement('img', { src: imgString, alt: 'logo' })
          ),
          restaurant.restaurantName,
          ' Ratings and Reviews',
          _react2.default.createElement(
            'div',
            { className: 'overallrating' },
            _react2.default.createElement(
              'span',
              { className: 'graph' },
              _react2.default.createElement(
                'ul',
                { className: 'bargraph' },
                '5',
                _react2.default.createElement('li', { className: 'reddeep' }),
                '4',
                _react2.default.createElement('li', { className: 'redpink' }),
                '3',
                _react2.default.createElement('li', { className: 'pink' }),
                '2',
                _react2.default.createElement('li', { className: 'orangered' }),
                '1',
                _react2.default.createElement('li', { className: 'orange' })
              )
            ),
            _react2.default.createElement(
              'span',
              { className: 'ratingNum' },
              avgRating === 'N/A' ? 'N/A' : avgRating.toFixed(1)
            ),
            _react2.default.createElement(
              'span',
              { className: 'overall' },
              'Overall Rating'
            ),
            _react2.default.createElement(
              'div',
              { className: 'stars' },
              _react2.default.createElement(
                'span',
                null,
                '\u2606'
              ),
              _react2.default.createElement(
                'span',
                null,
                '\u2605'
              ),
              _react2.default.createElement(
                'span',
                null,
                '\u2605'
              ),
              _react2.default.createElement(
                'span',
                null,
                '\u2605'
              ),
              _react2.default.createElement(
                'span',
                null,
                '\u2605'
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'mood' },
              _react2.default.createElement(
                'span',
                null,
                'Food: ',
                foodRating
              ),
              '| ',
              _react2.default.createElement(
                'span',
                null,
                'Service: ',
                serviceRating
              ),
              '| ',
              _react2.default.createElement(
                'span',
                null,
                'Ambience: ',
                ambienceRating
              ),
              '| ',
              _react2.default.createElement(
                'span',
                null,
                'Value: ',
                valueRating
              ),
              '| ',
              _react2.default.createElement(
                'span',
                null,
                'Noise: ',
                noiseLevel
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'recommendText' },
              _react2.default.createElement('i', { className: 'glyphicon glyphicon-thumbs-up' }),
              pctRecommend,
              '% would recommend it to a friend'
            ),
            _react2.default.createElement(
              'div',
              { className: 'reviewsCount' },
              revNum,
              ' review',
              revNum !== 1 ? 's' : ''
            )
          )
        )
      );
    })
  );
};

OverallRatings.propTypes = {
  restaurants: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired
};

exports.default = OverallRatings;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reviewsList = __webpack_require__(6);

var _reviewsList2 = _interopRequireDefault(_reviewsList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Restaurants = function Restaurants(props) {
  return _react2.default.createElement(
    'div',
    null,
    props.restaurantsList.map(function (restaurant) {
      return _react2.default.createElement(_reviewsList2.default, { reviews: restaurant.restaurantReviews });
    })
  );
};

exports.default = Restaurants;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reviewEntry = __webpack_require__(7);

var _reviewEntry2 = _interopRequireDefault(_reviewEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReviewsList = function ReviewsList(props) {
  return _react2.default.createElement(
    'div',
    null,
    props.reviews.map(function (review) {
      return _react2.default.createElement(_reviewEntry2.default, { review: review });
    })
  );
};

exports.default = ReviewsList;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReviewEntry = function ReviewEntry(_ref) {
  var review = _ref.review;

  var imgString = 'data:image/png;base64,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';
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      { className: 'ratings' },
      _react2.default.createElement(
        'span',
        null,
        '\u2605'
      ),
      _react2.default.createElement(
        'span',
        null,
        '\u2605'
      ),
      _react2.default.createElement(
        'span',
        null,
        '\u2605'
      ),
      _react2.default.createElement(
        'span',
        null,
        '\u2605'
      ),
      _react2.default.createElement(
        'span',
        null,
        '\u2606'
      ),
      '| Rating: ',
      review.rating,
      '| Username: ',
      review.username,
      '| City: ',
      review.city,
      '| Dined on ',
      review.dinedDate.slice(0, 10)
    ),
    _react2.default.createElement(
      'div',
      { className: 'review' },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement('img', { src: imgString, alt: 'logo' })
      ),
      review.review,
      _react2.default.createElement(
        'div',
        { className: 'wasThisUseful' },
        'Was this review useful to you?',
        _react2.default.createElement(
          'span',
          null,
          ' Yes. No. Report'
        )
      )
    )
  );
};

ReviewEntry.propTypes = {
  review: _propTypes2.default.shape({
    rating: _propTypes2.default.number,
    username: _propTypes2.default.string,
    city: _propTypes2.default.string,
    dinedDate: _propTypes2.default.string
  }).isRequired
};

exports.default = ReviewEntry;

/***/ })
/******/ ]);