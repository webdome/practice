require('./view')

const Mediator = require("./mediator/mediator.js");
const mediator = new Mediator();

const utils = require('./utils')

module.exports = {
  mediator,

}