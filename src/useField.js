import { fieldSubscriptionItems } from 'final-form'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

export const all = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

const subscriptionToInputs = subscription =>
  fieldSubscriptionItems.map(key => Boolean(subscription[key]))

const eventValue = event => {
  if (!event || !event.target) {
    return event
  } else if (event.target.type === 'checkbox') {
    return event.target.checked
  }

  return event.target.value
}

const useField = (name, form, validate, subscription = all) => {
  const autoFocus = useRef(false)
  const validatorRef = useRef(undefined)
  const [state, setState] = useState({})

  validatorRef.current = validate

  const deps = subscriptionToInputs(subscription)
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
        validate
          ? {
              getValidator: () => validatorRef.current
            }
          : undefined
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, form, ...deps]
  )
  let { blur, change, focus, value, ...meta } = state
  delete meta.name // it's in input
  const onBlur = useCallback(() => blur(), [blur])
  const onChange = useCallback(event => change(eventValue(event)), [change])
  const onFocus = useCallback(() => {
    if (focus) {
      focus()
    } else {
      autoFocus.current = true
    }
  }, [focus])
  const input = useMemo(
    () => ({
      name,
      onBlur,
      onChange,
      onFocus,
      value: value === undefined ? '' : value
    }),
    [name, onBlur, onChange, onFocus, value]
  )
  return { input, meta }
}

export default useField
