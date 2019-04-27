
# babel-plugin-styled-system

Convert Styled System props to `css` prop

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

- [ ] Handle existing `css` prop functions
- [ ] Handle responsive array props
- [ ] Handle responsive object props
- [ ] Parse `css` prop for Styled System props
- [ ] Use values from theme

