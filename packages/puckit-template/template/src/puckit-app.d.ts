/// <reference types="@puckit/scripts" />

import { ServerSideProps } from './ServerSidePropsContext'

declare global {
  interface Window { SERVER_SIDE_PROPS?: ServerSideProps }
}
