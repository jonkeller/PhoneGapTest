PhoneGapTest
============

Just a little test app to start playing with PhoneGap.

* Detects whether it is running under PhoneGap or in a browser
* Detects device support of: geolocation, accelerometer, device motion, device orientation, and web audio context.
* Accelerometer and device motion are similar, but not exactly the same.  Both contain x/y/z acceleration including gravity.  Accelerometer contains a timestamp, whereas device motion contains x/y/z acceleration not including gravity as well as rotation rate alpha/beta/gamma.  This app only displays the common values and the timestamp (if available).
* Uses RequireJS, Bootstrap3, and jQuery.
