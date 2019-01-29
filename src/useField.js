import { useState, useEffect, useRef } from 'react'
import { fieldSubscriptionItems } from 'final-form'

export const all = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

const subscriptionToInputs = subscription =>
  fieldSubscriptionItems.map(key => Boolean(subscription[key]))

const eventValue = event => {
  if (!event.target) {
    return event
  } else if (['checkbox', 'radio'].includes(event.target.type)) {
    return event.target.checked
  } else if (event.target.type === 'file') {
    return event.target.files
  }

  return event.target.value
}

const useField = (name, form, subscription = all) => {
  const autoFocus = useRef(false)
  const [state, setState] = useState({})
  useEffect(
    () =>
      form.registerField(
        name,
        newState => {
          if (autoFocus.current) {
            autoFocus.current = false
            setTimeout(() => newState.focus())
          }
          setState(newState)
        },
        subscription
      ),
    [name, ...subscriptionToInputs(subscription)]
  )
  let { blur, change, focus, value, ...meta } = state || {}
  delete meta.name // it's in input
  return {
    input: {
      name,
      value: value || '',
      onBlur: () => state.blur(),
      onChange: event => state.change(eventValue(event)),
      onFocus: () => {
        if (state.focus) {
          state.focus()
        } else {
          autoFocus.current = true
        }
      }
    },
    meta
  }
}

export default useField
