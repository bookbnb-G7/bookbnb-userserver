const aux = require('./filterObjectKeys');
require('dotenv').config();
const logger = require('./logger');

function apiKeyIsNotValid(api_key, res) {
  if (!api_key || api_key != process.env.API_KEY) {
    respond(res, 401, { error: "unauthorized" });
    return true;
  }

  return false;
}

function respond(res, status, res_body) {
  logger.info(`Response status: ${status}\n` +
    `\tResponse body: ${JSON.stringify(res_body)}`
  );
  res.status(status).json(res_body);
}

function getErrorInPayloadAttr(payloadAttr, thingsToCheck, attrName){
  let error = null;

  if (!error && thingsToCheck["type"] && (typeof payloadAttr !== thingsToCheck["type"]))
    error = `Error in payload, ${attrName} should be a ${thingsToCheck["type"]}`;
  
  if (!error && thingsToCheck["min"] && payloadAttr < thingsToCheck["min"])
    error = `Error in payload, ${attrName} should be bigger than ${thingsToCheck["min"]}`;

  if (!error && thingsToCheck["max"] && payloadAttr > thingsToCheck["max"])
    error = `Error in payload, ${attrName} should be less than ${thingsToCheck["max"]}`;

  if (!error && thingsToCheck["isInteger"] === true && (payloadAttr % 1 !== 0))
    error = `Error in payload, ${attrName} should be shorter than ${thingsToCheck["length"]}`;

  if (!error && thingsToCheck["isDate"] === true && isNaN(new Date(payloadAttr)))
    error = `Error in payload, ${attrName} should be a date-like string with the format YYYY-MM-DD`

  if (!error && thingsToCheck["isEmail"] === true && !(payloadAttr.includes('@')))
    error = `Error in payload, ${attrName} should be a email-like string with the format string@string`

  if (!error && thingsToCheck["length"] && payloadAttr.length > thingsToCheck["length"])
    error = `Error in payload, ${attrName} should be shorter than ${thingsToCheck["length"]}`;

  return error;
}

// attrsToCheck is dictionary like { "attr": { "type": type, "min": min, "max": max, "len": len } }
// and this function checks that the payload has every "attr" (not null) and verifies
// all the not null indications in every object of attrsToCheck
function getErrorInPayload(payload, attrsToCheck){
  let error = null;
  let attr = null;
  let attrKeys = Object.keys(attrsToCheck)
  let attrPos = 0;

  while (!error && attrPos < attrKeys.length) {
    attr = attrKeys[attrPos];
    if (payload[attr] != null)
      error = getErrorInPayloadAttr(payload[attr], attrsToCheck[attr], attr);
    else
      error = `Error in payload, ${attr} is not present`;

    attrPos = attrPos + 1;
  }

  return error;
}

exports.apiKeyIsNotValid = apiKeyIsNotValid;
exports.respond = respond;
exports.getErrorInPayload = getErrorInPayload;