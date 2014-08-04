## Install Guide for `Sencha Touch Live`

**If you're already developing Sencha Touch native apps then you can probably skip most of this section and just install `Sencha Touch Live`.** 

To use the `stlive create` or `stlive build` commands you must first prepare Sencha Touch and PhoneGap development environments.  Refer to the **System Setup** as outlined in [Sench Touch Guide](http://docs.sencha.com/touch/2.3.1/#!/guide/command) for more details.

You'll need to download and install:

-  [NodeJS 0.10.x](http://nodejs.org)
- Ruby 
  - **Windows**: Download from [rubyinstaller.org](http://rubyinstaller.org). Install the .exe file version.
  - **OSX**: Should be installed. Check the version with `ruby -v` .
  - **Ubuntu**: `sudo apt-get install ruby2.0.0`   
- [Sencha Touch](http://www.sencha.com/products/touch)
- [Sencha Command v4.0.0.4.84](http://www.sencha.com/products/sencha-cmd/download)
  - May work with Sencha Command 5.x - not yet tested.

### Configurations Tested

Unlike PhoneGap Developer App, this tool relies on the PhoneGap used by your project and attempts to be more version decoupled so should work with most versions of PhoneGap 3.x and Sencha Touch 2.x . However, to date this app has only been tested with:
 
- Window 7, OSX Mavericks
- [Sencha Cmd 4.0.4.84](http://www.sencha.com/products/sencha-cmd/download) 
- [Sencha Touch 2.3.2](http://www.sencha.com/products/touch/download/) 
- [PhoneGap 3.5.0](http://phonegap.com/install/)

Please [log issues](https://github.com/tohagan/stlive/issues) to record configurations that you have tested (+ve and -ve results).

### Compiling your native app

The Either sign up for an account to compile your mobile apps at [PhoneGap Build Service](https://build.phonegap.com/apps). You can build one app for free or 25 app if you pay.  If you already have Adobe Create Cloud then you can use the same account. 

If you **don't** plan to use this service you'll also need to install platform SDK compilers:

- **Android**: [Eclipse / Android Development Kit (ADT)](http://developer.android.com/sdk/index.html)
 - Ensure that `$JAVA_HOME`, `$ANT_HOME`, and `$ANDROID_HOME` environment variables are set.  
- **iOS**: [XCode for OSX](https://developer.apple.com/xcode/downloads/)
- **WP8**: [Windows Phone 8 SDK](http://dev.windows.com/en-us/develop/download-phone-sdk)

### Javascipt Debugging Tools:

Use these tools to connect to the web page instance inside your mobile app (running on an emulator or USB connected device).  If you're debugging the native plugin code (C#, Java, Objective-C) - you'll need to use SDK debuggers.

- **iOS**: [Safari Web Inspector](http://phonegap-tips.com/articles/debugging-ios-phonegap-apps-with-safaris-web-inspector.html)
- **Andriod 4.4+**: [Chrome Debugger](https://developer.chrome.com/devtools/docs/remote-debugging) 
- **Android < 4.4**: [Weinre](http://people.apache.org/~pmuellr/weinre)

### Device Emulators

- **iOS**: iPad/iPhone/iPod emulator installs with XCode SDK
- **Android**:
  - Google's Android SDK ships with an Android emulator but it's a bit broken so you might want something better.
  - I've used [Geny Motion](http://www.genymotion.com/) and [Blue Stacks](http://www.bluestacks.com/)
- [Windows Phone 8 Emulator](http://msdn.microsoft.com/en-us/library/windows/apps/ff402563(v=vs.105).aspx) installs with Visual Studio SDK. 
   
### Install `PhoneGap`, `Cordova` and finally .... `Sencha Touch Live` !

If you've already installed either `cordova` or `phonegap`, make sure that their versions match. You can use `npm update` instead of `npm install`.  

Mac / Linux:

    $ sudo npm install -g cordova
    $ sudo npm install -g phonegap
    $ sudo npm install -g stlive

Windows:

    c:\> npm install -g cordova
    c:\> npm install -g phonegap
    c:\> npm install -g stlive

### Upgrade `Sencha Touch Live`

Mac / Linux:

    $ sudo npm update stlive –g

Windows:

    C:\> npm update stlive –g

There may be new options available that you now add to your existing `~/.stlive.config` file.
Check [`defaults.config`](https://github.com/tohagan/stlive/blob/master/defaults.config) online for details.

## Issues

### Socket.io (hopefully fixed!)

I've disabled a server feature that used the NodeJS `socket.io` library in order to prevent this installation issue - but just case it crops again some other way I've included these notes: 

If you experience any issues on Windows installing socket.io, you may need to download a version of Visual Studio Express (Free) and then make sure you have [all the required software](https://github.com/TooTallNate/node-gyp) to run `node-gyp`.  

You can also configure the version of Visual Studio used by `node-gyp` via an environment variable: 

- set `GYP_MSVS_VERSION=2012` for Visual Studio 2012 
- set `GYP_MSVS_VERSION=2013e` (the 'e' stands for 'express edition') 
- Here's the [full list](https://github.com/joyent/node/blob/v0.10.29/tools/gyp/pylib/gyp/MSVSVersion.py#L209-294). 
