// require('babel-polyfill')
require('./index.scss')

// react 创建虚拟dom 生命周期
var React = require('react')
// react-dom 渲染dom
var ReactDOM = require('react-dom')

// 基础创建dom方法
var myH1 = React.createElement('h1', { id: 'myH1', title: 'this is a h1' }, 'h1')
// 组件创建 构造函数或类
// 构造函数创建的是 无状态组件
// 构造函数需要返回一个合法的jsx
// 类创建组件时必须包含一个render函数并且返回合法的jsx
function Welcome(props) {
  return <h2>Hello, {props.name}</h2>;
}
class Welcome2 extends React.Component {
  render() {
    return <h2>Hello, {this.props.name}</h2>;
  }
}
// 组件复合
function App() {
  return (
    <div>
      <Welcome name="sara" />
      <Welcome name="andy" />
      <Welcome name="toni" />
    </div>
  )
}
// 组件状态
// 组件生命周期
// function Clock(props) {
//   return (
//     <div>
//       <h1>Hello, world!</h1>
//       <h2>It is {props.date.toLocaleTimeString()}.</h2>
//     </div>
//   );
// }
// 不要直接改变state的值 需要调用setState
// 值的变化是异步的 可使用回调函数的形式 第一个参数为上个状态的值
// 合并状态
// 单项数据流
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }
  render() {
    return (
      <div>
        <h2>Hello {this.props.name}</h2>
        <p>It is {this.state.date.toLocaleTimeString()}.</p>
      </div>
    )
  }
  tick() {
    this.setState({
      date: new Date()
    })
  }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
}
// 事件
// e 代理事件Proxy 符合W3C标准
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
// 使用箭头函数可解决this绑定的问题
var Toggle = require('@components/Toggle')

// 条件渲染 和写js一样
// 循环 使用map方法 注意加key key能帮助react确定元素的变化  key不会被添加到props
// map 循环体复杂度一高就要进行封装 分割

// 表单 受控组件
// 受控组件中每个状态的改变 都必须通过一个处理函数 这使得改变输入变得很简单
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // this.setState({value: event.target.value});
    this.setState({value: event.target.value.toUpperCase()});
  }

  handleSubmit(event) {
    console.log('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

// Composition slot  props.children
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}

// 组件原则
// All React components must act like pure functions with respect to their props. 属性不可变
var name = 'myH2'
var myH2 = <h2>{name}</h2>
var lists = ['react', 'vuejs', 'angular']
// jsx 语法需要babel转化为React.createElement的形式 babel-preset-react插件
// 使用js变量及方法 需要包裹在 {} 内
// 循环一般使用map函数
/* ReactDOM.render(
  <div>
    <div>myDiv</div>
    {myH2}
    <ul>
      {lists.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
    {Welcome({ name: 'vuejs' })}
    <Welcome name="react"></Welcome>
    <Welcome2 name="angular"></Welcome2>
    <App />
    <Clock name="cw" />
    <ActionLink />
    <Toggle />
    <NameForm />
    <WelcomeDialog />
  </div>,
  document.getElementById('app1')
) */




require('@components/Ani')
var Button = require('@components/button')

/* ReactDOM.render(
  <div>
    <Button name="login"></Button>
  </div>
  ,document.getElementById('app2')
) */

var Comment = require('@components/Comment')
ReactDOM.render(
  <div>
    <Comment></Comment>
  </div>
  ,document.getElementById('app3')
)
