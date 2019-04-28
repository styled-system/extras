import { jsx as emotion } from '@emotion/core'
import get from 'lodash.get'

const aliases = {
  bg: 'backgroundColor',
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mx: [ 'marginLeft', 'marginRight' ],
  my: [ 'marginTop', 'marginBottom' ],
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  px: [ 'paddingLeft', 'paddingRight' ],
  py: [ 'paddingTop', 'paddingBottom' ],
}

const scales = {
  color: 'colors',
  backgroundColor: 'colors',
  borderColor: 'colors',
  margin: 'space',
  marginTop: 'space',
  marginRight: 'space',
  marginBottom: 'space',
  marginLeft: 'space',
  padding: 'space',
  paddingTop: 'space',
  paddingRight: 'space',
  paddingBottom: 'space',
  paddingLeft: 'space',
  fontFamily: 'fonts',
  fontSize: 'fontSizes',
  fontWeight: 'fontWeights',
  lineHeight: 'lineHeights',
  letterSpacing: 'letterSpacings',
  border: 'borders',
  borderTop: 'borders',
  borderRight: 'borders',
  borderBottom: 'borders',
  borderLeft: 'borders',
  borderWidth: 'borderWidths',
  borderStyle: 'borderStyles',
  borderRadius: 'radii',
  boxShadow: 'shadows',
  zIndex: 'zIndices',
  // new/breaking
  width: 'sizes',
  minWidth: 'sizes',
  maxWidth: 'sizes',
  height: 'sizes',
  minHeight: 'sizes',
  maxHeight: 'sizes',
}

const responsive = styles => theme => {
  const next = {}
  const breakpoints = get(theme, 'breakpoints', [ '40em', '52em', '64em' ])
  const mediaQueries = [ null, ...breakpoints.map(n => `@media screen and (min-width:${n})`) ]

  for (const key in styles) {
    const value = styles[key]
    if (value && !Array.isArray(value) && typeof value === 'object') {
      next[key] = responsive(value)(theme)
      continue
    }
    if (!Array.isArray(value)) {
      next[key] = value
      continue
    }
    value.forEach((val, i) => {
      const media = mediaQueries[i]
      if (!media) {
        next[key] = val
        return
      }
      next[media] = next[media] || {}
      next[media][key] = val
    })
  }

  return next
}

const css = args => theme => {
  const result = {}
  const obj = typeof args === 'function' ? args(theme) : args
  const styles = responsive(obj)(theme)

  for (const key in styles) {
    const prop = aliases[key] || key
    const scaleName = scales[prop] || scales[prop[0]]
    const scale = get(theme, scaleName, {})
    const x = styles[key]
    // hot new shit
    const val = typeof x === 'function' ? x(theme) : x
    if (val && typeof val === 'object') {
      result[prop] = css(val)(theme)
      continue
    }
    const value = get(scale, val, val)
    if (Array.isArray(prop)) {
      prop.forEach(p => {
        result[p] = value
      })
    } else {
      result[prop] = value
    }
  }

  return result
}

export const jsx = (type, props, ...children) => {
  return emotion.apply(undefined, [
    type,
    props ? ({
      ...props,
      css: css(props.css)
    }) : null,
    ...children
  ])
}

export default jsx
