'use strict';

const Controller = require('egg').Controller;

class listController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg list';
  }
}

module.exports = listController;
