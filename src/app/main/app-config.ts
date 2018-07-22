export const { SERVER_HOST, SERVER_SCHEMA } =
  ['local.com', 'localhost'].includes(window.location.hostname) ?
    {SERVER_HOST: 'localhost:8000', SERVER_SCHEMA: 'ws'} :
    {SERVER_HOST: 'everyturn.herokuapp.com', SERVER_SCHEMA: 'wss'};

export const SERVER_ORIGIN = `${SERVER_SCHEMA}://${SERVER_HOST}`;
