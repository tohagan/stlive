
## Live edit `Sencha Touch`, `jQuery Mobile` + `PhoneGap/Cordova` apps 

If you're developing in a Javascript framework like [Sencha Touch](http://www.sencha.com/products/touch) or [jQuery Mobile](http://jquerymobile.com/) using [PhoneGap](http://phonegap.com/) or [Cordova](http://cordova.apache.org/) 
to access native device features you can now edit your source code on your computer and use this tool 
to immediately sync your code change for testing onto one or more mobiles devices ... all without needing to compile or redeploy your app!

### Description

Traditionally when developing Sencha Touch apps on mobile and tablet devices you need to minify and repackage the Sencha source code, then recompile that with the PhoneGap framework with each platform SDK compiler and then redeploy each native app to mobile devices and emulators for testing (For Sencha apps this is done by `sencha app build -run native`). For native app development this can be a slow process that you have to repeat for each code change before you can test the change on a native device or emulator.

This tool allows you to massively speed up development of your PhoneGap and Sencha Touch native apps by **skipping** all of these steps!

Using this tool you can update any Javascript, CSS or HTML source file on your development computer and it will instantly load your changes and restart the app on your device or emulators. This means you can live edit and test changes as you save them onto multiple devices! It even preserves the current client side route so in most cases you can immediately retest the active view without having to re-navigate to that view.

