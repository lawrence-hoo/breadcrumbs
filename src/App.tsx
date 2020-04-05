import { Box, Container } from '@material-ui/core'
import React, { useState } from 'react'
import { IfFulfilled, IfPending, IfRejected, useAsync } from 'react-async'
import { getContents } from './api'
import Breadcrumbs from './components/Breadcrumbs'
import PageContents from './components/PageContents'

function App() {
  const [path, setPath] = useState('/')
  const state = useAsync({ promiseFn: getContents, path, setPath, watch: path })

  return (
    <Container>
      <Box p={2}>
        <Breadcrumbs path={path} setPath={setPath} />
        <main>
          <Box py={2}>
            <IfPending state={state}>Loading...</IfPending>
            <IfRejected state={state}>{(error) => error.message}</IfRejected>
            <IfFulfilled state={state}>
              {(contents) => <PageContents contents={contents} path={path} setPath={setPath} />}
            </IfFulfilled>
          </Box>
        </main>
      </Box>
    </Container>
  )
}

export default App
