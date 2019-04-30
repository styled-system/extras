import test from 'ava'
import css from './index'

const theme = {
  colors: {
    primary: 'tomato',
    secondary: 'cyan',
  },
  fontSizes: [
    12, 14, 16, 24, 36
  ],
  fonts: {
    monospace: 'Menlo, monospace',
  },
  lineHeights: {
    body: 1.5,
  },
  fontWeights: {
    bold: 600,
  },
}

test('returns a function', t => {
  const res = css()
  t.is(typeof res, 'function')
})

test('returns an object', t => {
  const res = css()()
  t.is(typeof res, 'object')
})

test('returns styles', t => {
  const res = css({
    fontSize: 32,
    color: 'blue',
    borderRadius: 4,
  })()
  t.deepEqual(res, {
    fontSize: 32,
    color: 'blue',
    borderRadius: 4,
  })
})

test('returns system props styles', t => {
  const res = css({
    color: 'primary',
    fontSize: [ 2, 3, 4]
  })({ theme })
  t.deepEqual(res, {
    fontSize: 16,
    '@media screen and (min-width: 40em)': {
      fontSize: 24,
    },
    '@media screen and (min-width: 52em)': {
      fontSize: 36,
    },
    color: 'tomato',
  })
})

test('returns nested system props styles', t => {
  const res = css({
    color: 'primary',
    '&:hover': {
      color: 'secondary',
    }
  })({ theme })
  t.deepEqual(res, {
    color: 'tomato',
    '&:hover': {
      color: 'cyan',
    }
  })
})

test('returns nested responsive styles', t => {
  const res = css({
    color: 'primary',
    h1: {
      py: [3, 4],
    }
  })({ theme })
  t.deepEqual(res, {
    color: 'tomato',
    h1: {
      paddingTop: 16,
      paddingBottom: 16,
      '@media screen and (min-width: 40em)': {
        paddingTop: 32,
        paddingBottom: 32,
      }
    }
  })
})

test('handles all core styled system props', t => {
  const res = css({
    m: 0,
    mb: 2,
    mx: 'auto',
    p: 3,
    py: 4,
    fontSize: 3,
    fontWeight: 'bold',
    color: 'primary',
    bg: 'secondary',
    fontFamily: 'monospace',
    lineHeight: 'body',
  })({ theme })
  t.deepEqual(res, {
    margin: 0,
    marginBottom: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 16,
    paddingTop: 32,
    paddingBottom: 32,
    color: 'tomato',
    backgroundColor: 'cyan',
    fontFamily: 'Menlo, monospace',
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1.5,
  })
})

test('works with the css prop', t => {
  const res = css({
    color: 'primary',
    m: 0,
    fontSize: 2,
  })(theme)
  t.deepEqual(res, {
    color: 'tomato',
    margin: 0,
    fontSize: 16,
  })
})

test('works with functional arguments', t => {
  const res = css(t => ({
    color: t.colors.primary,
  }))(theme)
  t.deepEqual(res, {
    color: 'tomato',
  })
})

test('supports functional values', t => {
  const res = css({
    color: t => t.colors.primary,
  })(theme)
  t.deepEqual(res, {
    color: 'tomato',
  })
})

test.todo('handles custom transforms')

// breaking
// test.skip('createCSS returns a custom css function')

// breaking
test.skip('props override default styles', t => {
  const res = css({
    color: 'primary',
  })({ theme, color: 'secondary' })
  t.deepEqual(res, {
    color: 'cyan'
  })
})

