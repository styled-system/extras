import test from 'ava'
import { transformSync } from '@babel/core'
import jsxSyntax from '@babel/plugin-syntax-jsx'
import react from '@babel/preset-react'
import emotionPreset from '@emotion/babel-preset-css-prop'
import emotionPlugin from 'babel-plugin-emotion'
import system from './index'
import css from './css'

const plugins = [
  jsxSyntax,
  system,
]

const parse = jsx => transformSync(jsx, {
  configFile: false,
  plugins
}).code
const parseEmotion = jsx => transformSync(jsx, {
  configFile: false,
  presets: [
    emotionPreset
  ],
  plugins: [
    ...plugins,
  ],
}).code

test('parses style props', t => {
  const result = parse(`
    <div color='tomato' bg='blue' />
  `)
  t.snapshot(result)
})

test('parses multiple elements', t => {
  const result = parse(`
    <div p={4}>
      <h1 color='tomato'>Hello</h1>
    </div>
  `)
  t.snapshot(result)
})

test('applies styles to existing css prop', t => {
  const result = parse(`
    <div
      color='black'
      p={4}
      css={{
        border: '2px solid',
        fontFamily: 'system-ui',
      }}>
      <h1 color='tomato'>Hello</h1>
    </div>
  `)
  t.snapshot(result)
})

test('applies styles to existing css prop functions', t => {
  const result = parse(`
    <div
      p={4}
      css={cx({
        color: 'tomato',
      })}
    />
  `)
  t.snapshot(result)
})

test('applies styles to existing inline css arrow functions', t => {
  const result = parse(`
    <div
      p={4}
      css={theme => ({
        color: 'tomato',
      })}
    />
  `)
  t.snapshot(result)
})

test('applies styles to existing inline css arrow functions with return', t => {
  const result = parse(`
    <div
      p={4}
      css={theme => {
        return {
          color: 'tomato',
        }
      }}
    />
  `)
  t.snapshot(result)
})

test('applies styles to existing inline css arrow functions with array return', t => {
  const result = parse(`
    <div
      p={4}
      css={theme => {
        return {
          color: 'tomato',
        }
      }}
    />
  `)
  t.is(typeof result, 'string')
})

test('does not wrap non css props', t => {
  const result = parse(`
    <div
      style={{
        color: 'blue'
      }}
    />
  `)
  t.snapshot(result)
})

test('handles array props', t => {
  const result = parse(`
    <div
      m={[ 0, 4, 8 ]}
    />
  `)
  t.snapshot(result)
})

test('handles multidirectional props', t => {
  const result = parse(`
    <div px={3} />
  `)
  t.snapshot(result)
})

test('handles responsive multidirectional props', t => {
  const result = parse(`
    <div px={[ 0, 2, 3 ]} />
  `)
  t.snapshot(result)
})

test('merges array prop styles', t => {
  const result = parse(`
    <div p={[ 0, 2 ]} bg={[ 'transparent', 'black' ]} />
  `)
  t.snapshot(result)
})

test('ignores array props that have a length greater than breakpoints', t => {
  const result = parse(`
    <div m={[ 0, 1, 2, 3, 4, 5, 6 ]} />
  `)
  t.snapshot(result)
})

test('kitchen sink', t => {
  const result = parse(`
    <div
      m={[ 0, 1, 2 ]}
      p={3}
      py={[ 4, 5 ]}
      marginBottom={3}
      bg='tomato'
      color='white'
      css={{
        border: '2px solid gold',
      }}
    />
  `)
  t.snapshot(result)
})

test.todo('handles array props with expressions')
test.todo('handles array props with multiple keys')

test('handles expressions in props', t => {
  const result = parse(`
    <div
      color={props.color}
    />
  `)
  t.snapshot(result)
})

test('handles negative numbers', t => {
  const result = parse(`
    <div
      mx={-4}
    />
  `)
  t.snapshot(result)
})

test('works with emotion plugin', t => {
  const result = parseEmotion(`
    import React from 'react'

    export default () =>
      <div
        bg='black'
        css={{
          color: 'tomato'
        }}
      />
  `)
  t.snapshot(result)
})

test('works with emotion plugin without css prop', t => {
  const result = parseEmotion(`
    import React from 'react'

    export default () =>
      <Box
        mx='auto'
      />
  `)
  t.snapshot(result)
})

test('css converts negative theme values', t => {
  const style = css({
    marginLeft: -4,
    marginRight: -4,
  })({
    space: [ 0, 4, 8, 16, 32 ]
  })
  t.deepEqual(style, {
    marginLeft: -32,
    marginRight: -32,
  })
})

