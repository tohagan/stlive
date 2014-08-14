
## Live edit `Sencha Touch`, `jQuery Mobile` + `PhoneGap/Cordova` apps 

If you're developing in a Javascript framework like [Sencha Touch](http://www.sencha.com/products/touch) or [jQuery Mobile](http://jquerymobile.com/) using [PhoneGap](http://phonegap.com/) or [Cordova](http://cordova.apache.org/) 
to access native device features you can now edit your source code on your computer and use this tool 
to immediately sync your code change for testing onto one or more mobiles devices ... all without needing to compile or redeploy your app!

### Description

Traditionally when developing Sencha Touch apps on mobile and tablet devices you need to minify and repackage the Sencha source code, then recompile that with the PhoneGap framework with each platform SDK compiler and then redeploy each native app to mobile devices and emulators for testing (For Sencha apps this is done by `sencha app build -run native`). For native app development this can be a slow process that you have to repeat for each code change before you can test the change on a native device or emulator.

This tool allows you to massively speed up development of your PhoneGap and Sencha Touch native apps by **skipping** all of these steps!

Using this tool you can update any Javascript, CSS, SCSS or HTML source file on your development computer and it will instantly load your changes and restart the app on your device or emulators. This means you can live edit and test changes as you save them onto multiple devices! It even preserves the current client side route so in most cases you can immediately retest the active view without having to re-navigate to that view.

