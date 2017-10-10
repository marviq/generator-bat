###*
#   @author         David Bouman
#   @module         App
###

'use strict'


###*
#   This shim exist solely for the purpose of exposing the bundled `jquery` on the global scope as `jQuery`.
#
#   This way, any CDN loaded code that expect it there, will be able to find it.
#
#   The shim has no code of itself and exports nothing; The file simply provides the handle needed to get
#   [`browserify-shim`](https://github.com/thlorenz/browserify-shim#readme) to do its magic.
#
#   Please have a look at the `package.json`. In it, you'll find these bits:
#
#   ```json
#   "browser": {
#      ...
#      "jquery-expose": "./vendor/jquery-expose.coffee"
#      ...
#   },
#   ```
#
#   ```json
#   "browserify-shim": {
#     ...
#     "jquery-expose": {
#       "depends": [ "jquery:jQuery" ]
#     }
#     ...
#   },
#   ```
#
#   This tells [`browserify-shim`](https://github.com/thlorenz/browserify-shim#b-config-inside-packagejson-with-aliases), that this file expects to find the
#   `jquery` package as `jQuery` on the global scope, and so, any externally loaded framework code will be able to find it there too.
#
#   (It also tells [`browserify`](https://github.com/substack/browserify-handbook#browser-field) where it can find this file whenever a
#   `require('jquery-expose')` happens.)
#
#   <h5>Why not just `window.jQuery = require( 'jquery' )`?</h5>
#
#   That would work for sure; but by doing it through `browserify-shim` you have one consistent, centralized way of expressing these kind of dependencies.
#
#   @class          JQueryForCDNs
#   @static
###
