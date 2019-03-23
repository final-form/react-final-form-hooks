import { useState, useEffect, useRef } from 'react'
import { fieldSubscriptionItems } from 'final-form'

export const all = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

const subscriptionToInputs = subscription =>
  fieldSubscriptionItems.map(key => Boolean(subscription[key]))

const eventValue = event => {
  if (!event || !event.target) {
    return event
  } else if (['checkbox', 'radio'].includes(event.target.type)) {
    return event.target.checked
  }

  return event.target.value
}

const useField = (name, form, validate, subscription = all) => {
  const autoFocus = useRef(false)
  const [state, setState] = useState({})
  const options = validate
    ? {
        getValidator: () => validate
      }
    : undefined
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
        subscription,
        options
      ),
    [name, form, validate, ...subscriptionToInputs(subscription)]
  )
  let { blur, change, focus, value, ...meta } = state || {}
  delete meta.name // it's in input
  return {
    input: {
      name,
      value: value === undefined ? '' : value,
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
