
# babel-plugin-styled-system

Convert Styled System props to `css` prop

```js
// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
  ],
  plugins: [
    'babel-plugin-emotion',
    'babel-plugin-styled-system',
  ]
}
```

```jsx
// in
<div color='tomato' px={32} />

// out
<div
  css={{
    color: 'tomato',
    paddingLeft: 32,
    paddingRight: 32,
  }}
/>
```

- [x] Handle existing `css` prop functions
- [x] Handle responsive array props
- [ ] Parse `css` prop for Styled System props
- [ ] Use values from theme

