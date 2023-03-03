import styled, { createGlobalStyle } from 'styled-components'


export const GlobalStyle = createGlobalStyle`
  body {
  color: #2b2b2b;
  background: #f6f6f6;
  font-family: sans-serif;
  }
`

export const Container = styled.main`
  max-width: 1400px;
  margin: auto;
`

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 54px;
`

export const Col = styled.div`
  background: #ffffff;
  flex: 1;
  padding: 24px;
  border: 1px solid #ececec;
  border-radius: 14px;
`

export const PageHeading = styled.h1`
  text-align: center;
`
