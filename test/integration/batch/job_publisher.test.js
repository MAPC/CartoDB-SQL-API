'use strict';

require('../../helper');

var BATCH_SOURCE = '../../../batch/';

var assert = require('../../support/assert');

var _ = require('underscore');
var RedisPool = require('redis-mpool');
var redisUtils = require('../../support/redis_utils');


var Channel = require(BATCH_SOURCE + 'pubsub/channel');
var JobPublisher = require(BATCH_SOURCE + 'pubsub/job-publisher');

var redisPoolPublisher = new RedisPool(_.extend(redisUtils.getConfig(), { name: 'batch-publisher'}));
var redisPoolSubscriber = new RedisPool(_.extend(redisUtils.getConfig(), { name: 'batch-subscriber'}));

var HOST = 'wadus';

describe('job publisher', function() {
    var jobPublisher = new JobPublisher(redisPoolPublisher);

    it('.publish() should publish in job channel', function (done) {
        redisPoolSubscriber.acquire(Channel.DB, function (err, client) {
            if (err) {
                return done(err);
            }

            client.subscribe(Channel.NAME);

            client.on('message', function (channel, host) {
                assert.equal(host, HOST);
                assert.equal(channel, Channel.NAME) ;
                done();
            });

            jobPublisher.publish(HOST);
        });
    });

});
