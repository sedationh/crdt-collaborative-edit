/* eslint-disable @typescript-eslint/no-var-requires */
var ghpages = require('gh-pages')

ghpages.publish('dist', function (err) {
  console.log(err)
})
