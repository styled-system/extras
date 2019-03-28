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
  ...Object.keys({
    ...space.propTypes,
    ...color.propTypes,
    ...fontFamily.propTypes,
    ...fontSize.propTypes,
    ...fontWeight.propTypes,
    ...lineHeight.propTypes,
  }),
  'theme',
  'mx',
  'my',
  'px',
  'py',
  'color',
]

const systemRegExp = new RegExp(
  `^(${systemProps.join('|')})$`
)

const styles = props => omit(props, systemProps)

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
  const theme = props.theme || props
  const styleProps = pick(props, systemProps)
  const styles = [
    ...system({ theme, ...style, ...styleProps })
  ]
  for (const key in style) {
    const value = style[key]
    if (!value || typeof value !== 'object') continue
    if (systemRegExp.test(key)) continue
    styles.push({
      [key]: css(value)({ theme })
    })
  }
  return merge(
    ...flatten(styles.filter(Boolean))
  )
}

export default css
