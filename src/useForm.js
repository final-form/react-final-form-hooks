import { useCallback, useRef, useEffect } from 'react'
import { createForm, configOptions } from 'final-form'
import useFormState from './useFormState'
import shallowEqual from './internal/shallowEqual'

// https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
const useMemoOnce = factory => {
  const ref = useRef()

  if (!ref.current) {
    ref.current = factory()
  }

  return ref.current
}

const useForm = ({
  subscription,
  initialValuesEqual = shallowEqual,
  ...config
}) => {
  const form = useMemoOnce(() => createForm(config))
  const prevConfig = useRef(config)
  const state = useFormState(form, subscription)
  const handleSubmit = useCallback(
    event => {
      if (event) {
        if (typeof event.preventDefault === 'function') {
          event.preventDefault()
        }
        if (typeof event.stopPropagation === 'function') {
          event.stopPropagation()
        }
      }
      return form.submit()
    },
    [form]
  )

  useEffect(() => {
    if (config === prevConfig.current) {
      return
    }

    if (
      config.initialValues &&
      !initialValuesEqual(
        config.initialValues,
        prevConfig.current.initialValues
      )
    ) {
      form.initialize(config.initialValues)
    }

    configOptions.forEach(key => {
      if (key !== 'initialValues' && config[key] !== prevConfig.current[key]) {
        form.setConfig(key, config[key])
      }
    })

    prevConfig.current = config
  })

  return { ...state, form, handleSubmit }
}

export default useForm
