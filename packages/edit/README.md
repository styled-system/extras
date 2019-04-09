
# @styled-system/edit

**WIP** Debugging tool for live editing Styled System theme objects

```sh
npm i @styled-system/edit
```

```jsx
import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import { EditProvider, ThemeControls } from '@styled-system/edit'
import theme from './theme'

export default props =>
  <ThemeProvider theme={theme}>
    <EditProvider>
      {props.children}
      <ThemeControls />
    </EditProvider>
  </ThemeProvider>
```

MIT License

---

- [ ] Composable controls API
  - [ ] context picked up from field component
