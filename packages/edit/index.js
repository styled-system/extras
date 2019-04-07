/** @jsx jsx */
import { jsx, ThemeContext } from '@emotion/core'
import React, { useReducer, useContext } from 'react'
import { ThemeProvider } from 'emotion-theming'
import merge from 'lodash.merge'
import omit from 'lodash.omit'

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
  name,
  value,
  onChange
}) => {
  const isNumber = typeof value === 'number'
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
        type={isNumber ? 'number' : 'text'}
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

export const FieldSet = ({
  name,
  value,
  setState,
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
              {...props}
            />
          )
        }
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
      })}
    </div>
  )
}

export const ThemeControls = props => {
  const context = useContext(EditContext)
  const keys = Object.keys(
    omit(context.state, context.ignore)
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
          name={key}
          value={context.state[key]}
        />
      ))}
    </div>
  )
}
