
# @styled-system/css

Overload style objects with theme-aware Styled System props

```sh
npm i @styled-system/css
```

```js
import styled from '@emotion/styled'
import css from '@styled-system/css'

const Beep = styled(
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

```jsx
// usage with the css prop
import React from 'react'
import css from '@styled-system/css'

const Boop = props =>
  <div
    {...props}
    css={css({
      fontSize: [4, 5, 6],
      color: 'primary',
    })}
  />
```

## Props

When using `@styled-system/css` with styled components, the following style props will be available on the component:

- `fontFamily`
- `fontSize`
- `fontWeight`
- `lineHeight`
- `color`
- `bg`
- `m`
- `mt`
- `mr`
- `mb`
- `ml`
- `mx`
- `my`
- `p`
- `pt`
- `pr`
- `pb`
- `pl`
- `px`
- `py`

MIT License
