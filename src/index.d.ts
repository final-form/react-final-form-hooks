import {
  FormApi,
  Config,
  FormState,
  FormSubscription,
  FieldSubscription,
  FieldState,
  FieldValidator
} from 'final-form'

export interface FormRenderProps<S> extends FormState<S> {
  form: FormApi<S>
  handleSubmit: (
    event?: React.SyntheticEvent<HTMLFormElement>
  ) => Promise<object | undefined> | undefined
}

interface FormConfig<FormValues> extends Config<FormValues> {
  subscription?: FormSubscription
  initialValuesEqual?: (a: object, b: object) => boolean
}

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>

export interface FieldRenderProps<V = any, T = string> {
  input: {
    name: string
    onBlur: <T>(event?: React.FocusEvent<T>) => void
    onChange: <T>(event: React.ChangeEvent<T> | V) => void
    onFocus: <T>(event?: React.FocusEvent<T>) => void
    value: V
    checked?: boolean
  }
  meta: NonFunctionProperties<FieldState<T>>
}

declare module 'react-final-form-hooks' {
  export function useForm<S = object>(config: FormConfig<S>): FormRenderProps<S>
  export function useFormState<S = object>(
    form: FormApi<S>,
    subscription?: FormSubscription
  ): FormRenderProps<S>

  export function useField<V = any, S = object>(
    name: string,
    form: FormApi<S>,
    validate?: FieldValidator<V>,
    subscription?: FieldSubscription
  ): FieldRenderProps<V>
}
