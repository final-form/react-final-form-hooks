import {
  FormApi,
  Config,
  FormState,
  FormSubscription,
  FieldSubscription,
  FieldState,
  FieldValidator
} from 'final-form'

export interface FormRenderProps extends FormState {
  form: FormApi
  handleSubmit: (
    event?: React.SyntheticEvent<HTMLFormElement>
  ) => Promise<object | undefined> | undefined
}

interface FormConfig extends Config {
  subscription?: FormSubscription
  initialValuesEqual?: (a: object, b: object) => boolean
}

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>

export interface FieldRenderProps<V = any> {
  input: {
    name: string
    onBlur: <T>(event?: React.FocusEvent<T>) => void
    onChange: <T>(event: React.ChangeEvent<T> | V) => void
    onFocus: <T>(event?: React.FocusEvent<T>) => void
    value: V
    checked?: boolean
  }
  meta: NonFunctionProperties<FieldState>
}

declare module 'react-final-form-hooks' {
  export function useForm<C = FormConfig>(config: C): FormRenderProps
  export function useFormState(
    form: FormApi,
    subscription?: FormSubscription
  ): FormRenderProps

  export function useField<V = any>(
    name: string,
    form: FormApi,
    validate?: FieldValidator,
    subscription?: FieldSubscription
  ): FieldRenderProps<V>
}
