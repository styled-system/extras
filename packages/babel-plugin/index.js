const camelCase = require('lodash.camelcase')
const allCSSProperties = require('known-css-properties').all
const isPropValid = require('@emotion/is-prop-valid').default
const svgTags = require('svg-tags')
const pkg = require('./package.json')

const CSS_ID = '___systemCSS'

const cssProperties = allCSSProperties
  .filter(prop => !/^-/.test(prop))
  .map(camelCase)
  .filter(prop => !isPropValid(prop))

const defaultOptions = {
  breakpoints: [ '40em', '52em', '64em' ]
}

const propNames = [
  ...cssProperties,
  // props included in isPropValid
  'color',
  // todo: handle img, etc
  'width',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'display',
  'opacity',
  'overflow',
  'textDecoration',
  'transform',
  'cursor',
  // system props
  'bg',
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
  'marginX',
  'marginY',
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

module.exports = function(babel, opts) {
  const { types: t } = babel
  const options = Object.assign({}, defaultOptions, opts)
  const mediaQueries = options.breakpoints.map(createMediaQuery)
  const breakpoints = [ null, ...mediaQueries ]

  const visitSystemProps = {
    JSXAttribute (path, state) {
      const name = path.node.name.name
      if (!props[name]) return
      if (name === 'css') return

      const key = aliases[name] || name
      let value = path.node.value

      if (t.isJSXExpressionContainer(path.node.value)) {
        value = path.node.value.expression
        if (t.isArrayExpression(value)) {
          value = value.elements
        }
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

  const visitCSSProp = {
    ObjectExpression (path, state) {
      path.node.properties.unshift(...state.styles)
      path.stop()
    },
    CallExpression (path, state) {
      path.get('arguments.0').traverse(visitCSSProp, state)
    },
  }

  const applyCSSProp = (path, state) => {
    const styles = createStyles(state.props)
    if (!styles.length) return
    // get or create css prop
    const cssIndex = path.node.attributes
      .filter(attr => t.isJSXAttribute(attr))
      .findIndex(
        attr => attr.name && attr.name.name === 'css'
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

  return {
    name: 'styled-system',
    visitor: {
      Program: {
        exit (path, state) {
          if (!state.get('isJSX')) return
          path.unshiftContainer('body',
            t.importDeclaration(
              [
                t.importSpecifier(
                  t.identifier(CSS_ID),
                  t.identifier('css')
                )
              ],
              t.stringLiteral(pkg.name + '/css')
            )
          )
        }
      },
      JSXOpeningElement (path, state) {
        const name = path.node.name.name
        if (svgTags.includes(name)) return
        state.elementName = name
        state.props = []
        path.traverse(visitSystemProps, state)
        applyCSSProp(path, state)
        path.traverse(wrapCSSProp, state)
        state.set('isJSX', true)
      }
    }
  }
}
