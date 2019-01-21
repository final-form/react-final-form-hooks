import { useEffect, useState } from 'react'
import { formSubscriptionItems } from 'final-form'

export const all = formSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

const useFormState = (form, subscription = all) => {
  const [state, setState] = useState(() => form.getState())
  useEffect(() => form.subscribe(setState, subscription), [form, subscription])

  return state
}

export default useFormState
