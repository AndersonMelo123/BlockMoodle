'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('next\\dist\\lib\\router\\index.js');

var _index2 = _interopRequireDefault(_index);

var _semanticUiReact = require('semantic-ui-react');

var _Layout = require('../../components/Layout');

var _Layout2 = _interopRequireDefault(_Layout);

var _factory = require('../../ethereum/factory');

var _factory2 = _interopRequireDefault(_factory);

var _web = require('../../ethereum/web3');

var _web2 = _interopRequireDefault(_web);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = 'C:\\Users\\Anderson Melo\\Documents\\MEGA\\UFRPE - MESTRADO\\blockchain\\BlockMoodle\\pages\\relatorios\\new.js?entry';

//import { Router } from '../../routes';

var RelatorioNew = function (_Component) {
    (0, _inherits3.default)(RelatorioNew, _Component);

    function RelatorioNew() {
        var _ref,
            _this2 = this;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, RelatorioNew);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = RelatorioNew.__proto__ || (0, _getPrototypeOf2.default)(RelatorioNew)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            descricao: '',
            errorMessage: '',
            loading: false,
            hash: ''
        }, _this.onSubmit = function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(event) {
                var accounts;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                event.preventDefault();

                                _this.setState({ loading: true, errorMessage: '' });

                                _context.prev = 2;
                                _context.next = 5;
                                return _web2.default.eth.getAccounts();

                            case 5:
                                accounts = _context.sent;

                                console.log('accounts', accounts);

                                _context.next = 9;
                                return _factory2.default.methods.createReport(_this.state.descricao, _this.state.hash).send({
                                    from: accounts[0]
                                });

                            case 9:

                                _index2.default.pushRoute('/');
                                _context.next = 15;
                                break;

                            case 12:
                                _context.prev = 12;
                                _context.t0 = _context['catch'](2);

                                _this.setState({ errorMessage: _context.t0.message });

                            case 15:

                                _this.setState({ loading: false });

                            case 16:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this2, [[2, 12]]);
            }));

            return function (_x) {
                return _ref2.apply(this, arguments);
            };
        }(), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(RelatorioNew, [{
        key: 'componentDidMount',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this.getProfile();

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function componentDidMount() {
                return _ref3.apply(this, arguments);
            }

            return componentDidMount;
        }()
    }, {
        key: 'getProfile',
        value: function getProfile() {
            var _this3 = this;

            fetch('/auth/profile').then(function (res) {
                return res.json();
            }).then(function (res) {
                return _this3.setState({ hash: res.chave });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            return _react2.default.createElement(_Layout2.default, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 55
                }
            }, _react2.default.createElement('h3', {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 56
                }
            }, 'Gerar Relat\xF3rio'), _react2.default.createElement(_semanticUiReact.Form, { onSubmit: this.onSubmit, error: !!this.state.errorMessage, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 58
                }
            }, _react2.default.createElement(_semanticUiReact.Form.Field, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 59
                }
            }, _react2.default.createElement('label', {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 60
                }
            }, 'Descri\xE7\xE3o'), _react2.default.createElement('div', { className: 'ui icon input', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 62
                }
            }, _react2.default.createElement('input', {
                style: { width: '50px' },
                type: 'text',
                placeholder: 'Descri\xE7\xE3o...',
                value: this.state.descricao,
                onChange: function onChange(event) {
                    return _this4.setState({ descricao: event.target.value });
                },
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 63
                }
            }), _react2.default.createElement('i', { 'aria-hidden': 'true', className: 'search icon', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 71
                }
            }))), _react2.default.createElement(_semanticUiReact.Message, { error: true, header: 'Oops!', content: this.state.errorMessage, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 75
                }
            }), _react2.default.createElement(_semanticUiReact.Button, { loading: this.state.loading, primary: true, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 76
                }
            }, 'Gerar')));
        }
    }]);

    return RelatorioNew;
}(_react.Component);

