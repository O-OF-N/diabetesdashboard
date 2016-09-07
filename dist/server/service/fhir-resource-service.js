"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serverCall = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _constants = require('../util/constants');

var Constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serverCall = exports.serverCall = function serverCall() {
  return _axios2.default.get(Constants.OBSERVATIONS_FETCH_URL, { headers: Constants.AUTHORIZATION_HEADER });
};
//# sourceMappingURL=fhir-resource-service.js.map