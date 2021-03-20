import { config } from 'dotenv'

import { appPath } from './paths'

const res = config({ path: `${appPath}/.env.${process.env.NODE_ENV}` })

export default res.parsed
