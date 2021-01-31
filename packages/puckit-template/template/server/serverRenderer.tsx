import React from 'react'
import { renderToString } from 'react-dom/server'

import {App} from '../src/components/layout/App'
import htmlTemplate from '../dist/index.html'

export async function serverRenderer(): Promise<string> {
  const { getServerSideProps } = require(`${__dirname}/../src/components/layout/Main`)
  const serverSideProps: object = await getServerSideProps()

  const appTemplate = renderToString(<App serverSideProps={serverSideProps} />)

  const markup = htmlTemplate
    .replace('</head>', `
        <script script type="text/javascript" id="state">
          window.SERVER_SIDE_PROPS = ${JSON.stringify(serverSideProps)};
          document.getElementById('state').remove();
        </script>
      </head>
    `)
    .replace('<div id="root">', `<div id="root">${appTemplate}`)

  return markup
}
