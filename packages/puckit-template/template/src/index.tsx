import React from 'react'
import { hydrate } from 'react-dom'

import App from './App'

let serverSideProps

if (window.SERVER_SIDE_PROPS) {
  serverSideProps = { ...window.SERVER_SIDE_PROPS }
  delete window.SERVER_SIDE_PROPS
}

hydrate(<App serverSideProps={serverSideProps} />, document.getElementById('root'))
