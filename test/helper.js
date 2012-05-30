// Copyright 2012 Mark Cavage.  All rights reserved.
//
// Just a simple wrapper over nodeunit's exports syntax. Also exposes
// a common logger for all tests.
//

var bunyan = require('bunyan');



///--- Exports

module.exports = {

        after: function after(teardown) {
                module.parent.exports.tearDown = teardown;
        },

        before: function before(setup) {
                module.parent.exports.setUp = setup;
        },

        test: function test(name, tester) {
                module.parent.exports[name] = function _(t) {
                        var _done = false;
                        t.end = function end() {
                                if (!_done) {
                                        _done = true;
                                        t.done();
                                }
                        };
                        t.notOk = function notOk(ok, message) {
                                return (t.ok(!ok, message));
                        };
                        return (tester(t));
                };
        },

        createLogger: function (name, stream) {
                return (bunyan.createLogger({
                        level: (process.env.LOG_LEVEL || 'warn'),
                        name: name || process.argv[1],
                        stream: stream || process.stdout,
                        src: true,
                        serializers: {err: bunyan.stdSerializers.err}
                }));
        }

};
