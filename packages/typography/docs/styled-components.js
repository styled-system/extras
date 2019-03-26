import React from 'react'
import styled, {
  createGlobalStyle,
  ThemeProvider
} from 'styled-components'
import { themes, typography } from '../src'
import Readme from '../README.md'

const theme = {
  typography: themes.modern,
}

const Typography = styled.div(typography)
const Global = createGlobalStyle(typography)

export default props =>
  <ThemeProvider theme={theme}>
    <>
      <Global />
        <Readme />
    </>
  </ThemeProvider>

