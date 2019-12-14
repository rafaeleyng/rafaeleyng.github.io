---
title: "Practical Guide to Functional Programming"
date: 2015-07-21T22:46:46-03:00
author: rafaeleyng
excerpt: >
  Functional Programming lies somewhere between Computer Science and Mathematics. It is a pretty dense and theoric subject, so the goal here is to show you how to start using some classic functions for collection manipulation in your everyday code.
---

## Introduction

Functional Programming lies somewhere in the middle-ground between Computer Science and Mathematics. This is a pretty dense and theoric subject, so my goal here is to show you how to start using right away some classic functions for collections manipulation in your everyday code, focusing in practical examples of when you might use them.

In this post I'll show you how to use the 7 classical functions that I find most useful in collections manipulation:

* [each](#each)
* [filter](#filter)
* [find](#find)
* [some](#some)
* [every](#every)
* [map](#map)
* [reduce](#reduce)

Using these simple functions you'll find yourself writting a lot less of boilerplate code. Kiss goodbye a lot of `for` loops and `if` tests. Focus your code on your business logic, not on collection traversal and array accessing.

<small>
(The examples are in Javascript, but you'll find these principles applicable to many other languages like Ruby, Java 8 lambdas and C#, with LINQ. Although I will manually implement all the functions to show you the undercovers, many of these functions are already implemented in native Javascript arrays and many Javascript libs. We will manipulate some hypothetical <a href="https://gist.githubusercontent.com/rafaeleyng/e381da0b19039531dd33/raw/1ae6dc1e28ae2169110bfa5c9077ddb322065169/ch-functional-programming-data.js" target="_blank">orders data</a> in the examples.)
</small>

<!-- ======================================================================= -->

## each

You've been there. You have a collection of things, and you want to do something with `each` one of them.

**Use case:** I want set each one of my orders as finished.

```javascript
for (var i = 0; i < orders.length; i++) {
  orders[i].finished = true;
}
```

**Basic implementation:** `each` is a function that operates on a collection. For each item of this collection, a function will be called, receiving this item as a parameter. Inside this function, you do whatever you want with that item.

```javascript
var each = function(list, operation) {
  for (var i = 0; i < list.length; i++) {
    operation(list[i]);
  }
}
```

Rewriting the example using `each`:

```javascript
each(orders, function(order) {
  order.finished = true;
});
```

We don't worry about collection traversal or accessing elements using indexes. We just worry about what we want to do for each item.

<!-- ======================================================================= -->

## filter

You have a collection of things, and you want a collection with only the things that have some characteristic of your interest.

**Use case:** I want a list with the orders of the customer with code 1.

```javascript
var ordersCustomer1 = [];
for (var i = 0; i < orders.length; i++) {
  if (orders[i].customer === 1) {
    ordersCustomer1.push(orders[i]);
  }
}
```

**Basic implementation:** `filter` is a function that, for each item of a collection, calls a function passing that item as a parameter. This function should use that item to test some characteristic of this item (a *predicate*), and return a boolean that indicates whether it has or has not that characteristic. All items that have the characteristic will be accumulated in a new collection and returned by `filter`.

```javascript
var filter = function(list, operation) {
  var results = []
  for (var i = 0; i < list.length; i++) {
    if (operation(list[i])) {
      results.push(list[i]);
    }
  }
  return results;
}
```

Rewriting the example using `filter`:

```javascript
var ordersCustomer1 = filter(orders, function(order) {
  return order.customer === 1;
});
```

<!-- ======================================================================= -->

## find

`find` is a `filter` with 2 differences: you filter using a unique identifier, and it returns a single item (not a collection).

**Use case:** I want to find the order with code 2.

```javascript
var order2;
for (var i = 0; i < orders.length; i++) {
  if (orders[i].number === 2) {
    order2 = orders[i];
    break;
  }
}
```

**Basic implementation:** `find` is a function that, for each item of a collection, calls a function passing that item as a parameter. This function should use that item to test some unique identifier of this item (a *predicate*), and return a boolean that indicates whether it has or has not that identifier. `find` will stop searching as soon as it finds the first item that matches the predicate and will return this item.

```javascript
var find = function(list, operation) {
  for (var i = 0; i < list.length; i++) {
    if (operation(list[i])) {
      return list[i];
    }
  }
}
```

Rewriting the example using `find`:

```javascript
var order2 = find(orders, function(order) {
  return order.number === 2;
});
```

<!-- ======================================================================= -->

## some

You want to know if `some` of your items has some characteristic. It can be only one, two, or it can be all of them.

**Use case:** I want to know whether exists a not finished order.

```javascript
var existsNotFinished = false;
for (var i = 0; i < orders.length; i++) {
  if (!orders[i].finished) {
    existsNotFinished = true;
    break;
  }
}
```

**Basic implementation:** `some` is a function that, for each item of a collection, calls a function passing that item as a parameter. This function should use that item to return a boolean value that indicates whether the item has the characteristic. `some` will return `true` as soon as it finds some item that has the characteristic, of `false` if none does.

```javascript
var some = function(list, operation) {
  for (var i = 0; i < list.length; i++) {
    if (operation(list[i])) {
      return true;
    }
  }
  return false;
}
```

Rewriting the example using `some`:

```javascript
var existsNotFinished = some(orders, function(order) {
  return !order.finished;
});
```

<!-- ======================================================================= -->

## every

You want to know if `every` of your items has some characteristic.

**Use case:** I want to know whether all orders are not finished.

```javascript
var allFinished = true;
for (var i = 0; i < orders.length; i++) {
  if (!orders[i].finished) {
    allFinished = false;
    break;
  }
}
```

**Basic implementation:** `every` is a function that, for each item of a collection, calls a function passing that item as a parameter. This function should use that item to return a boolean value that indicates whether the item has the characteristic. `every` will return `false` as soon as it finds some item that doesn't have the characteristic, of `true` if all of them do.

```javascript
var every = function(list, operation) {
  for (var i = 0; i < list.length; i++) {
    if (!operation(list[i])) {
      return false;
    }
  }
  return true;
}
```

Rewriting the example using `every`:

```javascript
var allFinished = every(orders, function(order) {
  return order.finished;
});
```

<!-- ======================================================================= -->

## map

For each item of your collection you want to obtain a value by transforming that item, and you want a collection of these values back.

**Use case:** I need a list containing only the numbers of my orders (I want to *transform* my orders into its numbers).

```javascript
var orderNumbers = [];
for (var i = 0; i < orders.length; i++) {
  orderNumbers.push(orders[i].number);
}
```

**Basic implementation:** `map` is a function that, for each item of a collection, calls a function passing that item as a parameter. This function should use that item to obtain some value from it (getting one of its properties, making some kind of calculation etc) and return this value. `map` will accumulate those values in a collection and return this collection.

```javascript
var map = function(list, operation) {
  var results = [];
  for (var i = 0; i < list.length; i++) {
    results.push(operation(list[i]));
  }
  return results;
}
```

Rewriting the example using `map`:

```javascript
var orderNumbers = map(orders, function(order) {
  return order.number;
});
```

<!-- ======================================================================= -->

## reduce

From your collection, you want to get to some value that somehow represents it, like some kind of totalization.

**Use case:** I want to know the total cost of my order.

```javascript
var orderTotal = 0;
var order = orders[0]
for (var i = 0; i < order.items.length; i++) {
  var item = order.items[i];
  orderTotal += item.value * item.quantity;
}
```

**Basic implementation:** `reduce` is a function that, for each item of a collection, calls a function passing that item and an accumulator value as parameters. This function should use that item and the accumulator to calculate some value, that will be the new value of the accumulator. `reduce` receives an initial accumulator value, that for addition will be usually `0`.

```javascript
var reduce = function(list, operation, initial) {
  var accumulator = initial;
  for (var i = 0; i < list.length; i++) {
    accumulator = operation(accumulator, list[i]);
  }
  return accumulator;
}
```

Rewriting the example using `reduce`:

```javascript
var orderTotal = reduce(orders[0].items, function(acc, item) {
  return acc + (item.value * item.quantity);
}, 0)
```

<!-- ======================================================================= -->

## Combining functions

I want to show you an example of how these functions can be combined to make your code more concise and expressive. Suppose we want to obtain a list with the total value of each of the orders. We could do this:

```javascript
var totals = [];
for (var i = 0; i < orders.length; i++) {
  var order = orders[i];
  var total = 0;
  for (var j = 0; j < order.items.length; j++) {
    var item = order.items[j];
    total += item.value * item.quantity;
  }
  totals.push(total);
}
```

Generically, what we want to do is to `map` each order to a function that will `reduce` the value of its items multiplied by the quantities into a single value:

```javascript
var totals = map(orders, function(order) {
  return reduce(order.items, function(acc, item) {
    return acc + (item.quantity * item.value);
  }, 0);
});
```

## Further reading

If you want some nice reading about Functional Programming, check out [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://github.com/DrBoolean/mostly-adequate-guide).

Some video courses on the subject: [Programming Languages](https://www.coursera.org/course/proglang) and [Functional Programming Principles in Scala](https://www.coursera.org/course/progfun).

I also recommend you to read some real world implementations of the functions explained here in [Underscore.js](http://underscorejs.org/) source code.