This means you can place any number of devices/emulators in front of you and instantly see the effect of your last code change one or more Android, iOS and WP8 devices!  You can even serve up your source code from your local computer onto a cloud based [mobile device testing lab](https://google.com?q=mobile+device+testing+lab) to test your app on hundreds of different mobile devices.  

You can also keep your remote debuggers connected while each update occurs so you save more time by not having to restart your remote debuggers.  Since the Javascript source code is not minified, it's also much easier to debug. You can also elect to load the original unminified Sencha Touch framework files onto the device making debugging of framework code easier.

### The Problem

The PhoneGap team recently released [PhoneGap Developer App](http://app.phonegap.com/) that supports live updating of source code in a PhoneGap 3.x project. The current PhoneGap Developer App is available as a download from the app stores. It's great for trying out PhoneGap with a standard set of core plugins but unfortunately it is unusable for many production projects as you're locked into a fixed set of PhoneGap plugins as deployed in their app store application. These plugins typically don't match types of plugins or plugin versions or internal customisations required by your app. You also can't use any internally developed plugins.

What you really need is a live update client and server that have identical plugins to your final mobile app. For Sencha Touch development you also need additional features and optimisations not supported by the current PhoneGap Developer App project.

### The Solution

To solve this, I created **stlive** to create, modify and serve live editable Sencha Touch or other PhoneGap based JS framework projects.

This tool allows you to instrument a new or existing mobile project to support live updating. On startup your instrumented mobile app will offer you options to either (a) run your existing fully compiled and minified native app or (b) start up a live update client that connects to an `stlive` server that can dispatch your original unmodified HTML/CCS/JS source code from your project folder onto the device.  It also dispatches platform specific code (e.g. Cordova plugin javascript) from **your app project**. The `stlive` server then watches for any changes in your source code files and will notify the client to reload your project source code and restart your app whenever you change a source file.

Unlike the current PhoneGap Developer App, the live update client and server components and your final native app are now running identically configured Cordova plugins since they are all using the same PhoneGap project instance to do so.  For testing purposes you can be assured that the native app and live update client will be running identical PhoneGap configurations since they are now compiled and deployed as one app and the server is dispatching the same plugin source code.

Using this tool you should be able to complete most of your development and testing using the live update client, only needing to rebuild and redeploy when your project's Cordova plugin configuration is changed.

## Supported Frameworks and Versions:

This tool is based on open source technology developed by the PhoneGap team but it's been modified to support the Sencha Touch 2.x framework.  It should also work for hybrid frameworks like jQuery Mobile that store their original HTML5 source in the `www` subdirectory of a PhoneGap or Cordova project.  The server can be run from either a Sencha Touch project folder OR the `phonegap` or `cordova` project folders and will it adapt the file paths dispatched accordingly.

It should support the following project types:

- Sencha Touch 2.x + PhoneGap 3.x  + Cordova 3.x (Tested for ST 2.3.2, PG 3.4.0 on Windows 7)

- jQuery Mobile + PhoneGap 3.x  (not yet tested)
- jQuery Mobile + Cordova 3.x  (not yet tested)

- PhoneGap 3.x standalone (not yet tested)
- Cordova 3.x standalone (not yet tested)

**Testers welcome!  Please log your +ve/-ve test results as [issues](https://github.com/tohagan/stlive/issues).**

## Installation

If you're already developing Sencha Touch native apps with PhoneGap you probably won't have much to install.  Most existing Sencha Touch / PhoneGap developers will only need to run ... 

    $ [sudo] npm install -g stlive 

... but you might want to checkout the **[Installation Guide](INSTALL.md)** to make sure you've got everything - particularly before logging an [issue](https://github.com/tohagan/stlive/issues).

## Getting Started

**Step 1.**  Configure your `stlive` user settings file.

    $ stlive settings

The first time you run `stlive`, it will create a copy of the [`defaults.config`](https://github.com/tohagan/stlive/blob/master/defaults.config) file that ships with the app to your local settings file `~/.stlive.config`. 

You can then edit `~/.stlive.config` to configure your preferences including:

- `touchSdk` - Location of your Sencha Touch SDK (e.g. "~/bin/Sencha/touch-2.3.2")
- `senchaCmd`: Sencha Command name (e.g. `"sencha-4.0.4.84"` or just `"sencha"`)
- `appDomain`: Your company's domain name in reverse (e.g. `"com.sencha"`)
- `platforms`: Select `android`, `ios` or `wp8` platforms to create your new project.
- `build.remote`: Set to `true` to enable PhoneGap Build service and update  `build.username` and `build.password`.  This **copied** into a new project and then read from each project.  

**Windows**: You'll find the file at `%USERPROFILE%\.stlive.config`.  You'll need a modern text editor like [Notepad++](http://notepad-plus-plus.org/download) or TextPad. Windows Notepad won't be much use. 

**Step 2.** Create and compile a new Sencha Touch / PhoneGap app:

    $ stlive create DemoApp
	
**Step 3.** Deploy the compiled APK file to an Android device or emulator:

    DemoApp/phonegap/platforms/android/ant-build/DemoApp-debug.apk

**Step 4.** Run the live update server from your project folder.  The server should then display the **IP Address** and **Port number** it's listened on.

	$ cd DemoApp

	$ stlive serve
	listening on 192.168.0.17:3000
	Hit Control-C to stop

**Step 5.** Start the app on your device and select the Live Update link then key in the **IP Address** and **Port number** to connect to the server.

  - You should see the server display the sources files the client app is requesting.
  - For Cordova platform files, it will also display the actual file path dispatched (in green).  
  - You can use this to identify and fix any network or project configuration issues.
  - Finally you should see your new Sencha Touch displayed on your device or emulator.

**Step 6.**  Now edit the view that is displayed:
   - Open `app/views/Main.js` and change the Welcome message and save the file.
   - You should see the server reload the app and the new Welcome message displayed on the device.

### Live Edit using a Desktop Browser 

You don't even need a mobile device to use `stlive`. Just open the URL in Chrome or Safari browsers.  *The browser will similarly autoreload as you edit source code.*   Your app should work provided you're not calling any PhoneGap plugin APIs directly. Sencha Touch provides APIs that can emulate some of the PhoneGap APIs in your desktop PC browser.  

### Live Internet Testing  (Cool Feature!)

The  `localtunnel` option creates an encrypted socket connect from your `stlive` server to a randomly generated subdomain of **[localtunnel.me](http://localtunnel.me)**. This will *punch a hole in your firewall* and expose your `stlive server` server with a randomly generated domain name accessible on the Internet.

	$ stlive serve --localtunnel
 
You can now use this external URL for browser or device testing, or to demo or test development versions of your app to friends, testers or customers. You can even connect your app server to cloud based [mobile device testing lab](https://google.com?q=mobile+device+testing+lab) to test your app on hundreds of different mobile devices or use it when you visit an [Open Device Lab](http://lab-up.org). 

**SECURITY WARNING:** While the node app server is generally regarded as secure and should in theory only expose content files as read only, there is some small risk that a security hole exists. NO security penetration testing has been conducted. **No liability accepted. Use this feature at your own risk!**  This feature is for testing only. Not recommended for a production service.

### Example 1 - Create a named URL endpoint outside your firewall:

	$ cd MyApp
	$ stlive serve --localtunnel

	Starting in d:\Projects\STLIVE-Sandbox\MyApp ...
	listening on 192.168.7.54:3000
	localtunnel : https://jgwpgspbip.localtunnel.me     <<<== Random Internet URL 

On successful connection, the server will report it's URL endpoint as: http://**random**.localtunnel.me .  You can now key in this endpoint to the Live Update app on your mobile devices.

### Example 2 - Serve Compiled Sencha Code:

A `localtunnel` connection can be rather slow so let's compile it first and then serve the compressed JS/CSS files:

	$ cd MyApp

Compile Sencha project code into phonegap/www

	$ sencha app build native

**IMPORTANT**: Change to the `phonegap` subdirectory of your Sencha project. The server will now load the compressed files from `phonegap/www` and your app will load much faster.

	$ cd phonegap

Now show an external demo of your app using compressed code:

	$ stlive serve --localtunnel

    Starting in d:\Projects\STLIVE-Sandbox\MyApp ...
	listening on 192.168.7.54:3000
	localtunnel : https://jgwpgspbip.localtunnel.me

## Command Summary

### Create new Sencha Touch app with "Live Edit" 

Create a new Sencha Touch 2.x + PhoneGap 3.x app with an embedded "live edit" client.

    $ stlive create [appDomain] [appName]

**TIP**: The domain or app name can be specified or use a default from your `.stlive.config` files.  If you create all your Sencha projects under a common parent folder you can create a `.stlive.config` in that parent folder and setup common defaults like `appDomain` for all your projects.
 
### Builds a Sencha Touch app

Same as `sencha app build native` but it uses the version of Sencha Command configured in `.stlive.config` in your home directory or current/ancestor directories of your project.

    $ stlive build
  
**TIP**: Commit a `.stlive.config` file as part of your project so you can auto select the right version of Sencha Command and Sencha Touch.  A future version may support settings environment variables prior to running Sencha Command so that the build process (and all the related build tools) can be customised on a per project basis. This would make it fast and easy to switch build parameters and tools just by changing projects directory and ensure that it's all version controlled.

### Instrumenting existing mobile apps for "Live Edit"

Run these command in a Sencha Touch, PhoneGap or Cordova project folder:

  - `$ stlive add`    - Add a live client to an existing Sencha Touch or PhoneGap project.
  - `$ stlive remove` - Removes the live client from a project (pre app store or production MDM deployment).
  - `$ stlive update` - Updates project live client to latest version after upgrading `stlive`.
 
### Run "Live Edit" App Server 

Run these command in a Sencha Touch, PhoneGap or Cordova project folder:
Runs a live update server in your Sencha Touch or PhoneGap project folder:

    $ stlive serve [--port number] [--localtunnel]

### Info Commands

  - `$ stlive version`  - Displays app version
  - `$ stlive settings` - Displays configured settings.  You can update these in `~/.stlive.config`

## Configuration & Command Line Options

- All **configuration options** can be overridded using corresponding **command line options**.

You'll find it helpful in speeding up creating new apps and ensuring they are consistently configured. The [`defaults.config`](https://github.com/tohagan/stlive/blob/master/defaults.config) file contains a list of all the options and their default settings.  The properties are all documented with comments inside this file.

The first time you run the app, it will create a copy of the [`defaults.config`](https://github.com/tohagan/stlive/blob/master/defaults.config) file to `~/.stlive.config`. You can then edit this user settings file to configure your preferences.  

Setting & command line properties for `stlive create` include:
 
- Your company's reversed domain name (com.mycompany)
- Set of PhoneGap plugins added to new projects.
- Enable/Disable PhoneGap Build service.
- PhoneGap build service user name and password
- [Many other options](https://github.com/tohagan/stlive/blob/master/defaults.config).

Configuration properties for `stlive create` include:

- Server port number
- Enable/Disable live edit reloading    
- Enable/Disable external tunnel to **localtunnel.me** 
- Set files/directories that trigger reloads for Sencha Touch projects.
- Set files/directories that trigger reloads for Cordova/PhoneGap projects.
- Enable/Disable Background SASS Compiler and configure command line and directory.  

## Overriding Options

The first time you run this app it will create a **~/.stlive.config** file in your home directory that allows you to override these defaults. This file is a copy of the `defaults.config` that ships with the app.  At this stlive is updated with new versions you may need to maintain the settings in this file.

## Known Issues

- Navigating back to the start page and then re-selecting the Live Update link often fails to restart the Live Update client.  **Workaround**: Stop and restart the mobile app.  See 

### Acknowledgements

A huge **Thank You** to the **PhoneGap** project team and **Abobe Inc.** who sponsored them; without their having open sourced the **[PhoneGap Developer App](http://app.phonegap.com/)** this app would not exist.

### Licence

- Apache 2.0 
