import detect from 'detect-port-alt'

const choosePort = (
  host: string, defaultPort: number, onOccupied: (port: number) => void,
): Promise<number | null> => (
  detect(defaultPort, host).then((port: number, err: Error) => {
    if (err) {
      throw err
    }

    if (defaultPort !== port) {
      onOccupied(defaultPort)
      return null
    }

    return port
  })
)

export default choosePort
