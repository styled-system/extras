
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
  mt: 'margin-top',
  mr: 'margin-top',
  mb: 'margin-top',
  ml: 'margin-top',
  p: 'padding',
  pt: 'padding-top',
  pr: 'padding-top',
  pb: 'padding-top',
  pl: 'padding-top',
  // shorthands
  marginX: [ 'margin-left', 'margin-right' ],
  marginY: [ 'margin-top', 'margin-bottom' ],
  paddingX: [ 'padding-left', 'padding-right' ],
  paddingY: [ 'padding-top', 'padding-bottom' ],
  mx: [ 'margin-left', 'margin-right' ],
  my: [ 'margin-top', 'margin-bottom' ],
  px: [ 'padding-left', 'padding-right' ],
  py: [ 'padding-top', 'padding-bottom' ],
}

export default function(babel) {
  const { types: t } = babel

  const applyCSSProp = (path, state) => {
    // convert system props to CSS object
    const styles = []
    state.props.forEach(({ key, value }) => {
      const id = t.identifier(key)
      let val = value
      const style = t.objectProperty(
        id,
        value
      )
      styles.push(style)
    })

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
      if (t.isObjectExpression(path.node.attributes[cssIndex].value.expression)) {
        path.node.attributes[cssIndex].value.expression.properties.unshift(...styles)
      } else {
        // function call, arrays?
        console.log('todo: handle css prop',
          path.node.attributes[cssIndex].value.expression
        )
      }
    }
  }

  const visitProps = {
    JSXAttribute (path, state) {
      const name = path.node.name.name
      if (!props[name]) return

      const key = aliases[name] || name
      let value = path.node.value

      if (t.isJSXExpressionContainer(path.node.value)) {
        if (t.isObjectExpression(path.node.value.expression)) {
          return console.log('object')
        }
        if (t.isArrayExpression(path.node.value.expression)) {
          return console.log('array')
        }
        if (t.isNumericLiteral) {
          value = path.node.value.expression
        }
      }

      if (Array.isArray(key)) {
      // // handle mx, my, px, py, etc
      }
      state.props.push({ key, value })
      path.remove()
    }
  }

  return {
    name: 'styled-system',
    // what's the new hotness for this?
    // inherits: require('@babel/plugin-syntax-jsx'),
    visitor: {
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
