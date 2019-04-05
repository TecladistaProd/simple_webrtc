import handlebars from 'handlebars'

export const message = handlebars.compile('<p class="{{cl}}"> {{body}} </p>')