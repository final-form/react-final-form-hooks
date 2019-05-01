import { useEffect, useState } from 'react'
import { formSubscriptionItems } from 'final-form'

export const all = formSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

/**
 * Converts { active: true, data: false, ... } to `[true, false, false, ...]`.
 */
const subscriptionToInputs = subscription =>
  formSubscriptionItems.map(key => Boolean(subscription[key]))

const useFormState = (form, subscription = all) => {
  const [state, setState] = useState(() => form.getState())

  const deps = subscriptionToInputs(subscription)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => form.subscribe(setState, subscription), [form, ...deps])

  return state
}

export default useFormState
