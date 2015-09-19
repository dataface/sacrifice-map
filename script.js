var http = require('http'),
    jsdom = require('jsdom'),
    
    // packages
    d3 = require('d3'),
    topojson = require('topojson'),
    
    // data
    animals = require('./animals.json'),
    nyc = require('./nycboroughboundaries.geojson');

// =================================================== convert stuff

var topology = topojson.topology({collection: nyc[0]});

// =================================================== create artificial DOM

var htmlStub = '<html><head><title>lol</title></head><body><div id="container"></div><script src="node_modules/d3/d3.min.js"></script></body></html>',
    result;

jsdom.env({
    features: {
        QuerySelector: true
    },
    html: htmlStub,
    done: function (errors, window) {
        // im sure i decided to run this from the server for good reason.
        // d3 wants the DOM to be available. so we are simulating a client-side env.
        zone = window.document.querySelector('#container');
        d3.select(zone).append('svg')
            .attr('width', 960)
            .attr('height', 1160);
        

        // convert to string
        result = window.document.querySelector('body').innerHTML;
    }
});

// =================================================== draw

//svg.append('path')
//    .datum(topojson.feature(topology, topology.objects.subunits))
//    .attr('d', d3.geo.path().projection(d3.geo.mercator()));


// =================================================== start server

var PORT = 8080;

var handleRequest = function (request, response) {
        response.end(result);
    };

var server = http.createServer(handleRequest);

server.listen(PORT, function () {
    console.log('Server listening on: http://localhost:%s', PORT);
});