/** @jsx jsx */
import jsx from './index'
import renderer from 'react-test-renderer'
import serializer, { matchers } from 'jest-emotion'
import { ThemeContext } from '@emotion/core'

expect.addSnapshotSerializer(serializer)
expect.extend(matchers)

const renderJSON = el => renderer.create(el).toJSON()

const theme = {
  colors: {
    primary: '#609'
  }
}

test('renders with styles', () => {
  const json = renderJSON(
    <div
      css={{
        color: 'tomato'
      }}
    />
  )
  expect(json).toHaveStyleRule('color', 'tomato')
})

test('renders with responsive styles', () => {
  const json = renderJSON(
    <div
      css={{
        padding: [ 4, 8, 16 ]
      }}
    />
  )
  expect(json).toHaveStyleRule('padding', '4px')
  expect(json).toHaveStyleRule('padding', '8px', {
    media: 'screen and (min-width: 40em)'
  })
  expect(json).toHaveStyleRule('padding', '16px', {
    media: 'screen and (min-width: 52em)'
  })
})

test('renders with shorthand props', () => {
  const json = renderJSON(
    <div
      css={{
        m: 8,
        p: 16,
        bg: 'tomato',
      }}
    />
  )
  expect(json).toHaveStyleRule('margin', '8px')
  expect(json).toHaveStyleRule('padding', '16px')
  expect(json).toHaveStyleRule('background-color', 'tomato')
})

test('renders with theme values', () => {
  const json = renderJSON(
    <ThemeContext.Provider value={theme}>
      <div
        css={{
          color: 'primary',
        }}
      />
    </ThemeContext.Provider>
  )
  expect(json).toHaveStyleRule('color', '#609')
})

test('renders nested styles', () => {
  const json = renderJSON(
    <div
      css={{
        '&:hover': {
          color: 'tomato',
        }
      }}
    />
  )
  expect(json).toHaveStyleRule('color', 'tomato', {
    target: ':hover'
  })
})
