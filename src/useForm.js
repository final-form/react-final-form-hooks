import { useState, useEffect, useRef, useCallback } from 'react'
import { createForm, formSubscriptionItems } from 'final-form'

export const all = formSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

const useForm = ({ subscription, ...config }) => {
  const form = useRef()
  // https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
  const getForm = () => {
    if (!form.current) {
      form.current = createForm(config)
    }

    return form.current
  }
  const [state, setState] = useState({})
  useEffect(() => getForm().subscribe(setState, subscription || all), [
    subscription
  ])
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
