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

export const css = styles => theme => {
  const result = {}
  for (const key in styles) {
    const value = styles[key]
    if (value && typeof value === 'object') {
      result[key] = css(value)(theme)
      continue
    }
    result[key] = get(theme, `${keys[key]}.${value}`, value)
  }
  return result
}

export default css
