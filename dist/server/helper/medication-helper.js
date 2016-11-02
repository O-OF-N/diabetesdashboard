"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchMedications = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _models = require('../models/models');

var Records = _interopRequireWildcard(_models);

var _immutable = require('immutable');

var _constants = require('../util/constants');

var Constants = _interopRequireWildcard(_constants);

var _httpService = require('../service/http-service');

var _httpUtils = require('../util/http-utils');

var HttpUtil = _interopRequireWildcard(_httpUtils);

var _UserAuthenticationSchema = require('../models/UserAuthenticationSchema');

var _UserAuthenticationSchema2 = _interopRequireDefault(_UserAuthenticationSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//public functions
var fetchMedications = exports.fetchMedications = regeneratorRuntime.mark(function fetchMedications(state) {
    var result, insulinOrders;
    return regeneratorRuntime.wrap(function fetchMedications$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    return _context.delegateYield(fetchMedicationsHelper(state), 't0', 1);

                case 1:
                    result = _context.t0;
                    insulinOrders = HttpUtil.checkResponseStatus(result) ? buildInsulinOrdersResult(result) : null;
                    return _context.abrupt('return', insulinOrders ? categorizeOrders(insulinOrders) : null);

                case 4:
                case 'end':
                    return _context.stop();
            }
        }
    }, fetchMedications, this);
});

//Private functions
var fetchMedicationsHelper = regeneratorRuntime.mark(function fetchMedicationsHelper(state) {
    var _ref, _ref2, userAuthenticationModel, url, authHeader, result;

    return regeneratorRuntime.wrap(function fetchMedicationsHelper$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return _UserAuthenticationSchema2.default.findByState(state);

                case 2:
                    _ref = _context2.sent;
                    _ref2 = _slicedToArray(_ref, 1);
                    userAuthenticationModel = _ref2[0];
                    url = HttpUtil.buildMedicationURL(userAuthenticationModel.patient, userAuthenticationModel.iss);
                    authHeader = HttpUtil.buildAuthorizationHeader(userAuthenticationModel);
                    _context2.next = 9;
                    return (0, _httpService.get)(url, authHeader);

                case 9:
                    result = _context2.sent;
                    return _context2.abrupt('return', result);

                case 11:
                case 'end':
                    return _context2.stop();
            }
        }
    }, fetchMedicationsHelper, this);
});

var buildInsulinOrdersResult = function buildInsulinOrdersResult(json) {
    var insulinOrder = json.data && json.data.entry ? json.data.entry.map(function (entry) {
        var insulin = null;
        var status = void 0,
            prescriber = void 0,
            dateWritten = void 0,
            dosageInstruction = void 0,
            medicationReference = void 0,
            medicationCodeableConcept = void 0;
        if (entry && entry.resource) {
            var resource = entry.resource;
            status = resource.status;
            prescriber = resource.prescriber;
            dateWritten = resource.dateWritten;
            dosageInstruction = resource.dosageInstruction;
            medicationCodeableConcept = resource.medicationCodeableConcept;

            var medication = fetchMedicationFromResource(medicationCodeableConcept);
            insulin = medication ? new Records.InsulinOrder({
                status: status,
                date: dateWritten,
                dosage: dosageInstruction && dosageInstruction instanceof Array && dosageInstruction[0] ? dosageInstruction[0].text : null,
                medication: medication.name,
                administration: fetchMedicationAdministration(dosageInstruction),
                code: parseInt(medication.code),
                comments: dosageInstruction && dosageInstruction instanceof Array && dosageInstruction[0] ? dosageInstruction[0].additionalInstructions : null
            }) : null;
        };
        return insulin;
    }).filter(function (entry) {
        return entry ? true : false;
    }) : null;
    return (0, _immutable.List)(insulinOrder);
};

var fetchMedicationFromResource = function fetchMedicationFromResource(concept) {
    return concept ? { name: concept.text, code: concept.coding ? concept.coding.filter(function (codes) {
            return codes.system === Constants.RXNORM_URL;
        })[0].code : null } : null;
};

var fetchMedicationAdministration = function fetchMedicationAdministration(dosage) {
    return dosage && dosage instanceof Array && dosage[0] && dosage[0].route && dosage[0].route.coding && dosage[0].route.coding instanceof Array && dosage[0].route.coding[0] ? dosage[0].route.coding[0].code === Constants.SUBCUTANEOUS ? Constants.SUBCUTANEOUS_TEXT : Constants.INTRAVENOUS_TEXT : null;
};

var categorizeOrders = function categorizeOrders(insulinOrders) {
    var medicationOrders = [];
    Constants.ORDER_CATEGORIZATION.forEach(function (value, key) {
        var medicationOrder = new Records.MedicationOrder({ type: key, medications: new _immutable.List(insulinOrders.filter(function (order) {
                return value.code.includes(order.code) && (value.dosage && value.dosage === order.administration || !value.dosage);
            })) });
        medicationOrders.push(medicationOrder);
    });
    return medicationOrders;
};
//# sourceMappingURL=medication-helper.js.map