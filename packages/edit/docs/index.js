import React from 'react'
import {
  EditProvider,
  ThemeControls,
  Field,
} from '../index'
import { ThemeProvider } from 'emotion-theming'
import css from '@styled-system/css'
import Readme from '../README.md'

const theme = {
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#07c',
    secondary: '#05a',
    modes: {
      dark: {
        text: '#fff',
        background: '#000',
      }
    }
  },
  fontSizes: [
    12, 14, 16, 20, 24, 32, 48, 64, 96
  ],
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  space: [
    0, 4, 8, 16, 32, 64, 128,
  ],
}

export default props =>
  <ThemeProvider theme={theme}>
    <EditProvider>
      <div
        css={css({
          fontSize: 2,
          lineHeight: 'body',
          color: 'text',
          bg: 'background',
        })}>
        <h1
          css={css({
            fontSize: [ 5, 6 ],
          })}>
          Hello
        </h1>
        <Field name='colors.text' />
        <Readme />
        <ThemeControls
          fieldTypes={{
            colors: {
              type: 'color',
              options: [],
            },
            lineHeights: {
              type: 'number',
              step: 1/16,
              min: 1,
              max: 2,
            },
            fontSizes: {
              type: 'select',
              options: [
                12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64
              ]
            }
          }}
          css={{
            position: 'fixed',
            top: 0,
            right: 0,
            margin: 8,
          }}
        />
      </div>
    </EditProvider>
  </ThemeProvider>
