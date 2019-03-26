import {
  compose,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  space,
  color,
  maxWidth,
} from 'styled-system'
import pick from 'lodash.pick'
import omit from 'lodash.omit'
import flatten from 'lodash.flattendeep'
import merge from 'lodash.merge'

import * as themes from './themes'
export { reset } from './reset'
export { themes }

export const tagNames = [
  'body',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
  'p',
  'ol',
  'ul',
  'dl',
  'dd',
  'li',
  'blockquote',
  'hr',
  'img',
  'pre',
  'code',
  'samp',
  'kbd',
  'table',
  'tr',
  'th',
  'td',
  'b',
  'strong',
  'em',
  'i',
  'abbr',
]

export const systemProps = [
  'theme',
  'm', 'mt', 'mr', 'mb', 'ml', 'mx', 'my',
  'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py',
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
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'color',
  'bg',
  'backgroundColor',
]

const css = props => omit(props, systemProps)

export const typographyStyles = compose(
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  space,
  color,
  css
)

export const typography = props => {
  // handle emotion's Global and css props
  const theme = props.theme || props
  theme.typography = theme.typography || {}
  const styles = {}
  const elements = pick(theme.typography, tagNames)
  for (const key in elements) {
    const el = elements[key]
    const rules = typographyStyles({ theme, ...el })
    if (key === 'body') {
      styles['&'] = merge(...flatten(rules))
    }
    styles[key] = merge(...flatten(rules))
  }

  return styles
}

export default typography
