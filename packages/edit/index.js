/** @jsx jsx */
import { jsx, ThemeContext } from '@emotion/core'
import React, { useReducer, useContext } from 'react'
import { ThemeProvider } from 'emotion-theming'
import merge from 'lodash.merge'
import omit from 'lodash.omit'
import Color from 'color'

export const EditContext = React.createContext({})

// not actually a reducer
const reducer = (state, next) => merge({}, state, next)

export const EditProvider = ({
  initialTheme,
  ignore = [ 'styles' ],
  children,
}) => {
  const theme = useContext(ThemeContext) || initialTheme
  const [ state, setState ] = useReducer(reducer, theme)
  const context = {
    ignore,
    state,
    setState
  }

  return (
    <EditContext.Provider value={context}>
      <ThemeProvider theme={state}>
        {children}
      </ThemeProvider>
    </EditContext.Provider>
  )
}

export const Field = ({
  type = 'text',
  name,
  value,
  onChange,
  ...props
}) => {
  const isNumber = type === 'number' || typeof value === 'number'
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <label
        htmlFor={name}
        css={{
          fontSize: 12,
          fontFamily: 'Menlo, monospace',
          width: '65%',
        }}>
        {name}
      </label>
      <input
        type={isNumber ? 'number' : type}
        {...props}
        id={name}
        name={name}
        value={value}
        onChange={e => {
          const val = isNumber
            ? parseFloat(e.target.value)
            : e.target.value
          onChange(val)
        }}
        css={{
          fontFamily: 'Menlo, monospace',
          fontSize: 12,
          width: '35%',
        }}
      />
    </div>
  )
}

const toHex = n => {
  try {
    return Color(n).hex()
  } catch (e) {
    return n
  }
}

export const ColorField = ({
  name,
  value,
  onChange,
}) =>
  <div
    css={{
    }}>
    <label
      css={{
        display: 'flex',
        alignItems: 'center',
        fontSize: 12,
        fontFamily: 'Menlo, monospace',
      }}>
      <div
        css={{
          width: '65%',
        }}>
        {name}
      </div>
      <input
        type='color'
        value={toHex(value)}
        onChange={e => onChange(e.target.value)}
        css={{
          appearance: 'none',
          backgroundColor: 'transparent',
          height: 24,
          alignSelf: 'stretch',
          border: 0,
          padding: 0,
          margin: 0,
        }}
      />
      <input
        type='text'
        id={name}
        name={name}
        value={value}
        onChange={e => {
          onChange(e.target.value)
        }}
        css={{
          fontFamily: 'Menlo, monospace',
          fontSize: 12,
          width: '30%',
        }}
      />
    </label>
  </div>

export const SelectField = ({
  name,
  value,
  onChange,
  options,
}) =>
  <label
    css={{
      display: 'flex',
      alignItems: 'center',
      fontSize: 12,
      fontFamily: 'Menlo, monospace',
    }}>
    <div
      css={{
        width: '65%',
      }}>
      {name}
    </div>
    <select
      value={value}
      onChange={e => {
        const val = typeof value === 'number'
          ? parseFloat(e.target.value)
          : e.target.value
        onChange(val)
      }}
      css={{
        appearance: 'none',
        margin: 0,
        width: '35%',
      }}>
      {options.map(val => (
        <option
          key={val}
          value={val}
          label={val}
        />
      ))}
    </select>
  </label>

export const FieldSet = ({
  name,
  value,
  setState,
  type = {},
  ...props
}) => {
  return (
    <div>
      <h3
        css={{
          marginTop: 0,
          marginBottom: 0,
        }}>
        {name}
      </h3>
      {Object.keys(omit(value, props.ignore)).map(key => {
        const val = value[key]
        if (val && typeof val === 'object') {
          return (
            <FieldSet
              name={`${name}.${key}`}
              value={val}
              setState={setState}
              type={type}
              {...props}
            />
          )
        }
        switch (type.type) {
          case 'number':
            return (
              <Field
                key={key}
                name={`${name}.${key}`}
                {...type}
                value={val}
                onChange={next => {
                  // number check?
                  setState({
                    [name]: {
                      [key]: next
                    }
                  })
                }}
              />
            )
          case 'color':
            return (
              <ColorField
                key={key}
                name={`${name}.${key}`}
                type='text'
                value={val}
                onChange={next => {
                  setState({
                    [name]: {
                      [key]: next
                    }
                  })
                }}
              />
            )
          case 'select':
            return (
              <SelectField
                key={key}
                name={`${name}.${key}`}
                value={val}
                {...type}
                onChange={next => (
                  setState({
                    [name]: {
                      [key]: next
                    }
                  })
                )}
              />
            )
          default:
            return (
              <Field
                key={key}
                name={`${name}.${key}`}
                value={val}
                onChange={next => {
                  setState({
                    [name]: {
                      [key]: next
                    }
                  })
                }}
              />
            )
        }
      })}
    </div>
  )
}

export const ThemeControls = ({
  ignore,
  fieldTypes = {},
  ...props
}) => {
  const context = useContext(EditContext)
  const keys = Object.keys(
    omit(context.state, ignore || context.ignore)
  )
  return (
    <div
      {...props}
      css={{
        fontFamily: 'system-ui, sans-serif',
        lineHeight: 1.5,
        color: '#000',
        backgroundColor: '#eee',
        maxWidth: 320,
        padding: 8,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
      {keys.map(key => (
        <FieldSet
          key={key}
          {...context}
          type={fieldTypes[key]}
          name={key}
          value={context.state[key]}
        />
      ))}
    </div>
  )
}
