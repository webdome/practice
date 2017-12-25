const view = require('./view')

const Mediator = require("./mediator/mediator.js");
const mediator = new Mediator();

const utils = require('./utils')

module.exports = {
  view,
  mediator,
  utils
}