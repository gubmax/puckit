import React, { createContext, FC } from 'react'

export type ServerSideProps = object

type SSPProviderProps = {
  value: ServerSideProps,
}

export const ServerSidePropsContext = createContext<ServerSideProps>({})

const ServerSidePropsProvider: FC<SSPProviderProps> = ({ children, value }) => (
  <ServerSidePropsContext.Provider value={value}>
    {children}
  </ServerSidePropsContext.Provider>
)

export default ServerSidePropsProvider
