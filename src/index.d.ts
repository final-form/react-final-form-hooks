import {
  FormApi,
  Config,
  FormState,
  FormSubscription,
  FieldSubscription,
  FieldState
} from 'final-form'

export interface FormRenderProps extends FormState {
  form: FormApi
  handleSubmit: (
    event?: React.SyntheticEvent<HTMLFormElement>
  ) => Promise<object | undefined> | undefined
}

interface FormConfig extends Config {
  subscription?: FormSubscription
}

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>

export interface FieldRenderProps {
  input: {
    name: string
    onBlur: <T>(event?: React.FocusEvent<T>) => void
    onChange: <T>(event: React.ChangeEvent<T> | any) => void
    onFocus: <T>(event?: React.FocusEvent<T>) => void
    value: any
    checked?: boolean
  }
  meta: NonFunctionProperties<FieldState>
}

interface FormConfig extends Config {
  subscription?: FormSubscription
}

declare module 'react-final-form-hooks' {
  export function useForm(config: FormConfig): FormRenderProps

  export function useField(
    name: string,
    form: FormApi,
    subscription?: FieldSubscription
  ): FieldRenderProps
}
