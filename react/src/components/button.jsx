var React = require('react')

// 组件上传递的属性会统一整合到 this.props
// props是只读的
// 组件状态属性 需要全部挂载到 this.state 对象上 才能被setState更新
// state是读写的
// 更新组件状态属性 必须使用this.setState方法才能响应到DOM上
// 注意：this.setState是个异步方法
class Button extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      btnText: props.name,
      disabled: false
    }
  }
  submit(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.disabled) {
      console.log('loading');
    } else {
      this.setState({
        btnText: this.props.name + '_ing',
        disabled: true
      });
      /* 
      this.setState(((prevState,props)=>{
        return {
          btnText: props.name + '_ing',
          disabled: true
        }
      }));
      */
    }
  }
  render() {
    return <button disabled={this.state.disabled} onClick={this.submit.bind(this)}>{this.state.btnText}</button>
  }
}

module.exports = Button