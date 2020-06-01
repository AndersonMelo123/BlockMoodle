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

var _semanticUiReact = require('semantic-ui-react');

var _factory = require('../ethereum/factory');

var _factory2 = _interopRequireDefault(_factory);

var _Layout = require('../components/Layout');

var _Layout2 = _interopRequireDefault(_Layout);

var _routes = require('../routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = 'C:\\Users\\Anderson Melo\\Documents\\MEGA\\UFRPE - MESTRADO\\blockchain\\BlockMoodle\\pages\\index.js?entry';


var CampaignIndex = function (_Component) {
    (0, _inherits3.default)(CampaignIndex, _Component);

    function CampaignIndex() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, CampaignIndex);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = CampaignIndex.__proto__ || (0, _getPrototypeOf2.default)(CampaignIndex)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            length: '',
            docs: []

            /*async componentDidMount() {
                const length = await factory.methods.getLength().call();
                  this.setState({length});
                  try {
                    let docs = [];
                    for (let i = 0; i < length; i++) {
                    
                        const file = await factory.methods.getDoc(i).call();
                        
                        //console.log('ddddddddddd', JSON.stringify(file));
                          docs.push(JSON.stringify(file));
                          //console.log('=========================================', docs);
                          this.setState({ docs });
                    }
                    } catch (error) {
                    console.log('mmmmmmm', error);
                }
            }*/

        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(CampaignIndex, [{
        key: 'renderCampaigns',
        value: function renderCampaigns() {

            console.log('Aqui', this.props.docs[0]);

            var items = this.props.docs.map(function (address) {

                var d = new Date(address.timestamp * 1000);
                var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                var data = d.getDate() + '/' + months[d.getMonth()] + '/' + d.getFullYear() + ' às ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                return {
                    header: address.description,
                    description: address.doc,
                    meta: data,
                    fluid: true
                };
            });

            return _react2.default.createElement(_semanticUiReact.Card.Group, { items: items, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 71
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_Layout2.default, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 79
                }
            }, _react2.default.createElement('div', {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 80
                }
            }, _react2.default.createElement('h3', {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 81
                }
            }, 'Relat\xF3rios'), _react2.default.createElement(_routes.Link, { route: '/relatorios/new', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 83
                }
            }, _react2.default.createElement('a', {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 84
                }
            }, _react2.default.createElement(_semanticUiReact.Button, {
                floated: 'right',
                content: 'Gerar Relat\xF3rio',
                icon: 'add',
                primary: true,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 85
                }
            }))), this.renderCampaigns()));
        }
    }], [{
        key: 'getInitialProps',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var length, docs, i, file;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _factory2.default.methods.getLength().call();

                            case 2:
                                length = _context.sent;
                                docs = [];
                                i = 0;

                            case 5:
                                if (!(i < length)) {
                                    _context.next = 13;
                                    break;
                                }

                                _context.next = 8;
                                return _factory2.default.methods.docs(i).call();

                            case 8:
                                file = _context.sent;

                                docs.push(file);

                            case 10:
                                i++;
                                _context.next = 5;
                                break;

                            case 13:
                                return _context.abrupt('return', { docs: docs });

                            case 14:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getInitialProps() {
                return _ref2.apply(this, arguments);
            }

            return getInitialProps;
        }()
    }]);

    return CampaignIndex;
}(_react.Component);

