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

  useEffect(() => {
    const unsubscribe = form.subscribe(setState, subscription)

    return () => unsubscribe()
  }, [form, ...subscriptionToInputs(subscription)])

  return state
}

export default useFormState
