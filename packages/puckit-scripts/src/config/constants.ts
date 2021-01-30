export enum ScriptNames {
  APP = 'start:app',
  SERVER = 'start:server',
}

export enum ForkMessages {
  CHILD_PROCESS = 'is_child_process',
  COMPILING = 'compiling',
  AFTER_COMPILING = 'after_compiling',
  APP_SUCCESS = 'app_success',
  SERVER_SUCCESS = 'server_success',
}

export enum MessageTags {
  PUCKIT = 'puckit',
  APP = 'puckit:app',
  SERVER = 'puckit:server',
  START_SERVER_PLUGIN = 'puckit:start-server-plugin',
}

export enum LinkTypes {
  APP = 'App',
  SERVER = 'Server',
}
