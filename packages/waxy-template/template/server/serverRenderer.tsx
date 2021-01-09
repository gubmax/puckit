import React from 'react'
import { RouterContext } from 'koa-router'
import { renderToString } from 'react-dom/server'

import App from '../src/App'
import htmlTemplate from '../dist/index.html'

const serverRenderer = async (ctx: RouterContext): Promise<void> => {
  const { getServerSideProps } = require(`${__dirname}/../src/Main`)
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

  ctx.body = markup
}

export default serverRenderer
