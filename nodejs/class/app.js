class Point {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  toString(){
    return `string: (${this.x},${this.y})`
  }
}

Object.assign(Point.prototype,{
  toValue(){
    return `value: (${this.x},${this.y})`
  }
})

var point = new Point(1,2)
console.log(point.toString())
console.log(point.toValue())
console.log(point.hasOwnProperty('x'))
console.log(point.hasOwnProperty('toString'))
console.log(point.__proto__.hasOwnProperty('toValue'))


class ColorPoint extends Point {
  constructor(x,y,color){
    super(x,y)
    this.color = color
  }
  toString(){
    return this.color + ' ' + super.toString()
  }
}

var colorPoint = new ColorPoint(1,2,'#fff')
console.log(colorPoint)


// function testable(target) {
//   target.isTestable = true
// }
// @testable
// class MyTestableClass(){

// }