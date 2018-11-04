import { useState, useEffect, useRef, useCallback } from 'react'
import { createForm, formSubscriptionItems } from 'final-form'

export const all = formSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

const useForm = ({ subscription, ...config }) => {
  const form = useRef(createForm(config))
  const [state, setState] = useState({})
  useEffect(() => form.current.subscribe(setState, subscription || all), [
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
    return form.current.submit()
  }, [])

  return { ...state, form: form.current, handleSubmit }
}

export default useForm
