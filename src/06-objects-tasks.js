/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,

    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const keys = Object.keys(obj);
  return new proto.constructor(...keys.map((key) => obj[key]));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  res: '',
  isEl: false,
  isId: false,
  isPsEl: false,
  order: ['element', 'id', 'class', 'attribute', 'pseudo-class', 'pseudo-element'],
  index: -1,
  element(value) {
    if (this.isEl) {
      this.getErr();
    }
    const cThis = { ...this };
    cThis.isEl = true;
    cThis.res += `${value}`;
    if (cThis.index > cThis.order.indexOf('element')) {
      cThis.getErrOrder();
    } else {
      cThis.index = cThis.order.indexOf('element');
    }
    return cThis;
  },

  id(value) {
    if (this.isId) {
      this.getErr();
    }
    const cThis = { ...this };
    cThis.isId = true;
    cThis.res += `#${value}`;
    if (cThis.index > cThis.order.indexOf('id')) {
      cThis.getErrOrder();
    } else {
      cThis.index = cThis.order.indexOf('id');
    }
    return cThis;
  },

  class(value) {
    if (this.index > this.order.indexOf('class')) {
      this.getErrOrder();
    } else {
      this.index = this.order.indexOf('class');
    }
    this.res += `.${value}`;
    return this;
  },

  attr(value) {
    if (this.index > this.order.indexOf('attribute')) {
      this.getErrOrder();
    } else {
      this.index = this.order.indexOf('attribute');
    }
    this.res += `[${value}]`;
    return this;
  },

  pseudoClass(value) {
    if (this.index > this.order.indexOf('pseudo-class')) {
      this.getErrOrder();
    } else {
      this.index = this.order.indexOf('pseudo-class');
    }
    this.res += `:${value}`;
    return this;
  },

  pseudoElement(value) {
    if (this.isPsEl) {
      this.getErr();
    }
    const cThis = { ...this };
    cThis.isPsEl = true;
    cThis.res += `::${value}`;
    if (cThis.index > cThis.order.indexOf('pseudo-element')) {
      cThis.getErrOrder();
    } else {
      cThis.index = cThis.order.indexOf('pseudo-element');
    }
    return cThis;
  },

  combine(selector1, combinator, selector2) {
    this.res = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  },

  stringify() {
    const buff = this.res;
    this.res = '';
    this.index = -1;
    return buff;
  },

  getErr() {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  },

  getErrOrder() {
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
