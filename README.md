# 🏁 React Final Form Hooks

![React Final Form Hooks](banner.png)

[![Backers on Open Collective](https://opencollective.com/final-form/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/final-form/sponsors/badge.svg)](#sponsors) [![NPM Version](https://img.shields.io/npm/v/react-final-form-hooks.svg?style=flat)](https://www.npmjs.com/package/react-final-form-hooks)
[![NPM Downloads](https://img.shields.io/npm/dm/react-final-form-hooks.svg?style=flat)](https://www.npmjs.com/package/react-final-form-hooks)
[![Build Status](https://travis-ci.org/final-form/react-final-form-hooks.svg?branch=master)](https://travis-ci.org/final-form/react-final-form-hooks)
[![codecov.io](https://codecov.io/gh/final-form/react-final-form-hooks/branch/master/graph/badge.svg)](https://codecov.io/gh/final-form/react-final-form-hooks)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

✅ Zero dependencies

✅ Only peer dependencies: React and
[🏁 Final Form](https://github.com/final-form/final-form#-final-form)

✅ Opt-in subscriptions - only update on the state you need!

✅ 💥 [**1.2 kB gzipped**](https://bundlephobia.com/result?p=react-final-form-hooks) 💥

---

## Installation

```bash
npm install --save react-final-form-hooks final-form
```

or

```bash
yarn add react-final-form-hooks final-form
```

## Getting Started

🏁 React Final Form Hooks is the leanest possible way to connect 🏁 Final Form to React, to acheive subscriptions-based form state management using the [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern).

#### ⚠️ This library will re-render your entire form on every state change, _as you type_. ⚠️

If performance is your goal, you are recommended to use [🏁 React Final Form](https://github.com/final-form/react-final-form). Also, that library does many other things for you, like managing checkbox and radio buttons properly. RFFHooks leaves all of that work to you. By default, 🏁 React Final Form Hooks subscribes to _all_ changes, but if you want to fine tune your form, you may specify only the form state that you care about for rendering your gorgeous UI.

If you like the the developer experience of using React hooks but need the full featureset of 🏁React Final Form, then help is on the way: starting with v5.0, 🏁 React Final Form will export `useField` and `useFormState` hooks that can simplify field handling. These new hooks don't cover the entire surface area of 🏁 React Final Form because some features still require render props, but they will provide a more flexible and feature-rich solution compared to the bare-bones approach of `react-final-form-hooks`. To track this work before V5 is released, you can follow the [work-in-progress PR](https://github.com/final-form/react-final-form/pull/467).

Here's what it looks like in your code:

```jsx
import { useForm, useField } from 'react-final-form-hooks'

const MyForm = () => {
  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit, // the function to call with your form values upon valid submit
    validate // a record-level validation function to check all form values
  })
  const firstName = useField('firstName', form)
  const lastName = useField('lastName', form)
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <input {...firstName.input} placeholder="First Name" />
        {firstName.meta.touched && firstName.meta.error && (
          <span>{firstName.meta.error}</span>
        )}
      </div>
      <div>
        <label>Last Name</label>
        <input {...lastName.input} placeholder="Last Name" />
        {lastName.meta.touched && lastName.meta.error && (
          <span>{lastName.meta.error}</span>
        )}
      </div>
      <button type="submit" disabled={pristine || submitting}>
        Submit
      </button>
    </form>
  )
}
```

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Examples](#examples)
  - [Simple Example](#simple-example)
- [API](#api)
  - [`useField`](#usefield)
    - [`name : string`](#name--string)
    - [`form : Form`](#form--form)
    - [`validate? : (value:any) => any`](#validate--valueany--any)
    - [`subscription? : FieldSubscription`](#subscription--fieldsubscription)
  - [`useForm`](#useform)
    - [`onSubmit : (values:Object) => ?Object | Promise<?Object> | void`](#onsubmit--valuesobject--object--promiseobject--void)
    - [`validate?: (values:Object) => Object | Promise<Object>`](#validate-valuesobject--object--promiseobject)
- [Contributors](#contributors)
- [Backers](#backers)
- [Sponsors](#sponsors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Examples

### [Simple Example](https://codesandbox.io/s/r4j042m694)

Shows how to create fields and attach them to `<input/>` elements.

## API

The following can be imported from `react-final-form-hooks`.

### `useField`

Returns an object similar to [`FieldRenderProps`](https://github.com/final-form/react-final-form#fieldrenderprops).

`useField` takes four parameters:

#### `name : string`

> The name of the field. Required.

#### `form : Form`

> The object returned from `useForm`. Required.

#### `validate? : (value:any) => any`

> A field-level validation function that takes the current value and returns `undefined` if it is valid, or the error if it is not. Optional.

#### `subscription? : FieldSubscription`

> A subscription of which parts of field state to be notified about. See [`FieldSubscription`](https://github.com/final-form/final-form#fieldsubscription--string-boolean-). Optional.

### `useForm`

Returns an object similar to [`FormRenderProps`](https://github.com/final-form/react-final-form#formrenderprops).

`useForm` takes two parameters:

#### `onSubmit : (values:Object) => ?Object | Promise<?Object> | void`

See [🏁 Final Form's `onSubmit` docs](https://github.com/final-form/final-form#onsubmit-values-object-form-formapi-callback-errors-object--void--object--promiseobject--void) for more information. Required.

#### `validate?: (values:Object) => Object | Promise<Object>`

A record level validation function. See [🏁 Final Form's `validate` docs](https://github.com/final-form/final-form#validate-values-object--object--promiseobject) for more information. Optional.

---

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](.github/CONTRIBUTING.md)].
<a href="https://github.com/final-form/react-final-form-hooks/graphs/contributors"><img src="https://opencollective.com/final-form/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/final-form#backer)]

<a href="https://opencollective.com/final-form#backers" target="_blank"><img src="https://opencollective.com/final-form/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/final-form#sponsor)]

<a href="https://opencollective.com/final-form/sponsor/0/website" target="_blank"><img src="https://opencollective.com/final-form/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/final-form/sponsor/1/website" target="_blank"><img src="https://opencollective.com/final-form/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/final-form/sponsor/2/website" target="_blank"><img src="https://opencollective.com/final-form/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/final-form/sponsor/3/website" target="_blank"><img src="https://opencollective.com/final-form/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/final-form/sponsor/4/website" target="_blank"><img src="https://opencollective.com/final-form/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/final-form/sponsor/5/website" target="_blank"><img src="https://opencollective.com/final-form/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/final-form/sponsor/6/website" target="_blank"><img src="https://opencollective.com/final-form/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/final-form/sponsor/7/website" target="_blank"><img src="https://opencollective.com/final-form/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/final-form/sponsor/8/website" target="_blank"><img src="https://opencollective.com/final-form/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/final-form/sponsor/9/website" target="_blank"><img src="https://opencollective.com/final-form/sponsor/9/avatar.svg"></a>
