import { renderHook, cleanup, act } from 'react-hooks-testing-library'
import useForm from './useForm'

describe('useForm()', () => {
  let defaultConfig

  beforeEach(() => {
    defaultConfig = {
      onSubmit: jest.fn()
    }
  })
  afterEach(cleanup)

  const setup = overrideConfig => {
    const initialProps = {
      ...defaultConfig,
      ...overrideConfig
    }
    const { result, rerender } = renderHook(props => useForm(props), {
      initialProps
    })
    const { handleSubmit, form } = result.current

    return { handleSubmit, form, rerender, result }
  }

  describe('handleSubmit()', () => {
    it('causes form to submit', () => {
      const { handleSubmit } = setup()

      act(() => handleSubmit())

      expect(defaultConfig.onSubmit).toHaveBeenCalled()
    })

    describe('when event has preventDefault()', () => {
      let event

      beforeEach(() => {
        event = { preventDefault: jest.fn() }
      })

      it('calls prevent default', () => {
        const { handleSubmit } = setup()

        act(() => handleSubmit(event))

        expect(event.preventDefault).toHaveBeenCalled()
      })
    })

    describe('when event has stopPropagation()', () => {
      let event

      beforeEach(() => {
        event = { stopPropagation: jest.fn() }
      })

      it('calls prevent default', () => {
        const { handleSubmit } = setup()

        act(() => handleSubmit(event))

        expect(event.stopPropagation).toHaveBeenCalled()
      })
    })
  })

  describe('form config', () => {
    describe('initialValues', () => {
      const overrideConfig = { initialValues: { foo: 'foo' } }

      it('is set to initialValues provided in config object', () => {
        const { form } = setup(overrideConfig)
        const { initialValues } = form.getState()

        expect(initialValues).toEqual(overrideConfig.initialValues)
      })

      it('can be changed', () => {
        const nextConfig = { initialValues: { bar: 'bar' } }
        const { rerender, result } = setup(overrideConfig)

        act(() => rerender({ ...defaultConfig, ...nextConfig }))
        const { form } = result.current
        const { initialValues } = form.getState()

        expect(initialValues).toEqual(nextConfig.initialValues)
      })
    })

    describe('other configuration', () => {
      const overrideConfig = { mutators: { foo: () => 'foo' } }

      it('is set to configuration provided in config object', () => {
        const { form } = setup(overrideConfig)

        expect(form.mutators.hasOwnProperty('foo')).toBe(true)
      })

      it('can be changed', () => {
        const nextConfig = { mutators: { bar: () => 'bar' } }
        const { rerender, result } = setup(overrideConfig)

        act(() => rerender({ ...defaultConfig, ...nextConfig }))
        const { form } = result.current

        expect(form.mutators.hasOwnProperty('foo')).toBe(false)
        expect(form.mutators.hasOwnProperty('bar')).toBe(true)
      })
    })
  })
})
