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

export default function(babel) {
  const { types: t } = babel
  let options = defaultOptions
  let breakpoints

  const visitCSSProp = {
    ObjectExpression (path, state) {
      if (!t.isObjectExpression(path.node)) console.log('WUT', path.node)
      path.node.properties.unshift(...state.styles)
    },
    CallExpression (path, state) {
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
            return style.key.name === media
          })

          if (breakpointIndex < 0) {
            style = t.objectProperty(
              t.identifier(media),
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
    // what's the new hotness for this?
    // inherits: require('@babel/plugin-syntax-jsx'),
    visitor: {
      Program (path, state) {
        options = Object.assign({}, defaultOptions, state.opts)
        const mediaQueries = options.breakpoints.map(createMediaQuery)
        breakpoints = [ null, ...mediaQueries ]
      },
      JSXOpeningElement (path, state) {
        const name = path.node.name.name
        state.elementName = name
        state.props = []
        path.traverse(visitProps, state)
        applyCSSProp(path, state)
      }
    }
  }
}
