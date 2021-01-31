import fetch from 'node-fetch'

import { bootstrap } from './main'

global.fetch = fetch

const server = bootstrap()

export default server
