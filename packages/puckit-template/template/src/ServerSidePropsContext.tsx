import { createContext } from 'react'

export type ServerSideProps = object

const ServerSidePropsContext = createContext<ServerSideProps>({})

export default ServerSidePropsContext
