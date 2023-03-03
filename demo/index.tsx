import { render } from 'react-dom'
import React from 'react'

import { SimpleView } from './SimpleView'
import { DiffView } from './DiffView'
import { Col, Container, Flex, GlobalStyle, PageHeading } from './style'


render(
  <Container>
    <GlobalStyle />
    <PageHeading>react-json-lens demo</PageHeading>
    <Flex>
      <Col>
        <h3>Simple</h3>
        <SimpleView />
      </Col>
      <Col>
        <h3>Diff view</h3>
        <DiffView />
      </Col>
    </Flex>
  </Container>,
  document.body.appendChild(document.createElement('div'))
)
