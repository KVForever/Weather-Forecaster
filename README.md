## Introduction

I will write a web application that uses asynchronous JavaScript requests to dynamically update a web application with JavaScript Object Notation (JSON) data retrieved from a server.  You will also be using a 3rd party library to display retrieved data on a map.

## Background and References

### National Weather Service

The National Weather Service (NWS) (https://www.weather.gov/) owns weather stations across the country and creates forecasts weather in those areas (https://www.weather.gov/about/).  Using the NWS website you can see current conditions, forecasts, and warnings/alerts for any region in the United States.

In addition, the NWS website hosts a web application programming interface (API) that can be used to retrieve information about weather in areas across the country.

### Leaflet

Leaflet ([https://leafletjs.com/](https://leafletjs.com/)) is a free JavaScript library for displaying and interacting with maps.  It lets you display a map at a particular location, add pinpoints, zoom in and out, etc.  However, as a user of the library you are required to provide your own map image.  For that, we will use OpenStreetMap ([https://www.openstreetmap.org/](https://www.openstreetmap.org/)) which is free open source map data.

## Project Description

I will write a web application that shows the current conditions and forecast near a location on a Leaflet map.  The location will be the center of the current "view" and will be retrieved through NWS Weather API.

