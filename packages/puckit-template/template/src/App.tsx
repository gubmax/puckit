import React, { FC } from 'react'

import ServerSidePropsProvider, { ServerSideProps } from './ServerSidePropsProvider'
import Main from './Main'

type AppProps = {
  serverSideProps?: ServerSideProps,
}

const App: FC<AppProps> = ({ serverSideProps = {} }) => {
  return (
    <ServerSidePropsProvider value={serverSideProps}>
      <Main />
    </ServerSidePropsProvider>
  )
}

export default App
