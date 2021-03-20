import React, { FC, useContext } from 'react'

import ServerSidePropsContext from './ServerSidePropsContext'

import s from './Main.css'
import logo from './logo.svg'

interface MainServerSideProps {
  serverSideMsg?: string;
}

export const getServerSideProps = async (): Promise<MainServerSideProps> => {
  const res = await fetch(`http://localhost:${process.env.APP_SERVER_PORT || 8000}/api/data`, { method: 'POST' })
  const serverSideMsg: string = await res.text()
  return { serverSideMsg }
}

const Main: FC = () => {
  const { serverSideMsg } = useContext<MainServerSideProps>(ServerSidePropsContext)

  return (
    <div className={s.wrapper}>
      <header>
        <img src={logo} className={s.logo} alt="logo" />
        <p>Edit <code>src/App.tsx</code> and save to reload.</p>
        {serverSideMsg}
      </header>
    </div>
  )
}
export default Main
