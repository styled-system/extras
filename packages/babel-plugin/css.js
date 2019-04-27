import get from 'lodash.get'

const keys = {
  color: 'colors',
  backgroundColor: 'colors',
  borderColor: 'colors',
}

export const css = styles => theme => {
  const result = {}
  for (const key in styles) {
    const value = styles[key]
    if (value && typeof value === 'object') {
      result[key] = css(value)(theme)
      continue
    }
    result[key] = get(theme, `${keys[key]}.${value}`, value)
    const themeKey
  }
  return result
}

export default css
