"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.css = exports.responsive = void 0;

var _lodash = _interopRequireDefault(require("lodash.get"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var defaultBreakpoints = [40, 52, 64].map(function (n) {
  return n + 'em';
}); // for compatibility with current version

var defaultTheme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72]
};
var aliases = {
  bg: 'backgroundColor',
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mx: ['marginLeft', 'marginRight'],
  my: ['marginTop', 'marginBottom'],
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  px: ['paddingLeft', 'paddingRight'],
  py: ['paddingTop', 'paddingBottom']
};
var scales = {
  color: 'colors',
  backgroundColor: 'colors',
  borderColor: 'colors',
  margin: 'space',
  marginTop: 'space',
  marginRight: 'space',
  marginBottom: 'space',
  marginLeft: 'space',
  padding: 'space',
  paddingTop: 'space',
  paddingRight: 'space',
  paddingBottom: 'space',
  paddingLeft: 'space',
  fontFamily: 'fonts',
  fontSize: 'fontSizes',
  fontWeight: 'fontWeights',
  lineHeight: 'lineHeights',
  letterSpacing: 'letterSpacings',
  border: 'borders',
  borderTop: 'borders',
  borderRight: 'borders',
  borderBottom: 'borders',
  borderLeft: 'borders',
  borderWidth: 'borderWidths',
  borderStyle: 'borderStyles',
  borderRadius: 'radii',
  boxShadow: 'shadows',
  zIndex: 'zIndices',
  // new/breaking
  width: 'sizes',
  minWidth: 'sizes',
  maxWidth: 'sizes',
  height: 'sizes',
  minHeight: 'sizes',
  maxHeight: 'sizes'
};

var responsive = function responsive(styles) {
  return function (theme) {
    var next = {};
    var breakpoints = (0, _lodash.default)(theme, 'breakpoints', ['40em', '52em', '64em']);
    var mediaQueries = [null].concat(_toConsumableArray(breakpoints.map(function (n) {
      return "@media screen and (min-width: ".concat(n, ")");
    })));

    var _loop = function _loop(key) {
      var value = styles[key];

      if (value && !Array.isArray(value) && _typeof(value) === 'object') {
        next[key] = responsive(value)(theme);
        return "continue";
      }

      if (!Array.isArray(value)) {
        next[key] = value;
        return "continue";
      }

      value.forEach(function (val, i) {
        var media = mediaQueries[i];

        if (!media) {
          next[key] = val;
          return;
        }

        next[media] = next[media] || {};
        next[media][key] = val;
      });
    };

    for (var key in styles) {
      var _ret = _loop(key);

      if (_ret === "continue") continue;
    }

    return next;
  };
};

exports.responsive = responsive;

var css = function css(args) {
  return function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var theme = _objectSpread({}, defaultTheme, props.theme || props);

    var result = {};
    var obj = typeof args === 'function' ? args(theme) : args;
    var styles = responsive(obj)(theme);

    var _loop2 = function _loop2(key) {
      var prop = aliases[key] || key;
      var scaleName = scales[prop] || scales[prop[0]];
      var scale = (0, _lodash.default)(theme, scaleName, (0, _lodash.default)(theme, prop, {}));
      var x = styles[key]; // hot new shit

      var val = typeof x === 'function' ? x(theme) : x;

      if (val && _typeof(val) === 'object') {
        result[prop] = css(val)(theme);
        return "continue";
      }

      var value = (0, _lodash.default)(scale, val, val);

      if (Array.isArray(prop)) {
        prop.forEach(function (p) {
          result[p] = value;
        });
      } else {
        result[prop] = value;
      }
    };

    for (var key in styles) {
      var _ret2 = _loop2(key);

      if (_ret2 === "continue") continue;
    }

    return result;
  };
};

exports.css = css;
var _default = css;
exports.default = _default;
