
# @styled-system/css

Styled System for your `css` prop

```sh
npm i @styled-system/css
```

Styled System CSS lets you write style objects with responsive, theme-aware Styled System shortcuts.

```jsx
// usage with the css prop
import React from 'react'
import css from '@styled-system/css'

const Beep = props =>
  <div
    {...props}
    css={css({
      fontSize: [4, 5, 6],
      color: 'primary',
    })}
  />
```

```js
// usage with styled components
import styled from '@emotion/styled'
import css from '@styled-system/css'

const Boop = styled(
  css({
    fontSize: [ 4, 5, 6 ],
    color: 'primary',
    bg: 'gray',
    '&:hover': {
      color: 'secondary',
    },
  })
)
```

## Keys

The following keys in your style object will work the same as Styled System props, pulling values from your `theme` object and converting arrays to responsive styles.

- `fontFamily`
- `fontSize`
- `fontWeight`
- `lineHeight`
- `color`
- `bg`, `backgroundColor`
- `m`, `margin`
- `mt`, `marginTop`
- `mr`, `marginRight`
- `mb`, `marginBottom`
- `ml`, `marginLeft`
- `mx`
- `my`
- `p`, `padding`
- `pt`, `paddingTop`
- `pr`, `paddingRight`
- `pb`, `paddingBottom`
- `pl`, `paddingLeft`
- `px`
- `py`

In this example, `fontSize` accepts an array, and `borderBottom` is passed through as plain CSS.

```jsx
<div
  css={css({
    // Styled System key
    fontSize: [ 3, 4, 5 ],
    // CSS property
    borderBottom: '2px solid tomato',
  })}
/>
```

## Props

When using `@styled-system/css` with styled components,
Styled System props can be used on the resulting component.

```jsx
<Beep
  color='primary'
  bg='black'
/>
```


MIT License
