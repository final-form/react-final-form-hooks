import { renderHook, cleanup, act } from 'react-hooks-testing-library'
import useFormState, { all } from './useFormState'

describe('useFormState()', () => {
  let form, formState, setFormState, subscription, unsubscribe

  beforeEach(() => {
    formState = { foo: 'foo' }
    subscription = { value: true }
    unsubscribe = jest.fn()
    form = {
      getState: jest.fn(() => formState),
      subscribe: jest.fn((setState, subscription) => {
        setFormState = setState
        return unsubscribe
      })
    }
  })
  afterEach(cleanup)

  describe('form state', () => {
    it('comes from form parameter', () => {
      const { result } = renderHook(() => useFormState(form, subscription))
      const returnState = result.current

      expect(returnState).toBe(formState)
    })
  })

  describe('subscription array', () => {
    it('defaults to all subscriptions', () => {
      renderHook(() => useFormState(form))

      expect(form.subscribe).toHaveBeenCalledWith(expect.any(Function), all)
    })
  })

  describe("form's subscribe function", () => {
    it('is called with the subscrition array', () => {
      renderHook(() => useFormState(form, subscription))

      expect(form.subscribe).toHaveBeenCalledWith(
        expect.any(Function),
        subscription
      )
    })

    it('receives a callback to update form state', () => {
      const nextState = { bar: 'bar' }
      const { result } = renderHook(() => useFormState(form, subscription))

      act(() => {
        setFormState(nextState)
      })
      const returnState = result.current

      expect(returnState).toBe(nextState)
    })
  })
})
