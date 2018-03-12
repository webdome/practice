import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App.jsx';
// import registerServiceWorker from './registerServiceWorker';
// registerServiceWorker();

// ReactDOM.render(<App />, document.getElementById('root'));


// DOM 更新
// function tick() {
//   const element = (
//     <div>
//       <h1>Hello, world!</h1>
//       <h2>It is {new Date().toLocaleTimeString()}.</h2>
//     </div>
//   );
//   ReactDOM.render(
//     element,
//     document.getElementById('root')
//   );
// }

// setInterval(tick, 1000);

// 组件名称总是以大写字母开始
// 组件必须返回一个单独的根元素
// 所有 React 组件都必须是纯函数，并禁止修改其自身 props 
// 函数式(Functional)组件
// function Welcome(props) {
//   return <h2>Hello, {props.name}</h2>;
// }
// function App() {
//   return (
//     <div>
//       <Welcome name="react" />
//       <Welcome name="react-dom" />
//       <Welcome name="jsx" />
//     </div>
//   );
// }
// ReactDOM.render(
//   <App />,
//   document.getElementById('root')
// );
// ReactDOM.render(Welcome({name:'jsx'}), document.getElementById('root'));
// const element = <Welcome name="jsx" />;
// ReactDOM.render(
//   element,
//   document.getElementById('root')
// );
// 类组件
// 用类定义的组件有一些额外的特性。 这个”类专有的特性”， 指的就是局部状态
// 类允许我们在其中添加本地状态(state)和生命周期钩子
// 类组件应始终使用 props 调用基础构造函数
// React 得知了组件 state(状态)的变化, 随即再次调用 render() 方法
// 唯一可以分配 this.state 的地方是构造函数
// 任何 state(状态) 始终由某个特定组件所有，并且从该 state(状态) 导出的任何数据 或 UI 只能影响树中 “下方” 的组件
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date(),isToggleOn: true};
    // this.handleClick = this.handleClick.bind(this);
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
  tick() {
    this.setState({
      date: new Date()
    });
  }
  handleClick=()=>{
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }
  render() {
    return (
      <div>
        <h2>{this.state.date.toLocaleTimeString()}.</h2>
        <button onClick={this.handleClick}>{this.state.isToggleOn ? 'ON' : 'OFF'}</button>
      </div>
    );
  }
}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
    </div>
  );
}
ReactDOM.render(
  <App />,
  document.getElementById('root')
);