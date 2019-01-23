import { useCallback, useRef } from 'react'
import { createForm } from 'final-form'
import useFormState from './useFormState'

const useForm = ({ subscription, ...config }) => {
  const form = useRef()
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

  return { ...state, form: getForm(), handleSubmit }
}

export default useForm
