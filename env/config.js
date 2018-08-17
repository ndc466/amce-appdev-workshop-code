const config = {
  baseUrl: "<Base URL>",
  idcsUrl: "<IDCS Service Instance URL>",
  oAuthTokenEndpoint: "<OAuth Token Endpoint>",
  backendName: "<Backend Name>",
  basicAuth: {
    backendId: "<Backend ID>",
    anonymousKey: "<Anonymous Key>"
  },
  oAuth: {
    clientId: "<Client ID>",
    clientSecret: "<Client Secret>",
  },
  auth: {
    userId: "<IDCS User ID>",
    groupIds: {
      "<Group 1>": "<IDCS Group ID (1)>",
      "<Group 2>": "<IDCS Group ID (2)>"
    },
    accessToken: "<IDCS OAuth Access Token>"
  }
}

export default config;