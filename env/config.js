const config = {
  baseUrl: "<BASE_URL>",
  idcsUrl: "<IDCS_HOST_URL>",
  oAuthTokenEndpoint: "<OAUTH_TOKEN_ENDPOINT>",
  backendName: "<MBE_NAME>",
  basicAuth: {
    backendId: "<MBE_ID>",
    anonymousKey: "<ANONYMOUS_KEY>"
  },
  oAuth: {
    clientId: "<CLIENT_ID>",
    clientSecret: "<CLIENT_SECRET>",
  },
  auth: {
    username: "<AMCE_USER>",
    password: "<AMCE_PW>",
    userId: "<IDCS_USER_ID>",
    groupIds: {
      "<GROUP1>": "<IDCS_GROUP1_ID>",
      "<GROUP2>": "<IDCS_GROUP2_ID>"
    },
    accessToken: "<IDCS_OAUTH_ACCESS_TOKEN>"
  }
}

export default config;