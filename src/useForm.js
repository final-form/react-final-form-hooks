import { useCallback, useRef, useEffect } from 'react'
import { createForm, configOptions } from 'final-form'
import useFormState from './useFormState'
import shallowEqual from './internal/shallowEqual'

const useForm = ({
  subscription,
  initialValuesEqual = shallowEqual,
  ...config
}) => {
  const form = useRef()
  const prevConfig = useRef(config)

  // https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
  const getForm = () => {
    if (!form.current) {
      form.current = createForm(config)
    }

    return form.current
  }
  const state = useFormState(getForm(), subscription)
  const handleSubmit = useCallback(event => {
    if (event) {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault()
      }
      if (typeof event.stopPropagation === 'function') {
        event.stopPropagation()
      }
    }
    return getForm().submit()
  }, [])

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

  return { ...state, form: getForm(), handleSubmit }
}

export default useForm
