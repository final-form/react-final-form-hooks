import shallowEqual from './shallowEqual'

describe('shallowEqual', function() {
  beforeEach(() => {
    // isolated instances of shallowEqual for each test.
    jest.resetModules()
  })

  // test cases copied from https://github.com/facebook/fbjs/blob/82247de1c33e6f02a199778203643eaee16ea4dc/src/core/__tests__/shallowEst.js
  it('returns false if either argument is null', () => {
    expect(shallowEqual(null, {})).toEqual(false)
    expect(shallowEqual({}, null)).toEqual(false)
  })

  it('returns true if both arguments are null or undefined', () => {
    expect(shallowEqual(null, null)).toEqual(true)
    expect(shallowEqual(undefined, undefined)).toEqual(true)
  })

  it('returns true if arguments are shallow equal', () => {
    expect(shallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toEqual(
      true
    )
  })

  it('returns false if arguments are not objects and not equal', () => {
    expect(shallowEqual(1, 2)).toEqual(false)
  })

  it('returns false if only one argument is not an object', () => {
    expect(shallowEqual(1, {})).toEqual(false)
  })

  it('returns false if first argument has too many keys', () => {
    expect(shallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).toEqual(false)
  })

  it('returns false if second argument has too many keys', () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toEqual(false)
  })

  it('returns true if values are not primitives but are ===', () => {
    let obj = {}
    expect(
      shallowEqual({ a: 1, b: 2, c: obj }, { a: 1, b: 2, c: obj })
    ).toEqual(true)
  })

  // subsequent test cases are copied from lodash tests
  it('returns false if arguments are not shallow equal', () => {
    expect(shallowEqual({ a: 1, b: 2, c: {} }, { a: 1, b: 2, c: {} })).toEqual(
      false
    )
  })

  it('should handle comparisons if `customizer` returns `undefined`', () => {
    const noop = () => void 0

    expect(shallowEqual('a', 'a', noop)).toEqual(true)
    expect(shallowEqual(['a'], ['a'], noop)).toEqual(true)
    expect(shallowEqual({ '0': 'a' }, { '0': 'a' }, noop)).toEqual(true)
  })

  it('should treat objects created by `Object.create(null)` like any other plain object', () => {
    function Foo() {
      this.a = 1
    }
    Foo.prototype.constructor = null

    const object2 = { a: 1 }
    expect(shallowEqual(new Foo(), object2)).toEqual(true)

    const object1 = Object.create(null)
    object1.a = 1
    expect(shallowEqual(object1, object2)).toEqual(true)
  })
})
