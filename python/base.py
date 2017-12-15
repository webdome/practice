#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# name = input("嘿，赶紧输入你的名字：")
# print('hello '+name)

# 以#开头的语句是注释，注释是给人看的，可以是任意内容，解释器会忽略掉注释
# 每一行都是一个语句，当语句以冒号:结尾时，缩进的语句视为代码块。
a = 100
if a >= 0:
    print(None)
else:
    print(-a)
# 地板除
b = 10 // 3
print(b)
# ord()函数获取字符的整数表示，chr()函数把编码转换为对应的字符
c = ord('陈')
print(c)
d = chr(24494)
print(d)
# 以Unicode表示的str通过encode()方法可以编码为指定的bytes
# 如果我们从网络或磁盘上读取了字节流，那么读到的数据就是bytes。要把bytes变为str，就需要用decode()方法
e = '中国'.encode('utf-8')
print(e)
f = b'\xe4\xb8\xad\xe6\x96\x87'.decode('utf-8')
print(f)
# len()函数计算的是str的字符数，如果换成bytes，len()函数就计算字节数：
g = len('hello')
print(g)
h = len('你好'.encode('utf-8'))
print(h)
# 格式化字符串
# %d    整数
# %f    浮点数
# %s    字符串
# %x    十六进制整数
# %%    %
i = 'hi, %s, you have $%d %%' % ('Michael', 10000)
print(i)
# list 列表
# 索引 负数 表示倒数第几位
# append(x)    追加元素到末尾
# insert(i,x)    把元素插入到指定位置的前一位
# pop()   删除末尾的元素
# pop(i)    删除指定位置元素
# list[i]=x     把某个元素替换成别的元素
j = [1, 2, 3, 4, 5]
print(j[-1])
j.append(6)
print(j)
j.insert(1, 7)
print(j)
j.insert(-1, 8)
print(j)
j.pop()
print(j)
j.pop(1)
print(j)
j[-1] = 6
print(j)
# tuple 元组
# tuple一旦初始化就不能修改 指向不变
# 因为tuple不可变，所以代码更安全
# 只有1个元素的tuple定义时必须加一个逗号,
k = (1, 2, 3, 4, 5)
print(k)
print(k[1], k[-1])
l = (1)  # 注意 一个元素的时候python会把括号当成算术运算符
print(l)
m = (1,)
print(m)
# if elif else
# 类型转换  int()  str()
# age = int(input('请输入你的年龄：'))
age = 12
if age >= 18:
    print('成年人')
elif age >= 6:
    print('年轻人')
else:
    print('儿童')
# for...in
# range()   生成一个整数序列
names = ['Michael', 'Bob', 'Tracy']
for name in names:
    print(name)
sum = 0
for x in range(101):
    sum = sum + x
print(sum)
# while
# 只要条件满足，就不断循环，条件不满足时退出循环
# break语句可以提前退出循环
# continue语句，跳过当前的这次循环，直接开始下一次循环。
sum = 0
n = 99
while n > 0:
    sum = sum + n
    # continue
    # break
    n = n - 2
print(sum)
# dict 字典
# 如果key不存在，dict就会报错
# 要避免key不存在的错误，有两种办法
# 一是通过in判断key是否存在
# 二是通过dict提供的get方法，如果key不存在，可以返回None，或者自己指定的value
# pop(key) 删除一个元素
# 正确使用dict非常重要，需要牢记的第一条就是dict的key必须是不可变对象
# 这是因为dict根据key来计算value的存储位置，如果每次计算相同的key得出的结果不同，那dict内部就完全混乱了。这个通过key计算位置的算法称为哈希算法（Hash）
# 要保证hash的正确性，作为key的对象就不能变。在Python中，字符串、整数等都是不可变的，因此，可以放心地作为key。而list是可变的，就不能作为key
d = {'Michael': 99, 'Bob': 88, 'Tracy': 77}
print(d['Michael'])
d['Adam'] = 100
print(d)
d['Adam'] = 1
print(d)
print('Thomas' in d)
print(d.get('Thomas'))
print(d.get('Thomas',0))
d.pop('Bob')
print(d)
# set
# 一组key的集合，但不存储value
# 重复元素在set中自动被过滤
# add(key) 添加元素
# remove(key) 删除元素
# set可以看成数学意义上的无序和无重复元素的集合，因此，两个set可以做数学意义上的交集、并集等操作
s = set([1,2,3])
print(s)
s = set([1,2,3,2,3,1,4])
print(s)
s.add(5)
print(s)
s.remove(1)
print(s)
s1 = set([1,2,3,4])
s2 = set([2,4,5,6])
print(s1&s2) #交集
print(s1|s2) #并集
# 对于不变对象来说，调用对象自身的任意方法，也不会改变该对象自身的内容。相反，这些方法会创建新的对象并返回，这样，就保证了不可变对象本身永远是不可变的