var styles = require('./Comment.scss')
require('bootstrap/dist/css/bootstrap.css')
console.log(styles);

var React = require('react')

var axios = require('axios')
require('@/mock.js')

// 行内样式使用对象形式
// react 中没有指令
// 使用modules参数启用模块化 只针对class和id
// 使用localIdentName自定义生成的类名
// css-loader?modules&localIdentName=[path][name]-[local]-[hash:32]
// :global包裹的不会被模块化   :local包裹会被模块化 默认不用写
// 一般第三方库是css 所以不开启模块化
// 自己的模块一般使用scss 开启模块化
function CommentItem(props) {
  // let style = {border: '1px dashed #ccc'};
  return (
    <li /* style={style} */ className={styles.one}>
      <h4>评论人：{props.user}</h4>
      <p>评论内容：{props.content}</p>
    </li>
  )
}
class Comment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      commentList: [],
      face: ['👌', '😁'],
      i: 0,
      value: '123'
    }
  }
  componentDidMount() {
    this.fetchCommentList();
  }
  async fetchCommentList() {
    let { data } = await axios.get('/commnetList')
    let { code, content, message } = data
    if (code === 0) {
      this.setState({
        commentList: content
      })
    }
  }
  // react中事件绑定使用小驼峰的写法
  // setState 会合并变化项 保留不变项
  // setState是异步的 会合并相邻的操作  第二个参数为异步回调 可拿到更新后的值
  handleClick(...P) {
    this.setState({
      i: this.state.i > 0 ? 0 : 1
    },function(){
      console.log(this.state.i);
    })
    console.log(this.state.i);
    setTimeout(() => {
      console.log(this.state.i);
    }, 0);
  }
  handleChange(e){
    console.log(e.target.value);
    console.log(this.refs.input.value);
    this.setState({
      value: this.refs.input.value
    })
  }
  render() {
    var lists = this.state.commentList;
    return (
      <div>
        <button className="btn btn-primary" onClick={this.handleClick.bind(this)}>{this.state.face[this.state.i]}</button>
        <hr/>
        {/* react中 数据是单向的 */}
        {/* 使用value绑定数据  使用defaultValue模拟原生的value属性 */}
        {/* 使用value绑定数据后 必须添加onChange处理函数 否则为只读元素 无法输入 */}
        <input type="text" value={this.state.value} onChange={this.handleChange.bind(this)} ref="input"/>
        <ul>
          {lists.map(item => {
            item.key = item.id
            return <CommentItem {...item}></CommentItem>
          })}
        </ul>
      </div>
    )
  }
}

module.exports = Comment


// #region



// #endregion