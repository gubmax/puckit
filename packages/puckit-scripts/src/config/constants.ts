export enum ScriptNames {
  APP = 'start:app',
  SERVER = 'start:server',
}

export enum ForkMessages {
  APP_COMPILING = 'app_compiling',
  APP_AFTER_COMPILING = 'app_after_compiling',
  APP_SUCCESS = 'app_success',
  CHILD_PROCESS = 'is_child_process',
  SERVER_COMPILING = 'server_compiling',
  SERVER_AFTER_COMPILING = 'server_after_compiling',
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
