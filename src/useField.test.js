import { renderHook, cleanup } from 'react-hooks-testing-library'
import useField, { all } from './useField'

describe('useField()', () => {
  let form, name, subscription

  beforeEach(() => {
    name = 'foo'
    subscription = { value: true }
  })
  afterEach(cleanup)

  describe("form hook parameter's registerField", () => {
    beforeEach(() => {
      form = {
        registerField: jest.fn()
      }
    })

    it('is called with correct params', () => {
      renderHook(() => useField(name, form, subscription))

      expect(form.registerField).toHaveBeenCalledWith(
        name,
        expect.any(Function),
        subscription
      )
    })

    it('receives all subscriptions by default', () => {
      renderHook(() => useField(name, form))

      expect(form.registerField).toHaveBeenCalledWith(
        name,
        expect.any(Function),
        all
      )
    })
  })

  describe('field input props return object', () => {
    let value, blur, change, focus

    const setupHook = () => {
      const { result } = renderHook(() => useField(name, form, subscription))
      const { input } = result.current

      return input
    }

    beforeEach(() => {
      value = 'bar'
      blur = jest.fn()
      change = jest.fn()
      focus = jest.fn()

      form = {
        registerField: jest.fn((name, callback, subscription) =>
          callback({ blur, change, focus, value })
        )
      }
    })

    it('has the correct name', () => {
      const { name: returnName } = setupHook()

      expect(returnName).toBe(name)
    })

    it('has the correct value', () => {
      const { value: returnValue } = setupHook()

      expect(returnValue).toBe(value)
    })

    describe('onBlur()', () => {
      it('calls the correct event handler', () => {
        const { onBlur } = setupHook()

        onBlur()

        expect(blur).toHaveBeenCalled()
      })
    })

    describe('onChange()', () => {
      describe('when event is not an usual input event', () => {
        const event = { foo: 'bar' }

        it('calls the provided handler with event object', () => {
          const { onChange } = setupHook()

          onChange(event)

          expect(change).toHaveBeenCalledWith(event)
        })
      })

      describe('when event has a value prop', () => {
        const event = { target: { value: 'foo' } }

        it('calls provided handler with value', () => {
          const { onChange } = setupHook()

          onChange(event)

          expect(change).toHaveBeenLastCalledWith(event.target.value)
        })
      })

      describe('when event has a checked prop', () => {
        const event = { target: { type: 'radio', checked: false } }

        it('calls provided handler with value', () => {
          const { onChange } = setupHook()

          onChange(event)

          expect(change).toHaveBeenLastCalledWith(event.target.checked)
        })
      })
    })

    describe('onFocus()', () => {
      it('calls the correct event handler', () => {
        const { onFocus } = setupHook()

        onFocus()

        expect(focus).toHaveBeenCalled()
      })
    })
  })

  describe('field meta return object', () => {
    let meta

    beforeEach(() => {
      meta = { name: 'foo', bar: 'bar', biz: 'biz' }

      form = {
        registerField: jest.fn((name, callback, subscription) =>
          callback({ ...meta })
        )
      }
    })

    it('has the correct values', () => {
      const { result } = renderHook(() => useField(name, form, subscription))
      const { meta: returnMeta } = result.current

      delete meta.name

      expect(returnMeta).toEqual(meta)
    })
  })
})
