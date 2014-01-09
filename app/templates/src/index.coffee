
# Example XHR call using provided template
#
XHR   = require( "./madlib-xhr.coffee" )
myXHR = new XHR()

myXHR.call(
    url: "index.html"
)