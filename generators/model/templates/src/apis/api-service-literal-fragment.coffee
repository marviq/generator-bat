    ###*
    #   Service API endpoint for accessing <% if ( singleton ) { %>the <% } %>{{#crossLink '<%- className %>'}}<%- modelName %> resource<% if ( ! singleton ) { %>s<% } %>{{/crossLink}}.
    #
    #   @attribute      <%- modelName %>
    #   @type           ApiServiceModel
    #   @final
    #
    #   @default        '<<%- api.className %>.url>/<%- service %>'
    ###

    id:                 '<%- modelName %>'
    urlPath:            '<%- service %>'

,
