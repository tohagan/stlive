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
 
- Window 7 & 8, OSX Mavericks
- [Sencha Cmd 4.0.4.84](http://www.sencha.com/products/sencha-cmd/download) 
- [Sencha Touch 2.3.2](http://www.sencha.com/products/touch/download/) 
- [PhoneGap 3.5.0](http://phonegap.com/install/)

Please [log issues](https://github.com/tohagan/stlive/issues) to record other configurations that you have tested (+ve and -ve results) so we can document your results here. Linux anyone? Thanks :) .

### Compiling your native app

You can either sign up for an account at [PhoneGap Build Service](https://build.phonegap.com/apps) to compile your apps online OR use platform SDK tools to compile them on your computer.  You can configure your service account name and password in your `.stlive.config` files to copy them into new projects OR you can configure them in the `phonegap.local.properties` file.

If you **don't** plan to use this service you'll also need to install the platform SDKs that include compilers and emulators or simulators.

- **Android**: [Eclipse / Android Development Kit (ADT)](http://developer.android.com/sdk/index.html)
 - Ensure that `$JAVA_HOME`, `$ANT_HOME`, and `$ANDROID_HOME` environment variables are set.  
- **iOS**: [XCode for OSX](https://developer.apple.com/xcode/downloads/)
- **WP8**: [Windows Phone 8 SDK](http://dev.windows.com/en-us/develop/download-phone-sdk)

### Device Simulators and Emulators

- **iOS**: iOS Simulator installs with XCode SDK and supports iPad/iPhone/iPod.
- **Android**:
  - The Android emulator that ships with the SDK is a bit of a time waster so you might want something thats faster and simpler to use.
  - I've used [Geny Motion](http://www.genymotion.com/) (my current preference) and also [Blue Stacks](http://www.bluestacks.com/) (but it's not really a developer tool). There are more out there I've not yet tested.
- **WP8**: [Windows Phone 8 Emulator](http://msdn.microsoft.com/en-us/library/windows/apps/ff402563(v=vs.105).aspx) installs with Visual Studio SDK. 
   
### Javascript Remote Debugging

Use these tools to connect to UIWebView instances inside your mobile apps running on an simulator/emulator or USB connected devices.  If you're debugging the native plugin code (Java, Objective-C, C#) - you'll need to use SDK debuggers.  Make sure you've followed the instructions below to configure your hardware devices for **developement mode**.

- **iOS**: [Safari Web Inspector](http://phonegap-tips.com/articles/debugging-ios-phonegap-apps-with-safaris-web-inspector.html)
- **Android 4.4+**: [Chrome Debugger](https://developer.chrome.com/devtools/docs/remote-debugging). Check you have **Chrome v32** or later installed on your desktop development computer.  
- **Android < 4.4**: [Weinre](http://people.apache.org/~pmuellr/weinre)

### Install `PhoneGap`, `Cordova` and finally .... `Sencha Touch Live` !

If you've already installed either `cordova` or `phonegap`, make sure that their versions match. You can use `npm update` instead of `npm install`.  

Mac / Linux:

    $ sudo npm install -g cordova
    $ sudo npm install -g phonegap
    $ sudo npm install -g ios-sim   # Mac only - for iOS Simulator
    $ sudo npm install -g stlive    # <<<<  THIS APP !

Windows:

    c:\> npm install -g cordova
    c:\> npm install -g phonegap
    c:\> npm install -g stlive      # <<<<  THIS APP !

### Upgrade `Sencha Touch Live`

Mac / Linux:

    $ sudo npm update -g stlive 

Windows:

    C:\> npm update -g stlive 

There may be new options available that you now add to your existing `~/.stlive.config` file.
run `stlive settings diff` to compare [`defaults.config`](https://github.com/tohagan/stlive/blob/master/defaults.config) with your home settings file `~/.stlive.config` or a local settings file.

Follow the **Getting Started** guide in **[README](README.md)** file to test your install. 

### Installing SASS & Compass compiler

The SASS language is a CSS style sheet pre-processor that is used by Sencha Touch to improve the power and flexability of defining CSS styles.  In Sencha Touch projects, files in `resources/sass/*.scss` are compiled into `resources/css/app.css`.  The SASS compass compiler can be run in **watch** mode so it detects changes to your `*.scss` files and recompiles them. The `stlive serve` server can be configured to auto start the SASS compiler so that as you make changes to `*.scss` files they are auto converted to `*.css` files that in turn trigger a reload of the app.

The SASS Compiler is developed in Ruby so you must first ensure that that you have installed Ruby 2.x.  Ruby now ships with OSX but you may need to upgrade it so check the version using `ruby --version`.

**Mac / Linux:**

    $ sudo gem install sass 
    $ sudo gem install compass
    $ whereis compass    # Identify the install path for Compass
    /usr/bin/compass     # typically install here

Ensure these properties are in your `~/.stlive.config` file

    "sass": false,   // true if you wish to always auto start SASS compiler with stlive server
    "bgtasks": {
        "sass": {
            "name": "Compass SASS Compiler",
            "cmd": "/usr/bin/compass watch -c config.rb app.scss",   <<<< CHECK compass path
            "dir": "resources/sass",
            "success": "Compass is polling"   // Output when compiler starts ok
        }
    },

- Follow the **Getting Started** guide in **[README](README.md)** file to test your install. 


**Windows:**

    C:\> gem install sass
    C:\> gem install compass

Ensure these properties are in your `~/.stlive.config` file

    "sass": false,   // true if you wish to always auto start SASS compiler with stlive server
    "bgtasks": {
        "sass": {
            "name": "Compass SASS Compiler",
            "cmd": "C:/Ruby200-x64/bin/compass.bat watch -c config.rb app.scss",   // <<<< CHECK compass path
            "dir": "resources/sass",
            "success": "Compass is polling"   // Output when compiler starts ok
        }
    },

- Follow the **Getting Started** guide in **[README](README.md)** file to test your install.

## Issues

### Socket.io (hopefully fixed!)

I've disabled a server feature that used the NodeJS `socket.io` library in order to prevent this installation issue - but just case it crops again some other way I've included these notes: 

If you experience any issues on Windows installing socket.io, you may need to download a version of Visual Studio Express (Free) and then make sure you have [all the required software](https://github.com/TooTallNate/node-gyp) to run `node-gyp`.  

You can also configure the version of Visual Studio used by `node-gyp` via an environment variable: 

- set `GYP_MSVS_VERSION=2012` for Visual Studio 2012 
- set `GYP_MSVS_VERSION=2013e` (the 'e' stands for 'express edition') 
- Here's the [full list](https://github.com/joyent/node/blob/v0.10.29/tools/gyp/pylib/gyp/MSVSVersion.py#L209-294). 
