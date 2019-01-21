import { useEffect, useState } from 'react'
import { formSubscriptionItems } from 'final-form'

export const all = formSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

/**
 * Converts { active: true, data: false, ... } to `[true, false, false, ...]`.
 */
function subscriptionToInputs(subscription) {
  return formSubscriptionItems.map(key => Boolean(subscription[key]))
}

const useFormState = (form, subscription = all) => {
  const [state, setState] = useState(() => form.getState())

  useEffect(() => form.subscribe(setState, subscription), [
    form,
    ...subscriptionToInputs(subscription)
  ])

  return state
}

export default useFormState
