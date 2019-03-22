import * as React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import useForm from './useForm'
import useField from './useField'

describe('useField tests', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
  })

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
