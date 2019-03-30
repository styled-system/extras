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

const getSystemProps = funcs => [
  ...funcs.map(fn => Object.keys(fn.propTypes))
    .reduce((a, props) => [ ...a, ...props ], []),
  'theme',
  'mx',
  'my',
  'px',
  'py',
]

export const createCSS = (funcs) => {
  const systemProps = getSystemProps(funcs)

  const systemRegExp = new RegExp(
    `^(${systemProps.join('|')})$`
  )

  const styles = props => omit(props, systemProps)

  const system = compose(
    styles,
    ...funcs
  )

  const css = style => (props = {}) => {
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
  return css
}

export const css = createCSS([
  space,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight
])

export default css
