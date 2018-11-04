import { useState, useEffect, useRef } from 'react'
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
  return { ...state, form: form.current }
}

export default useForm
