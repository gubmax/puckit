import detect from 'detect-port-alt'
import { printMessage, MessageType, clearConsole } from '@waxy/dev-utils'

const choosePort = (host: string, defaultPort: number): Promise<number | null> => (
  detect(defaultPort, host).then((port: number, err: Error) => {
    if (err) {
      throw err
    }

    if (defaultPort !== port) {
      clearConsole()
      printMessage(MessageType.ERR, `Port ${defaultPort} was occupied.`)
      return null
    }

    return port
  })
)

export default choosePort