exports.default = RelatorioNew;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzXFxyZWxhdG9yaW9zXFxuZXcuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJSb3V0ZXIiLCJGb3JtIiwiQnV0dG9uIiwiSW5wdXQiLCJNZXNzYWdlIiwiTGF5b3V0IiwiZmFjdG9yeSIsIndlYjMiLCJSZWxhdG9yaW9OZXciLCJzdGF0ZSIsImRlc2NyaWNhbyIsImVycm9yTWVzc2FnZSIsImxvYWRpbmciLCJoYXNoIiwib25TdWJtaXQiLCJldmVudCIsInByZXZlbnREZWZhdWx0Iiwic2V0U3RhdGUiLCJldGgiLCJnZXRBY2NvdW50cyIsImFjY291bnRzIiwiY29uc29sZSIsImxvZyIsIm1ldGhvZHMiLCJjcmVhdGVSZXBvcnQiLCJzZW5kIiwiZnJvbSIsInB1c2hSb3V0ZSIsIm1lc3NhZ2UiLCJnZXRQcm9maWxlIiwiZmV0Y2giLCJ0aGVuIiwicmVzIiwianNvbiIsImNoYXZlIiwid2lkdGgiLCJ0YXJnZXQiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBQU8sQUFBUzs7OztBQUNoQixBQUFPOzs7O0FBQ1AsQUFBUyxBQUFNLEFBQVEsQUFBTzs7QUFDOUIsQUFBTyxBQUFZOzs7O0FBQ25CLEFBQU8sQUFBYTs7OztBQUNwQixBQUFPLEFBQVU7Ozs7Ozs7O0FBQ2pCOztJLEFBRU07Ozs7Ozs7Ozs7Ozs7Ozs0TixBQUVGO3VCQUFRLEFBQ08sQUFDWDswQkFGSSxBQUVVLEFBQ2Q7cUJBSEksQUFHSyxBQUNUO2tCQUpJLEFBSUUsQTtBQUpGLEFBQ0osaUIsQUFrQko7aUdBQVcsaUJBQUEsQUFBTSxPQUFOO29CQUFBOzhFQUFBOzhCQUFBO3lEQUFBO2lDQUNQO3NDQUFBLEFBQU0sQUFFTjs7c0NBQUEsQUFBSyxTQUFTLEVBQUUsU0FBRixBQUFXLE1BQU0sY0FIeEIsQUFHUCxBQUFjLEFBQStCOztnREFIdEM7Z0RBQUE7dUNBTW9CLGNBQUEsQUFBSyxJQU56QixBQU1vQixBQUFTOztpQ0FBMUI7QUFOSCxvREFRSDs7d0NBQUEsQUFBUSxJQUFSLEFBQVksWUFSVCxBQVFILEFBQXdCOztnREFSckI7eURBVUcsQUFBUSxRQUFSLEFBQWdCLGFBQWEsTUFBQSxBQUFLLE1BQWxDLEFBQXdDLFdBQVcsTUFBQSxBQUFLLE1BQXhELEFBQThELE1BQTlELEFBQW9FOzBDQUNsRSxTQVhMLEFBVUcsQUFBeUUsQUFDdkUsQUFBUztBQUQ4RCxBQUM3RSxpQ0FESTs7aUNBSU47O2dEQUFBLEFBQU8sVUFkSixBQWNILEFBQWlCO2dEQWRkO0FBQUE7O2lDQUFBO2dEQUFBO2dFQWdCSDs7c0NBQUEsQUFBSyxTQUFTLEVBQUUsY0FBYyxZQWhCM0IsQUFnQkgsQUFBYyxBQUFvQjs7aUNBR3RDOztzQ0FBQSxBQUFLLFNBQVMsRUFBRSxTQW5CVCxBQW1CUCxBQUFjLEFBQVc7O2lDQW5CbEI7aUNBQUE7Z0RBQUE7O0FBQUE7eUNBQUE7QTs7Ozs7Ozs7Ozs7Ozs7O2lDQVhQO3FDQUFBLEFBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQ0FHSTt5QkFDVDs7a0JBQUEsQUFBTSxpQkFBTixBQUNDLEtBQUssZUFBQTt1QkFBTyxJQUFQLEFBQU8sQUFBSTtBQURqQixlQUFBLEFBRUMsS0FBSyxlQUFPLEFBQ1g7dUJBQU8sT0FBQSxBQUFLLFNBQVMsRUFBQyxNQUFNLElBQTVCLEFBQU8sQUFBYyxBQUFXLEFBQ2pDO0FBSkQsQUFLRDs7OztpQ0F3Qk07eUJBRUw7O21DQUNJLEFBQUM7OzhCQUFEO2dDQUFBLEFBQ0k7QUFESjtBQUFBLGFBQUEsa0JBQ0ksY0FBQTs7OEJBQUE7Z0NBQUE7QUFBQTtBQUFBLGVBREosQUFDSSxBQUVBLHVDQUFBLEFBQUMsdUNBQUssVUFBVSxLQUFoQixBQUFxQixVQUFVLE9BQU8sQ0FBQyxDQUFDLEtBQUEsQUFBSyxNQUE3QyxBQUFtRDs4QkFBbkQ7Z0NBQUEsQUFDSTtBQURKOytCQUNLLGNBQUQsc0JBQUEsQUFBTTs7OEJBQU47Z0NBQUEsQUFDSTtBQURKO0FBQUEsK0JBQ0ksY0FBQTs7OEJBQUE7Z0NBQUE7QUFBQTtBQUFBLGVBREosQUFDSSxBQUVBLG9DQUFBLGNBQUEsU0FBSyxXQUFMLEFBQWU7OEJBQWY7Z0NBQUEsQUFDSTtBQURKOzt1QkFFZSxFQUFDLE9BRFosQUFDVyxBQUFRLEFBQ2Y7c0JBRkosQUFFUyxBQUNMOzZCQUhKLEFBR2dCLEFBQ1o7dUJBQU8sS0FBQSxBQUFLLE1BSmhCLEFBSXNCLEFBQ2xCOzBCQUFVLHlCQUFBOzJCQUNOLE9BQUEsQUFBSyxTQUFTLEVBQUUsV0FBVyxNQUFBLEFBQU0sT0FEM0IsQUFDTixBQUFjLEFBQTBCO0FBTmhEOzs4QkFBQTtnQ0FESixBQUNJLEFBUUE7QUFSQTtBQUNJLHFEQU9ELGVBQUgsQUFBZSxRQUFPLFdBQXRCLEFBQWdDOzhCQUFoQztnQ0FiWixBQUNJLEFBR0ksQUFTSSxBQUlSO0FBSlE7a0NBSVIsQUFBQywwQ0FBUSxPQUFULE1BQWUsUUFBZixBQUFzQixTQUFRLFNBQVMsS0FBQSxBQUFLLE1BQTVDLEFBQWtEOzhCQUFsRDtnQ0FqQkosQUFpQkksQUFDQTtBQURBO2dDQUNBLEFBQUMseUNBQU8sU0FBUyxLQUFBLEFBQUssTUFBdEIsQUFBNEIsU0FBUyxTQUFyQzs4QkFBQTtnQ0FBQTtBQUFBO2VBdEJaLEFBQ0ksQUFHSSxBQWtCSSxBQUlmOzs7OztBQXZFc0IsQSxBQTBFM0I7O2tCQUFBLEFBQWUiLCJmaWxlIjoibmV3LmpzP2VudHJ5Iiwic291cmNlUm9vdCI6IkM6L1VzZXJzL0FuZGVyc29uIE1lbG8vRG9jdW1lbnRzL01FR0EvVUZSUEUgLSBNRVNUUkFETy9ibG9ja2NoYWluL0Jsb2NrTW9vZGxlIn0=