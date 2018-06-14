// 类里面只能包含 实例属性 静态属性 实例方法 静态方法
// 类的本质还是构造函数 只是一种语法糖
// 父类可理解为原型对象 prototype
class Animal {
  // 实例属性
  constructor(name,age){
    this.name = name;
    this.age = age;
  }
  // 静态属性
  static info = '静态属性';
  // 实例方法
  say(){
    console.log('实例方法');
  }
  // 静态方法
  static show(){
    console.log('静态方法');
  }
}

var a1 = new Animal('dog',18)
console.log(a1);
console.log(Animal.info);
a1.say()
Animal.show()

// 子类使用 extends 实现继承
// 子类constructor内需要优先使用super 
// super 其实就是父类的构造器
// constructor this只能在super后使用
class Dog extends Animal {
  constructor(name,age,sex){
    super(name,age);
    this.sex = sex;
  }
  wangwang(){
    console.log('wangwang');
    
  }
}

var d1 = new Dog('dog',12,'male')
console.log(d1);
d1.wangwang()
