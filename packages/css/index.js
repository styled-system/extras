import get from 'lodash.get'

const defaultBreakpoints = [40, 52, 64].map(n => n + 'em')

const defaultTheme = {
  space: [
    0, 4, 8, 16, 32, 64, 128, 256, 512
  ],
  fontSizes: [
    12, 14, 16, 20, 24, 32, 48, 64, 72
  ],
}

const aliases = {
  bg: 'backgroundColor',
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mx: [ 'marginLeft', 'marginRight' ],
  my: [ 'marginTop', 'marginBottom' ],
  marginX: [ 'marginLeft', 'marginRight' ],
  marginY: [ 'marginTop', 'marginBottom' ],
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  px: [ 'paddingLeft', 'paddingRight' ],
  py: [ 'paddingTop', 'paddingBottom' ],
  paddingX: [ 'paddingLeft', 'paddingRight' ],
  paddingY: [ 'paddingTop', 'paddingBottom' ],
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
  width: 'sizes',
  minWidth: 'sizes',
  maxWidth: 'sizes',
  height: 'sizes',
  minHeight: 'sizes',
  maxHeight: 'sizes',
}

export const responsive = styles => theme => {
  const next = {}
  const breakpoints = get(theme, 'breakpoints', [ '40em', '52em', '64em' ])
  const mediaQueries = [ null, ...breakpoints.map(n => `@media screen and (min-width: ${n})`) ]

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

export const css = args => (props = {}) => {
  const theme = { ...defaultTheme, ...(props.theme || props) }
  const result = {}
  const obj = typeof args === 'function' ? args(theme) : args
  const styles = responsive(obj)(theme)

  for (const key in styles) {
    const prop = aliases[key] || key
    const scaleName = scales[prop] || scales[prop[0]]
    const scale = get(theme, scaleName, get(theme, prop, {}))
    const x = styles[key]
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

export default css
