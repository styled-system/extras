import syntaxJSX from '@babel/plugin-syntax-jsx'

const CSS_ID = '__systemCSS'

const defaultOptions = {
  breakpoints: [ '40em', '52em', '64em' ]
}

const propNames = [
  'color',
  'bg',
  'backgroundColor',
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
]

const props = propNames.reduce((acc, key) => ({
  ...acc,
  [key]: true
}), {})

const aliases = {
  bg: 'backgroundColor',
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  // shorthands
  marginX: [ 'marginLeft', 'marginRight' ],
  marginY: [ 'marginTop', 'marginBottom' ],
  paddingX: [ 'paddingLeft', 'paddingRight' ],
  paddingY: [ 'paddingTop', 'paddingBottom' ],
  mx: [ 'marginLeft', 'marginRight' ],
  my: [ 'marginTop', 'marginBottom' ],
  px: [ 'paddingLeft', 'paddingRight' ],
  py: [ 'paddingTop', 'paddingBottom' ],
}

const createMediaQuery = n => `@media screen and (min-width: ${n})`

export default function(babel, opts) {
  const { types: t } = babel
  const options = Object.assign({}, defaultOptions, opts)
  const mediaQueries = options.breakpoints.map(createMediaQuery)
  const breakpoints = [ null, ...mediaQueries ]

  const visitCSSProp = {
    ObjectExpression (path, state) {
      path.node.properties.unshift(...state.styles)
      path.stop()
    },
    CallExpression (path, state) {
      state.skipWrap = true
      path.get('arguments.0').traverse(visitCSSProp, state)
    },
    // ArrowFunctionExpression (path, state) {}
  }

  // convert system props to CSS object
  const createStyles = (props) => {
    const styles = []
    const responsiveStyles = []
    props.forEach(({ key, value }) => {
      const id = t.identifier(key)
      let val = value

      if (Array.isArray(val)) {
        val.forEach((node, i) => {
          if (i >= breakpoints.length) return
          const media = breakpoints[i]
          let style = t.objectProperty(
            id,
            node
          )
          if (!media) {
            return styles.push(style)
          }

          const breakpointIndex = responsiveStyles.findIndex(style => {
            return style.key.value === media
          })

          if (breakpointIndex < 0) {
            style = t.objectProperty(
              t.stringLiteral(media),
              t.objectExpression([style])
            )
            responsiveStyles.push(style)
          } else {
            responsiveStyles[breakpointIndex].value.properties.push(style)
          }
        })
      } else {
        const style = t.objectProperty(
          id,
          value
        )
        styles.push(style)
      }
    })
    return [...styles, ...responsiveStyles]
  }

  const applyCSSProp = (path, state) => {
    const styles = createStyles(state.props)
    if (!styles.length) return
    // get or create css prop
    const cssIndex = path.node.attributes.findIndex(
      attr => attr.name.name === 'css'
    )
    if (cssIndex < 0) {
      const cssAttribute = t.jSXAttribute(
        t.jSXIdentifier('css'),
        t.jSXExpressionContainer(
          t.objectExpression(styles)
        )
      )
      path.node.attributes.push(cssAttribute)
    } else {
      path.get(`attributes.${cssIndex}.value`).traverse(visitCSSProp, { styles })
    }
  }


  const __wrapCSSProp = {
    ObjectExpression (path, state) {
      if (state.skipWrap) console.log('dont wrap!!!')
      const parent = path.findParent(p => p.isJSXAttribute())
      if (parent.node.name.name !== 'css') return
      if (!parent.get('value.expression').isObjectExpression()) {
        console.log(parent.get('value.expression').node)
      }
      // wrap css prop
      const call = t.callExpression(
        t.identifier(CSS_ID),
        [ path.node ]
      )
      path.replaceWith(call)
      path.stop()
    }
  }
  const wrapCSSProp = {
    JSXAttribute (path, state) {
      if (path.node.name.name !== 'css') return
      const value = path.get('value.expression')
      if (!value.isObjectExpression()) return
      const call = t.callExpression(
        t.identifier(CSS_ID),
        [ value.node ]
      )
      value.replaceWith(call)
    }
  }

  const visitProps = {
    JSXAttribute (path, state) {
      const name = path.node.name.name
      if (!props[name]) return
      if (name === 'css') return

      const key = aliases[name] || name
      let value = path.node.value

      if (t.isJSXExpressionContainer(path.node.value)) {
        const visitPropValue = {
          ArrayExpression (path) {
            value = path.node.elements
            path.stop()
          },
          NumericLiteral (path) {
            value = path.node
          }
        }
        path.get('value').traverse(visitPropValue, { value })
      }

      if (Array.isArray(key)) {
        // handle mx, my, px, py, etc
        key.forEach(k => {
          state.props.push({ key: k, value })
        })
      } else {
        state.props.push({ key, value })
      }

      path.remove()
    }
  }

  return {
    name: 'styled-system',
    inherits: syntaxJSX,
    visitor: {
      Program: {
        exit (path, state) {
          path.unshiftContainer('body',
            t.importDeclaration(
              [
                t.importSpecifier(
                  t.identifier(CSS_ID),
                  t.identifier('default')
                )
              ],
              t.stringLiteral('babel-plugin-styled-system/css')
            )
          )
        }
      },
      JSXOpeningElement (path, state) {
        const name = path.node.name.name
        state.elementName = name
        state.props = []
        path.traverse(visitProps, state)
        applyCSSProp(path, state)
        path.traverse(wrapCSSProp, state)
      }
    }
  }
}
