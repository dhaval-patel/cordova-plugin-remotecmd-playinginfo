
# Cordova Media Remote Command and Now Playing Info Center Plugin

This plugin provides the ability to show information about the playing audio in iOS/lock screen (see the image below). It also provides the ability to get notifications (callbacks) when remote playback events are triggered. Examples of such events are the user pressing the play/pause buttons in the lock screen or on their headset.

![Info Center screenshot](https://photostovis.org/screenshots/lockScreen.jpg)

__Note__: This plugin is still in its infancy. I wrote it in the first days of April 2016. The information in this README may still be incomplete. Please be patient, I will update it when I have time. If you are not patient :-), drop me a line at fl1 at photostovis dot com. Feedback appreciated!

__Note 2__: Some information (e.g. artist) and events (e.g. go to next/previous track) are not yet implemented. As said, please be patient :-), I will update the plugin during April or May 2016. Sending me an email showing interest would help.


## Installation

    cordova plugin add cordova-plugin-remotecmd-playinginfo
    
## Supported Platforms

- iOS

## RemoteCmdPlayingInfo

    var remoteCmdPlayingInfo=new RemoteCmdPlayingInfo(info,remoteCommandCallback);

### Parameters

- __info__: An object containing the information about the media being played.  _(Object)_

- __remoteCommandCallback__: (Optional) The callback that executes when a remote event is triggered. _(Function)_

__EXAMPLE__: 
```javascript
function remoteCommandCallback(event,value){
    switch(event){
        case RemoteCmdPlayingInfo.EVENT_PLAY:
            console.log("######### remoteCommandCallback, event: PLAY");
            //"value" is zero for this event
            if(myMedia)
                myMedia.play();
            break;
        case RemoteCmdPlayingInfo.EVENT_PAUSE:
            console.log("######### remoteCommandCallback, event: PAUSE");
            //"value" is zero for this event
            if(myMedia)
                myMedia.pause();
            break;
        case RemoteCmdPlayingInfo.EVENT_TOGGLE_PLAY_PAUSE:
            console.log("######### remoteCommandCallback, event: TOGGLE PLAY PAUSE");
            //"value" is zero for this event
            if(myMedia){
                if(myMedia.paused)myMedia.play();
                else myMedia.pause();
            }
            break;
        
        case RemoteCmdPlayingInfo.EVENT_SKIP_FORWARD:
            console.log("######### remoteCommandCallback, event: SKIP FW");
            //"value" is the amout of seconds to skip (the value in info.skipForwardValue)
            if(myMedia){
                mySkipForward(value);
            }
            break;
        case RemoteCmdPlayingInfo.EVENT_SKIP_BACKWARD:
            console.log("######### remoteCommandCallback, event: SKIP BW");
            //"value" is the amout of seconds to skip (the value in info.skipBackwardValue)
            if(myMedia){
                mySkipBackward(value);
            }
            break;
    }//switch
}


var info={
    'title':"Title goes here",
    'albumTitle':"Album title",
    'artwork':"cdvfile://...",
    'albumTrackCount':10,
    'albumTrackNumber':1,
    'playbackDuration':234.76, //in seconds
    'playbackPosition':12.5, //in seconds, usually this is zero
    'playbackRate':1.0, 
    
    /*these are used for the skip FW & BW events. It these are missing, the events are not handled and the skip buttons will not be shown in the lock screen.*/
    'skipForwardValue':30,
    'skipBackwardValue':30
};


var remoteCmdPlayingInfo = new RemoteCmdPlayingInfo(info,remoteCommandCallback);
```

### Constants

The following constants are reported as the first parameter to the `remoteCommandCallback` callback:

- `RemoteCmdPlayingInfo.EVENT_PLAY`               = 1;
- `RemoteCmdPlayingInfo.EVENT_PAUSE`              = 2;
- `RemoteCmdPlayingInfo.EVENT_TOGGLE_PLAY_PAUSE`  = 3;
- `RemoteCmdPlayingInfo.EVENT_SKIP_FORWARD`       = 4;
- `RemoteCmdPlayingInfo.EVENT_SKIP_BACKWARD`      = 5;

### Methods

- `remoteCmdPlayingInfo.release`: Releases the underlying operating system's resources. 

- `remoteCmdPlayingInfo.updateInfo`: Updates the information shown in the lock screen.

- `remoteCmdPlayingInfo.updatePlaybackRate`: Updates (only) the playback rate. Uses `updateInfo` internally.

- `remoteCmdPlayingInfo.updatePlaybackPosition`: Updates (only) the playback position. Uses `updateInfo` internally.


## remoteCmdPlayingInfo.release

Releases the underlying operating system's resources. This basically means that the callback will not get called for events anymore.

    remoteCmdPlayingInfo.release([clearInfo]);

This function should be called with an argument of true (or 1) when you are done with playback.   

There is no need to call this function between tracks, it will get called automatically. The RemoteCmdPlayingInfo class is a singleton, it accepts a single instance. So
if there is an instance already when creating a new one, the .release() function is called for the old instance. 

### Parameters

- __clearInfo__: A boolean, if true the Now Playing information will be cleared.



## remoteCmdPlayingInfo.updateInfo

Updates the information shown in the lock screen.

    remoteCmdPlayingInfo.updateInfo(info);

### Parameters

- __info__: An object, same format as in the object instantiation function. _(Object)_



## remoteCmdPlayingInfo.updatePlaybackRate

Updates only the playback rate. Equivalent to `remoteCmdPlayingInfo.updateInfo({'playbackRate':newPlaybackRate})`

    remoteCmdPlayingInfo.updatePlaybackRate(newPlaybackRate);

### Parameters

- __newPlaybackRate__: A floating point number.



## remoteCmdPlayingInfo.updatePlaybackPosition

Updates only the playback position. Equivalent to `remoteCmdPlayingInfo.updateInfo({'playbackPosition':newPlaybackPosition})`

    remoteCmdPlayingInfo.updatePlaybackPosition(newPlaybackPosition);

This is useful to quickly update the playback position shown in the lock screen after the user has seeked to a new position using the app UI.

### Parameters

- __newPlaybackPosition__: A floating point number.







## Design

I made this plugin because I needed it. More precisely, I needed a way to support commands coming from the headset and the lock screen, and also to display information about what is playing in lock screen. This was for an audio application that uses the cordova—plugin-media.

Initially I considered contributing to cordova—plugin-media and adding the functionality from this plugin there. However, after looking into how cordova—plugin-media handles 
media I reconsidered, because adding this functionality there looked to me like a bad choice. If the application uses a single Media object at a time, things are simple and the functionality from this plugin could be integrated. However, when an application has more than one Media object opened at the same time, some events should be handled at application level, using application logic. For example, if an application has 3 Media instances, one is playing and the other 2 are paused, and a "TogglePlayPause" is 
triggered, the plugin does not have enough information to take a decision what should be done.



