import get from 'lodash.get'

const keys = {
  fontSize: 'fontSizes',
  fontFamily: 'fonts',
  fontWeight: 'fontWeights',
  letterSpacing: 'letterSpacings',
}
const setKeys = (key, props) => {
  props.forEach(prop => {
    keys[prop] = key
  })
}

setKeys('colors', [
  'color',
  'backgroundColor',
  'borderColor',
])

setKeys('space', [
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginX',
  'marginY',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingX',
  'paddingY',
  'm',
  'mt',
  'mr',
  'mb',
  'ml',
  'mx',
  'my',
  'p',
  'pt',
  'pr',
  'pb',
  'pl',
  'px',
  'py',
])

setKeys('sizes', [
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
])

setKeys('borders', [
  'border',
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
])
setKeys('borderWidths', ['borderWidth'])
setKeys('borderStyles', ['borderStyle'])
setKeys('radii', ['borderRadius'])
setKeys('zIndices', ['zIndex'])

const getScaleValue = (scale, x) => {
  if (typeof x !== 'number' || x >= 0) return get(scale, x, x)
  const abs = Math.abs(x)
  const n = get(scale, abs, abs)
  return n * -1
}

export const css = styles => theme => {
  const result = {}
  for (const key in styles) {
    const value = styles[key]
    if (value && typeof value === 'object') {
      result[key] = css(value)(theme)
      continue
    }
    result[key] = getScaleValue(get(theme, keys[key], {}), value)
  }
  return result
}

export default css
