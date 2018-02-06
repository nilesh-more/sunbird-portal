const PROXY_CONFIG = [
  {
    context: [
      '/resourcebundles/**',
      '/private/service/v1/**'
    ],
    target: 'http://localhost:3000',
    secure: false,
    'logLevel': 'debug',
    bypass: function (req, res, proxyOptions) {
    }
  }
]
module.exports = PROXY_CONFIG
