/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

var remoteCmdPlayingInfoObject = null;

/**
 * This class provides access to the device media, interfaces to both sound and video
 *
 * @constructor
 * @param src                   The file name or url to play
 * @param successCallback       The callback to be called when the file is done playing or recording.
 *                                  successCallback()
 * @param errorCallback         The callback to be called if there is an error.
 *                                  errorCallback(int errorCode) - OPTIONAL
 * @param statusCallback        The callback to be called when media status has changed.
 *                                  statusCallback(int statusCode) - OPTIONAL
 */
var RemoteCmdPlayingInfo = function(eventsAndInfo, eventCallback) {
    //argscheck.checkArgs('sFFF', 'Media', arguments);
	if(remoteCmdPlayingInfoObject){
		exec(null, null, "RemoteCmdPlayingInfo", "release", []);
		delete remoteCmdPlayingInfoObject;
	}
    remoteCmdPlayingInfoObject = this;
    this.eventsAndInfo = eventsAndInfo;
    this.eventCallback = eventCallback;
    exec(null, null, "RemoteCmdPlayingInfo", "create", [eventsAndInfo]);
};

RemoteCmdPlayingInfo.prototype.release = function(clearInfo) {
	var clearInfoNr;
	if(typeof(clearInfo)!=='undefined' && clearInfo)clearInfoNr=1;
	else clearInfoNr=0;
    exec(null, null, "RemoteCmdPlayingInfo", "release", [clearInfoNr]);
    delete remoteCmdPlayingInfoObject;
    remoteCmdPlayingInfoObject=null;
};

RemoteCmdPlayingInfo.prototype.updateInfo = function(info) {
    exec(null, null, "RemoteCmdPlayingInfo", "updateInfo", [info]);
};

//easier-to-use functions
RemoteCmdPlayingInfo.prototype.updatePlaybackRate = function(rate) {
    exec(null, null, "RemoteCmdPlayingInfo", "updateInfo", [{'playbackRate':rate}]);
};
RemoteCmdPlayingInfo.prototype.updatePlaybackPosition = function(pos) {
    exec(null, null, "RemoteCmdPlayingInfo", "updateInfo", [{'playbackPosition':pos}]);
};


RemoteCmdPlayingInfo.EVENT_PLAY = 1;
RemoteCmdPlayingInfo.EVENT_PAUSE = 2;
RemoteCmdPlayingInfo.EVENT_TOGGLE_PLAY_PAUSE = 3;

RemoteCmdPlayingInfo.EVENT_SKIP_FORWARD = 4;
RemoteCmdPlayingInfo.EVENT_SKIP_BACKWARD = 5;


RemoteCmdPlayingInfo.onEvent = function(eventType, value) {
	if(!remoteCmdPlayingInfoObject)return;
	if(typeof(remoteCmdPlayingInfoObject.eventCallback)!=='function')return;
	
	remoteCmdPlayingInfoObject.eventCallback(eventType,value);
};

module.exports = RemoteCmdPlayingInfo;

function onMessageFromNative(msg) {
    if (msg.action == 'event') {
        RemoteCmdPlayingInfo.onEvent(msg.event.type, msg.event.value);
    } else {
        throw new Error('Unknown RemoteCmdPlayingInfo action' + msg.action);
    }
}

/*
if (cordova.platformId === 'android' || cordova.platformId === 'amazon-fireos' || cordova.platformId === 'windowsphone') {

    var channel = require('cordova/channel');

    channel.createSticky('onMediaPluginReady');
    channel.waitForInitialization('onMediaPluginReady');

    channel.onCordovaReady.subscribe(function() {
        exec(onMessageFromNative, undefined, 'Media', 'messageChannel', []);
        channel.initializationComplete('onMediaPluginReady');
    });
}*/
