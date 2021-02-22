import React, { FC } from 'react'

import ServerSidePropsContext, { ServerSideProps } from './ServerSidePropsContext'
import Main from './Main'

type AppProps = {
  serverSideProps?: ServerSideProps,
}

const App: FC<AppProps> = ({ serverSideProps = {} }) => {
  return (
    <ServerSidePropsContext.Provider value={serverSideProps}>
      <Main />
    </ServerSidePropsContext.Provider>
  )
}

export default App
