import { jsx as emotion } from '@emotion/core'
import css from '@styled-system/css'
import get from 'lodash.get'

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