exports.default = CampaignIndex;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzXFxpbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIkNhcmQiLCJCdXR0b24iLCJmYWN0b3J5IiwiTGF5b3V0IiwiTGluayIsIkNhbXBhaWduSW5kZXgiLCJzdGF0ZSIsImxlbmd0aCIsImRvY3MiLCJjb25zb2xlIiwibG9nIiwicHJvcHMiLCJpdGVtcyIsIm1hcCIsImQiLCJEYXRlIiwiYWRkcmVzcyIsInRpbWVzdGFtcCIsIm1vbnRocyIsImRhdGEiLCJnZXREYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsImdldEhvdXJzIiwiZ2V0TWludXRlcyIsImdldFNlY29uZHMiLCJoZWFkZXIiLCJkZXNjcmlwdGlvbiIsImRvYyIsIm1ldGEiLCJmbHVpZCIsInJlbmRlckNhbXBhaWducyIsIm1ldGhvZHMiLCJnZXRMZW5ndGgiLCJjYWxsIiwiaSIsImZpbGUiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFBTyxBQUFTOzs7O0FBQ2hCLEFBQVMsQUFBTTs7QUFDZixBQUFPLEFBQWE7Ozs7QUFDcEIsQUFBTyxBQUFZOzs7O0FBQ25CLEFBQVMsQUFBWTs7Ozs7OztJQUVmLEE7Ozs7Ozs7Ozs7Ozs7OzhOQUVGLEE7b0JBQVEsQUFDSSxBQUNSO2tCQUFNLEFBR1Y7O0EsQUFMUTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBQ0o7Ozs7OzBDQTRDYyxBQUVkOztvQkFBQSxBQUFRLElBQVIsQUFBWSxRQUFRLEtBQUEsQUFBSyxNQUFMLEFBQVcsS0FBL0IsQUFBb0IsQUFBZ0IsQUFFcEM7O2dCQUFNLGFBQVEsQUFBSyxNQUFMLEFBQVcsS0FBWCxBQUFnQixJQUFJLG1CQUFXLEFBRXpDOztvQkFBSSxJQUFJLElBQUEsQUFBSSxLQUFLLFFBQUEsQUFBUSxZQUF6QixBQUFRLEFBQTRCLEFBQzdDO29CQUFJLFNBQVMsQ0FBQSxBQUFDLE9BQUQsQUFBTyxPQUFQLEFBQWEsT0FBYixBQUFtQixPQUFuQixBQUF5QixPQUF6QixBQUErQixPQUEvQixBQUFxQyxPQUFyQyxBQUEyQyxPQUEzQyxBQUFpRCxPQUFqRCxBQUF1RCxPQUF2RCxBQUE2RCxPQUExRSxBQUFhLEFBQW1FLEFBQ2hGO29CQUFJLE9BQU8sRUFBQSxBQUFFLFlBQUYsQUFBYSxNQUFLLE9BQU8sRUFBekIsQUFBa0IsQUFBTyxBQUFFLGNBQTNCLEFBQXdDLE1BQUssRUFBN0MsQUFBNkMsQUFBRSxnQkFBL0MsQUFBNkQsU0FBUSxFQUFyRSxBQUFxRSxBQUFFLGFBQXZFLEFBQWtGLE1BQUksRUFBdEYsQUFBc0YsQUFBRSxlQUF4RixBQUFxRyxNQUFJLEVBQXBILEFBQW9ILEFBQUUsQUFDN0c7OzRCQUNVLFFBREgsQUFDVyxBQUNoQjtpQ0FBYSxRQUZSLEFBRWdCLEFBQ3JCOzBCQUhLLEFBR0MsQUFDTjsyQkFKRixBQUFPLEFBSUUsQUFFWjtBQU5VLEFBQ0w7QUFOTixBQUFjLEFBYWQsYUFiYzs7aURBYVAsQUFBQyxzQkFBRCxBQUFNLFNBQU0sT0FBWixBQUFtQjs4QkFBbkI7Z0NBQVAsQUFBTyxBQUVWO0FBRlU7YUFBQTs7OztpQ0FLRixBQUNMO21DQUVBLEFBQUM7OzhCQUFEO2dDQUFBLEFBQ0k7QUFESjtBQUFBLGFBQUEsa0JBQ0ksY0FBQTs7OEJBQUE7Z0NBQUEsQUFDSTtBQURKO0FBQUEsK0JBQ0ksY0FBQTs7OEJBQUE7Z0NBQUE7QUFBQTtBQUFBLGVBREosQUFDSSxBQUVBLGtDQUFBLEFBQUMsOEJBQUssT0FBTixBQUFZOzhCQUFaO2dDQUFBLEFBQ0k7QUFESjsrQkFDSSxjQUFBOzs4QkFBQTtnQ0FBQSxBQUNJO0FBREo7QUFBQSwrQkFDSSxBQUFDO3lCQUFELEFBQ1ksQUFDUjt5QkFGSixBQUVZLEFBQ1I7c0JBSEosQUFHUyxBQUNMO3lCQUpKOzs4QkFBQTtnQ0FMWixBQUdJLEFBQ0ksQUFDSSxBQVdQO0FBWE87QUFDSSx1QkFUcEIsQUFFQSxBQUNJLEFBZ0JLLEFBQUssQUFLakI7Ozs7Ozs7Ozs7Ozt1Q0E1RHdCLGtCQUFBLEFBQVEsUUFBUixBQUFnQixZQUFoQixBQUE0QixBOztpQ0FBM0M7QSxrREFFRjtBLHVDQUFPLEFBQ0YsQTtBLG9DQUFJLEE7OztzQ0FBRyxJQUFJLEE7Ozs7Ozt1Q0FFRyxrQkFBQSxBQUFRLFFBQVIsQUFBZ0IsS0FBaEIsQUFBcUIsR0FBckIsQUFBd0IsQTs7aUNBQXJDO0EsZ0RBRU47O3FDQUFBLEFBQUssS0FBTCxBQUFVOztpQ0FKYztBOzs7OztpRUFPckIsRUFBRSxNQUFGLEE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE1Q2EsQSxBQWlHNUI7O2tCQUFBLEFBQWUiLCJmaWxlIjoiaW5kZXguanM/ZW50cnkiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvQW5kZXJzb24gTWVsby9Eb2N1bWVudHMvTUVHQS9VRlJQRSAtIE1FU1RSQURPL2Jsb2NrY2hhaW4vQmxvY2tNb29kbGUifQ==