import { config } from 'dotenv'

const res = config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })

export default res.parsed
