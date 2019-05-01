import * as React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { renderHook, cleanup } from 'react-hooks-testing-library'
import useField, { all } from './useField'
import useForm from './useForm'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('useField()', () => {
  let form, name, subscription, container

  beforeEach(() => {
    name = 'foo'
    subscription = { value: true }
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    document.body.removeChild(container)
    container = null
    cleanup()
  })

  describe("form hook parameter's registerField", () => {
    beforeEach(() => {
      form = {
        registerField: jest.fn()
      }
    })

    it('is called with correct params', () => {
      renderHook(() => useField(name, form, undefined, subscription))

      expect(form.registerField).toHaveBeenCalledWith(
        name,
        expect.any(Function),
        subscription,
        undefined
      )
    })

    it('receives all subscriptions by default', () => {
      renderHook(() => useField(name, form))

      expect(form.registerField).toHaveBeenCalledWith(
        name,
        expect.any(Function),
        all,
        undefined
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
      change = jest.fn(() => {
        debugger
      })
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
        const event = { target: { type: 'checkbox', checked: false } }

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

  describe('autofocus', () => {
    it('set focused when autoFocus is used on input', async () => {
      const onSubmit = jest.fn()
      const focusState = jest.fn()
      const FormComponent = () => {
        const { form, handleSubmit } = useForm({ onSubmit })
        const firstName = useField('firstName', form, undefined, {
          active: true
        })
        focusState(firstName.meta)
        return (
          <form onSubmit={handleSubmit}>
            <label>First Name</label>
            <input {...firstName.input} placeholder="First Name" autoFocus />
            <button type="submit">Submit</button>
          </form>
        )
      }
      act(async () => {
        ReactDOM.render(<FormComponent />, container)
      })

      await sleep(1)

      expect(onSubmit).not.toHaveBeenCalled()
      expect(focusState).toHaveBeenCalledTimes(4)
      expect(focusState).toHaveBeenLastCalledWith({ active: true })
    })
  })

  describe('field level validation', () => {
    it('should not call form validation if field validationallow validate field', () => {
      const FIELD_NAME = 'firstName'

      const onSubmit = jest.fn()
      const validate = jest.fn(values => {
        let errors = {}
        if (values[FIELD_NAME] && values[FIELD_NAME].length <= 4) {
          errors[FIELD_NAME] = 'Must be at least 4 chars'
        }
        return errors
      })

      const required = jest.fn(value => (value ? undefined : 'Required'))

      const FormComponent = () => {
        const { form, handleSubmit } = useForm({
          onSubmit,
          validate
        })
        const firstName = useField(FIELD_NAME, form, required)

        return (
          <form onSubmit={handleSubmit}>
            <label>First Name</label>
            <input {...firstName.input} placeholder="First Name" />
            {firstName.meta.touched && firstName.meta.error && (
              <span>{firstName.meta.error}</span>
            )}
            <button type="submit">Submit</button>
          </form>
        )
      }

      act(() => {
        ReactDOM.render(<FormComponent />, container)
      })

      expect(validate).toHaveBeenCalledTimes(2)
      expect(required).toHaveBeenCalledTimes(1)

      // span is not in dom because field error is not raised
      expect(container.querySelector('span')).toBe(null)

      // submit
      const button = container.querySelector('button')
      act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      })

      // span has required error
      expect(container.querySelector('span').innerHTML).toBe('Required')
      // form validate function has not been called
      expect(validate).toHaveBeenCalledTimes(2)
      // onSubmit has not been called in any moment
      expect(onSubmit).not.toHaveBeenCalled()

      // why this is not updated again?
      expect(required).toHaveBeenCalledTimes(1)
    })
  })
})
