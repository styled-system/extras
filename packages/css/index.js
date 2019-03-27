import {
  compose,
  space,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} from 'styled-system'
import omit from 'lodash.omit'
import pick from 'lodash.pick'
import flatten from 'lodash.flatten'
import merge from 'lodash.merge'

const systemProps = [
  'theme',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
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
  'color',
  'bg',
  'backgroundColor',
  'fontSize',
  'fontWeight',
  'lineHeight',
]
const systemRE = new RegExp(
  `^(${systemProps.join('|')})$`
)

const styles = props => omit(props, systemProps)
// const notEmpty = n => Object.keys(n).length > 0

export const system = compose(
  styles,
  space,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight
)

export const css = style => (props = {}) => {
  const { theme } = props
  const styleProps = pick(props, systemProps)
  const styles = [
    ...system({ theme, ...style, ...styleProps })
  ]
  for (const key in style) {
    const value = style[key]
    if (!value || typeof value !== 'object') continue
    if (systemRE.test(key)) continue
    styles.push({
      [key]: css(value)({ theme })
    })
  }
  return merge(
    ...flatten(styles.filter(Boolean))
  )
}

export default css
