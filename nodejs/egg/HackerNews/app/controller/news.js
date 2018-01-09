const Controller = require('egg').Controller;

class NewsController extends Controller {
  async list() {
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const newsList = await ctx.service.news.list(page);
    // render a template, path relate to `app/view`
    await ctx.render('news/list.html', { list: newsList });

    // or manually set render result to ctx.body
    // ctx.body = await ctx.renderView('news/list.html', { list: newsList });

    // or render string directly
    // 当使用 renderString 时需要指定模板引擎，如果已经定义 defaultViewEngine 这里可以省略
    // ctx.body = await ctx.renderString('hi, {{ name }}', { name: 'egg' }, {viewEngine: 'nunjucks'});
  }
}

module.exports = NewsController;