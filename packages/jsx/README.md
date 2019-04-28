
# @styled-system/jsx

Custom JSX pragma for `css` prop with Styled System - built with [Emotion][]

```jsx
/** @jsx jsx */
import jsx from '@styled-system/jsx'

export default props =>
  <div
    {...props}
    css={{
      fontSize: 32,
      // use theme values
      color: 'primary',
      // responsive arrays
      p: [ 2, 3, 4 ]
    }}
  />
```

[emotion]: https://emotion.sh

MIT License