This means you can place any number of devices/emulators in front of you and instantly see the effect of your last code change one or more Android, iOS and WP8 devices!  You can even serve up your source code from your local computer onto a cloud based [mobile device testing lab](https://google.com?q=mobile+device+testing+lab) to test your app on hundreds of different mobile devices.  

You can also keep your remote debuggers connected while each update occurs so you save more time by not having to restart your remote debuggers.  Since the Javascript source code is not minified, it's also much easier to debug. You can also elect to load the original unminified Sencha Touch framework files onto the device making debugging of framework code easier.

We've even added integrated a SASS -> CSS compiler so you can now live edit your SASS files (`*.scss`) and they will be auto compiled and resulting `app.css` file auto reloaded. So you can now instantly review each styling change on multiple real devices or emulators.

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

Run ...

    $ stlive settings show

The first time you run `stlive`, it will create a copy of the [`defaults.config`](https://github.com/tohagan/stlive/blob/master/defaults.config) file that ships with the app to your local settings file `~/.stlive.config`.  `stlive` merges settings from `.stlive.config` files it finds in your current, ancestor and home directories. This allows you to configure settings for a group of projects by placing a copy in a parent folder contains the related project as subfolders. You can then override and version control settings for a specific project by adding an `.stlive.config` file to the project subfolder.

`.stlive.config` files configure preferences including:

- `touchSdk` - Location of your Sencha Touch SDK (e.g. "~/bin/Sencha/touch-2.3.2").
- `senchaCmd`: Version specific Sencha Command (e.g. `"sencha-4.0.4.84"` or just `"sencha"` which will get the last installed)
- `appDomain`: Your company's domain name in reverse (e.g. `"com.sencha"`).
- `platforms`: Select `android`, `ios` or `wp8` platforms to add to new projects.
- `build.remote`: Set to `true` to enable PhoneGap Build service and update  `build.username` and `build.password`.  These settings are **copied** into new projects and then read from each project.  

**Windows**: You'll find the home file at `%USERPROFILE%\.stlive.config`.  You'll need a modern text editor like  [Brackets](http://brackets.io/), [Notepad++](http://notepad-plus-plus.org/download) or [TextPad](https://www.textpad.com/). Windows Notepad won't be much use. 

**Step 2.** Start your simulators / emulators / devices 

*But hang on ... We don't even have an app yet!*  ... Trust me ... You soon will.

Refer to **[Installation Guide](INSTALL.md)** topics covering **Device Simulators and Emulators** and **Javascript Remote Debugging**. 

**Step 3.** Create, Compile, Deploy and Run a new live edittable Sencha Touch / PhoneGap app:

Open a terminal widow. For OSX, you may need to change the background color to black (or a dark color) to view colored text.

    $ stlive create --run DemoApp

At this runs you will see the highlighted Sencha and Cordova commands it's using to generate your new new app based on your settings.  If all is well, at the end of this process you should have a new mobile app deployed and running on your devices/emulators/simulator.  If you need to fix any configuration issues and perform a rebuild you can run `stlive build --run` in the new `DemoApp` project subdirectory.

**Step 4.** Now run a live update server from your new `DemoApp` project folder.  The server will then display the **IP Address** and **Port number** it's listened on.

	$ cd DemoApp
	$ stlive serve
	listening on 192.168.0.17:3000
	Hit Control-C to stop

**Step 5.** Make sure the app has started on your device and select the **[Live Update]()** link then key in the **IP Address** and **Port number** to connect to the server.

  - You should see the server display the source files the client app is requesting.
    - For Cordova platform and plugin files, it will also display the actual file path dispatched (in green).  
    - You can use this to identify and fix any network or project configuration issues.
  - Finally you should see 'Welcome to Sencha Touch 2' displayed as the app titlebar on your device or emulator.

**Step 6.**  Now **live edit** the view that is displayed:

   - Open `DemoApp/app/views/Main.js` and edit the Welcome message and save the file.
     - You should see the app instantly reload iteself from the server.
     - App now displays the new Welcome message on the device.
   - Connect **multiple** devices of **mixed types** (iOS, Android, WP8) 
     - They should all reload in response to a source file change.  
     - Each will load the Cordova JS files for their platform. 

**Step 7.** Connect to the app using a remote debugger

- **iOS**: Follow [these instructions](http://phonegap-tips.com/articles/debugging-ios-phonegap-apps-with-safaris-web-inspector.html)
- **Android 4.4+**: Follow [these instructions](https://developer.chrome.com/devtools/docs/remote-debugging). Needs  **Chrome v32** or later on desktop computer.  

**Step 8.** Rebuilding and Redeployment

If you need to rebuild and redeploy your app (e.g. after adding/removing plugins) you can run ...

    $ stlive build --run

This is basically the same as running `sencha app build --run native` but it uses the version of sencha command configured in your settings file which you can define as a local version controlled file in your project folder. In the future we may add additional environment variable settings so for example could might select other SDK version and settings as well. This will make it easy to switch between projects without having to reconfigure your build environment. 

## Live Edit SASS stylesheet files

**Step 1.** Install Ruby, SASS and Compass compiler as per **[Installation Guide](INSTALL.md)** instructions. 

**Step 2.** Configure the SASS compiler in your `.stlive.config` setting files. 

**NOTE**: You must configure the **full path** to the compass compiler in the `bgtasks.sass.cmd` option.

Test that the SASS compiler starts and resolve any configuration issues ... 

	$ stlive sass
    [sass] Compass SASS Compiler starting
    [sass] >>> Compass is polling for changes.  Hit Control-C to stop

Use `Ctrl-C` to Stop the SASS compiler.

**Step 3.** Now start the SASS compiler as part of the ST Live server ...

	$ stlive serve --sass
    [sass] Compass SASS Compiler starting
    [sass] >>> Compass is polling for changes.
	listening on 192.168.0.17:3000

 	Hit Control-C to stop


`Ctrl-C` will now stop both the ST Live server and the SASS Compiler.

**Step 4.** Start your emulator or device and load your mobile app and begin Live Update editing.

**Step 5.** Change the base color theme for your app by adding this line to the **top** of `resources/sass/app.scss` and save the file.  

    $base_color: #186FA5;
 
You should see the compass compiler detect the change and recompile your SASS file and then the ST Live server detect the resulting change to the `resources/css/app.css` file and it reload your app with a new theme color.

For more information on theming Sencha Touch apps refer to ...

- [Getting Started with Sencha Touch 2: Build a Weather Utility App (Part 2)](http://www.sencha.com/blog/getting-started-with-sencha-touch-2-build-a-weather-utility-app-part-2/)
- [An Introduction to Theming Sencha Touch](http://www.sencha.com/blog/an-introduction-to-theming-sencha-touch)
- [Video Tutorial](http://www.sencha.com/learn/theming-sencha-touch). 

## Live Edit using a Desktop or Mobile Browser

You don't even need a mobile device to use `stlive`. Just open the URL in Chrome or Safari mobile or desktop browsers.  *The browser will similarly autoreload as you edit source code.*   

**NOTE**: Your app should work provided you're not calling any PhoneGap plugin APIs directly. Sencha Touch provides wrapper classes that can emulate some of the PhoneGap APIs when your app is run in a desktop browser (See devices in [Sencha Touch API](http://docs.sencha.com/touch/2.3.2). Example: [Ext.device.FileSystem](http://docs.sencha.com/touch/2.3.2/source/FileSystem.html#Ext-device-FileSystem).  

## Live Internet Demo or Live Testing  (Cool Feature!)

The  `--localtunnel` option creates an encrypted socket connection from your `stlive` server to new host name that is a randomly generated subdomain of **[localtunnel.me](http://localtunnel.me)**. This will expose your `stlive server` server with a randomly generated host name that is accessible on the Internet if you know the new random host name. 

	$ stlive serve --localtunnel
 
You can now use this external URL for browser or device testing, or to demo or test development versions of your app to friends, testers or customers. You can even connect your app server to cloud based [mobile device testing lab](https://google.com?q=mobile+device+testing+lab) to test your app on hundreds of different mobile devices or use it when you visit an [Open Device Lab](http://lab-up.org).  

**SECURITY WARNING:** While the node app server is generally regarded as secure enabling this feature effectively *punches a hole in your firewall*. In theory it exposes your source files as read only and the random domain name provides some additional protection however there is some small risk that a security vulnerability exists. NO penetration testing has been conducted. This feature is intended for brief demoes and testing only. Not recommended for a production service or prolonged or frequent use.  **As per Apache 2.0 License - No liability is accepted. Use this at your own risk!**  

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

Compile Sencha project code into `phonegap/www/`

	$ sencha app build native

**IMPORTANT**: Change to the `phonegap` subdirectory of your Sencha project. The server will now load the files from `phonegap/www/` and your app will load much faster as it's now loading a single `app.js` file containing your compressed version of *all* of your Sencha Touch class files and their dependent framework classes.

	$ cd phonegap

Now show an external demo of your app using compressed code:

	$ stlive serve --localtunnel

    Starting in d:\Projects\STLIVE-Sandbox\MyApp ...
	listening on 192.168.7.54:3000
	localtunnel : https://jgwpgspbip.localtunnel.me

## Preparing for MDM or App Store deployment

AppStores or your corporate MDM are unlikely to accept your mobile app with "live edit" instrumentation so we've made it easy to remove this prior to rebuilding for final release and add it back later so you can continue development.  

To remove the live editing and rebuild and test ... 

    $ cd MyApp
    $ stlive remove
    $ stlive build --run

Add live editting back you can easily add it back in and redeploy ...
You can also use this for an existing Sench Touch app:

    $ stlive add
    $ stlive build --run

**IMPORTANT:**  `stlive remove` will **replace** your project's `config.xml` file with the original version of this file `config.orig.xml` created before the app was instrumented to support live editting.  Similarly `stlive add` will **replace** your project's `config.xml` file with the live edit version of this file `config.live.xml` that is required to support live editting.

So as you make changes to your `config.xml` file you will need to ensure that these changes are transferred to the `config.orig.xml` and `config.live.xml` files so you can safely perform `stlive add` and `stlive remove` commands and not loose your important changes to `config.xml`. 

## Command Summary

### Create & Build new Sencha Touch app with "Live Edit". 

Create a new Sencha Touch 2.x + PhoneGap 3.x app with an embedded "live edit" client.

    $ stlive create [--run] [appDomain] [appName]

Example: 
    
    $ stlive create --run au.com.mycompany MyCoolApp

The `--run` option will deploy and run the new app on attached devices.

**TIP**: The domain or app name can be specified or use a default from your `.stlive.config` files.  If you create all your Sencha projects under a common parent folder you can create a `.stlive.config` in that parent folder and setup common defaults like `appDomain` for all your projects.
 
### Builds a Sencha Touch app

Same as `sencha app build native` but it uses the version of Sencha Command configured in `.stlive.config` in your home directory or current/ancestor directories of your project.

    $ stlive build [--run]

The `--run` option will deploy and run the app on attached devices.


**TIP**: This is basically the same as running `sencha app build --run native` but it uses the version of Sencha Command configured in your settings file.  So you may wish to add a `.stlive.config` file as part of your project, so you can auto select the right version of Sencha Command and Sencha Touch.  

A future version may support settings environment variables prior to running Sencha Command so that the build process (and all the related build tools) can be customised on a per project basis. This would make it fast and easy to switch build parameters and tools just by changing projects directory and ensure that it's all version controlled.

I recommend that your project `.stlive.config` files only contain project specific settings and that it inherit other settings from config files in your home or ancestor folders. When we roll out new releases of `stlive` that have new features and settings you will likely avoid the need to update each of your project's config files.  You should always include the "_schema" property in your config files so the app can report schema version changes.
  
### Compile and Deploy PhoneGap app

These commands will not recompile your Sencha code, just the PhoneGap code. But it will redeploy to the device which can be quicker than doing this manually:

  - `$ stlive run [platform ...]` - Recompiles and deploys your app to devices/emulators/simulators. 

### Instrumenting existing mobile apps for "Live Edit"

Run these command in a Sencha Touch, PhoneGap or Cordova project folder:

  - `$ stlive add`    - Add a live client to an existing Sencha Touch or PhoneGap project.
  - `$ stlive remove` - Removes the live client from a project (pre app store or production MDM deployment).
  - `$ stlive update` - Updates project live client to latest version after upgrading `stlive`.
 
### Run SASS Compass Compiler

    $ stlive sass 

Starts the SASS Compass compiler configured in your `.stlive.config` settings file.
Refer to  **[Installation Guide](INSTALL.md)** for details of how to install and configure the SASS compiler.

### Run "Live Edit" App Server

Run these command in a Sencha Touch, PhoneGap or Cordova project folder:
Runs a live update server in your Sencha Touch or PhoneGap project folder:

    $ stlive serve [--port number] [--localtunnel] [--sass]

- `--port number` - Changes default server port number
- `--localtunnel` - Connects your `stlive` server to a randomly generated subdomain of **[localtunnel.me](http://localtunnel.me)**
- `--sass` - Starts a SASS Compass compiler with the Live Edit server.  
  - Your Sench Touch SASS files in `resources/sass/*.scss` are now also live editable.
  - set `"sass": true` in your settings file to always auto start/stop this compiler as a background task.

All these options can be preconfigured in a settings file.

### Info Commands

  - `$ stlive --version`  - Displays app version

  - `$ stlive settings show` - Shows settings merged from `.stlive.config` files in $HOME, current or ancestor directories.
  - `$ stlive settings diff` - Compares settings to the default settings file [`defaults.config`](https://github.com/tohagan/stlive/blob/master/defaults.config) that ships with the app.

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

- Navigating back to the start page and then re-selecting the Live Update link often fails to restart the Live Update client.  **Workaround**: Stop and restart the mobile app or redeploy it using `stlive run`

### Acknowledgements

A huge **Thank You** to the **PhoneGap** project team and **Abobe Inc.** who sponsored them; without their having open sourced the **[PhoneGap Developer App](http://app.phonegap.com/)** this app would not exist.

### Licence

- Apache 2.0 
