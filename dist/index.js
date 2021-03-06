'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _reactSideEffect = require('react-side-effect');

var _reactSideEffect2 = _interopRequireDefault(_reactSideEffect);

var _utils = require('./utils');

var _dom = require('./dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function reducePropsTostate(propsList) {
  var props = {};

  var extend = true;

  for (var i = propsList.length - 1; extend && i >= 0; i--) {
    extend = propsList[i].hasOwnProperty('extend');

    var _props = (0, _utils.clone)(propsList[i]);

    if (_props.hasOwnProperty('description')) {
      (0, _utils.defaults)(_props, { meta: { name: { description: _props.description } } });
    }
    if (_props.hasOwnProperty('canonical')) {
      (0, _utils.defaults)(_props, { link: { rel: { canonical: _props.canonical } } });
    }

    (0, _utils.defaults)(props, _props);
  }

  // Auto props
  if (props.auto) {
    if (props.auto.ograph) {
      ograph(props);
    }
  }

  return props;
}

function handleStateChangeOnClient(props) {
  if (_dom.canUseDOM) {
    document.title = props.title || '';
    (0, _dom.insertDocumentMeta)(getTags(props));
  }
}

function ograph(p) {
  if (!p.meta) {
    p.meta = {};
  }
  if (!p.meta.property) {
    p.meta.property = {};
  }

  var group = p.meta.property;
  if (group) {
    if (p.title && !group['og:title']) {
      group['og:title'] = p.title;
    }
    if (p.hasOwnProperty('description') && !group['og:description']) {
      group['og:description'] = p.description;
    }
    if (p.hasOwnProperty('canonical') && !group['og:url']) {
      group['og:url'] = p.canonical;
    }
  }
  return p;
}

function parseTags(tagName) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var tags = [];
  var contentKey = tagName === 'link' ? 'href' : 'content';
  Object.keys(props).forEach(function (groupKey) {
    var group = props[groupKey];
    if (typeof group === 'string') {
      tags.push(_defineProperty({
        tagName: tagName
      }, groupKey, group));
      return;
    }
    Object.keys(group).forEach(function (key) {
      var values = Array.isArray(group[key]) ? group[key] : [group[key]];
      values.forEach(function (value) {
        if (value !== null) {
          var _tags$push2;

          tags.push((_tags$push2 = {
            tagName: tagName
          }, _defineProperty(_tags$push2, groupKey, key), _defineProperty(_tags$push2, contentKey, value), _tags$push2));
        }
      });
    });
  });
  return tags;
}

function getTags(_props) {
  return [].concat(parseTags('meta', _props.meta), parseTags('link', _props.link));
}

function render() {
  var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var opts = arguments[1];

  if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') {
    return meta;
  }

  var i = 0;
  var tags = [];

  function renderTag(entry) {
    var tagName = entry.tagName,
        attr = _objectWithoutProperties(entry, ['tagName']);

    if (tagName === 'meta') {
      return _react2.default.createElement('meta', _extends({}, attr, { key: i++, 'data-rdm': true }));
    }
    if (tagName === 'link') {
      return _react2.default.createElement('link', _extends({}, attr, { key: i++, 'data-rdm': true }));
    }
    return null;
  }

  if (meta.title) {
    tags.push(_react2.default.createElement(
      'title',
      { key: i++ },
      meta.title
    ));
  }

  getTags(meta).reduce(function (acc, entry) {
    tags.push(renderTag(entry));
    return tags;
  }, tags);

  if (opts.asReact) {
    return tags;
  }

  return (0, _server.renderToStaticMarkup)(_react2.default.createElement(
    'div',
    null,
    tags
  )).replace(/(^<div>|<\/div>$)/g, '').replace(/data-rdm="true"/g, 'data-rdm');
}

var DocumentMeta = function (_Component) {
  _inherits(DocumentMeta, _Component);

  function DocumentMeta() {
    _classCallCheck(this, DocumentMeta);

    return _possibleConstructorReturn(this, (DocumentMeta.__proto__ || Object.getPrototypeOf(DocumentMeta)).apply(this, arguments));
  }

  _createClass(DocumentMeta, [{
    key: 'render',
    value: function render() {
      var children = this.props.children;

      var count = _react2.default.Children.count(children);
      return count === 1 ? _react2.default.Children.only(children) : count ? _react2.default.createElement(
        'div',
        null,
        this.props.children
      ) : null;
    }
  }]);

  return DocumentMeta;
}(_react.Component);

DocumentMeta.propTypes = {
  title: _react.PropTypes.string,
  description: _react.PropTypes.string,
  base: _react.PropTypes.string,
  canonical: _react.PropTypes.string,
  meta: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.string)]))])),
  link: _react.PropTypes.objectOf(_react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.string)]))),
  auto: _react.PropTypes.objectOf(_react.PropTypes.bool)
};


var DocumentMetaWithSideEffect = (0, _reactSideEffect2.default)(reducePropsTostate, handleStateChangeOnClient)(DocumentMeta);

DocumentMetaWithSideEffect.renderAsReact = function rewindAsReact() {
  return render(DocumentMetaWithSideEffect.rewind(), { asReact: true });
};

DocumentMetaWithSideEffect.renderAsHTML = function rewindAsHTML() {
  return render(DocumentMetaWithSideEffect.rewind(), { asHtml: true });
};

DocumentMetaWithSideEffect.renderToStaticMarkup = function rewindAsHTML() {
  return render(DocumentMetaWithSideEffect.rewind(), { asHtml: true });
};

exports.default = DocumentMetaWithSideEffect;
module.exports = exports['default'];
