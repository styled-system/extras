import test from 'ava'
import { transformSync } from '@babel/core'
import jsxSyntax from '@babel/plugin-syntax-jsx'
import system from './index'

const plugins = [
  jsxSyntax,
  system,
]

const parse = jsx => transformSync(jsx, { plugins }).code

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

test.todo('applies styles to existing css prop functions')
