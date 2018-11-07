import { useState, useEffect } from 'react'
import { fieldSubscriptionItems } from 'final-form'

export const all = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

const useField = (name, form, subscription) => {
  const [state, setState] = useState({})
  useEffect(() => form.registerField(name, setState, subscription || all), [
    name,
    subscription
  ])
  let { blur, change, focus, value, ...meta } = state || {}
  delete meta.name // it's in input
  return {
    input: {
      name,
      value: value || '',
      onBlur: () => state.blur(),
      onChange: event =>
        state.change(event.target ? event.target.value : event),
      onFocus: () => state.focus()
    },
    meta
  }
}

export default useField
