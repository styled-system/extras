
# @styled-system/css

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
