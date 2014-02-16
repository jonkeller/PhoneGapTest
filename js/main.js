requirejs.config(
{
    paths:
    {
        'jquery': '../external/jQuery/jquery-1.11.0.min',
        'bootstrap': '../external/bootstrap/dist/js/bootstrap.min'
    },
    shim:
    {
        'bootstrap.min':
        {
            deps: ['jquery'],
            exports: '$'
        }
    }
});

requirejs(['jquery', 'bootstrap'], function($)
{
    var audioContext;
    var oscillator;
    if (isPhoneGap()) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }

    function isPhoneGap() {
        // When running in PhoneGap, document.URL will be a file:// type URL
        return ((document.URL.indexOf( 'http://' ) === -1) && (document.URL.indexOf( 'https://' ) === -1));
    }

    function onDeviceReady() {
        setupButtonObservers();
        log('Ready');

        if (navigator.geolocation) {
            log('Geolocation is supported');
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError/*, geolocationOptions*/);
            enable('#startWatchingGeolocationBtn');
        } else {
            log('Geolocation is not supported');
        }

        if (window.DeviceMotionEvent) {
            log('Device motion is supported');
            window.addEventListener('devicemotion', onDeviceMotion, false);
        } else if (navigator.accelerometer) {
            log('Accelerometer is supported');
            navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError)
            enable('#startWatchingAccelerometerBtn');
        } else {
            log('Device motion / accelerometer not supported');
        }

        if (window.DeviceOrientationEvent) {
            log('Device orientation is supported');
            window.addEventListener('deviceorientation', onDeviceOrientation, false);
        } else {
            log('Device orientation not supported');
        }

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext);            
            log('AudioContext is supported');
            enable('#startOscillatorBtn');
        } catch (e) {
            log('AudioContext is not supported');
        }
    }

    function setupButtonObservers() {
        $('#startWatchingGeolocationBtn').on('click', startWatchingGeolocation);
        $('#stopWatchingGeolocationBtn').on('click', stopWatchingGeolocation);
        $('#startWatchingAccelerometerBtn').on('click', startWatchingAccelerometer);
        $('#stopWatchingAccelerometerBtn').on('click', stopWatchingAccelerometer);
        $('#startOscillatorBtn').on('click', startOscillator);
        $('#stopOscillatorBtn').on('click', stopOscillator);
    }

    function log(string) {
        var prev = $('#status').html();
        $('#status').html(prev + '\n' + string);
    }

    function enable(selector) {
        $(selector).prop("disabled",false);
    }

    function disable(selector) {
        $(selector).prop("disabled",true);
    }

    //var geolocationOptions = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
    var geolocationWatchId = null;

    function startWatchingGeolocation(evt) {
        geolocationWatchId = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError/*,geolocationOptions*/); 
        log('Started watching geolocation');
        disable('#startWatchingGeolocationBtn');
        enable('#stopWatchingGeolocationBtn');
        evt.preventDefault();
    }

    function stopWatchingGeolocation(evt) {
        navigator.geolocation.clearWatch(geolocationWatchId);
        geolocationWatchId = null;
        log('Stopped watching geolocation');
        enable('#startWatchingGeolocationBtn');
        disable('#stopWatchingGeolocationBtn');
        evt.preventDefault();
    }

    function geolocationSuccess(position) {
        log('Received geolocation data');
        $('#latitude').html(position.coords.latitude);
        $('#longitude').html(position.coords.longitude);
        $('#altitude').html(position.coords.altitude);
        $('#accuracy').html(position.coords.accuracy);
        $('#altitudeAccuracy').html(position.coords.altitudeAccuracy);
        $('#heading').html(position.coords.heading);
        $('#speed').html(position.coords.speed);
        $('#geolocationTimestamp').html(position.timestamp?new Date(position.timestamp).toString():'null');
    }

    function geolocationError(error) {
        log('Geolocation Failure: ' + error.message);
    }

    var accelerometerOptions = { frequency: 500 };
    var accelerometerWatchId = null;

    function startWatchingAccelerometer(evt) {
        accelerometerWatchId = navigator.accelerometer.watchAcceleration(accelerometerSuccess, accelerometerError, accelerometerOptions); 
        log('Started watching accelerometer');
        disable('#startWatchingAccelerometerBtn');
        enable('#stopWatchingAccelerometerBtn');
        evt.preventDefault();
    }

    function stopWatchingAccelerometer(evt) {
        navigator.accelerometer.clearWatch(accelerometerWatchId);
        accelerometerWatchId = null;
        log('Stopped watching accelerometer');
        enable('#startWatchingAccelerometerBtn');
        disable('#stopWatchingAccelerometerBtn');
        evt.preventDefault();
    }

    function accelerometerSuccess(acceleration) {
        log('Received accelerometer data');
        displayMotion(acceleration);
        $('#accelerometerTimestamp').html(acceleration.timestamp?new Date(acceleration.timestamp).toString():'null');
    }

    function accelerometerError(error) {
        log('Accelerometer Failure: ' + error.message);
    }

    function onDeviceOrientation(evt) {
        $('#alpha').html(evt.alpha);
        $('#beta').html(evt.beta);
        $('#gamma').html(evt.gamma);
    }

    function onDeviceMotion(evt) {
        displayMotion(evt.accelerationIncludingGravity);
        /* Ignore for now:
        evt.acceleration.x, .y, and .z
        evt.rotationRate.alpha, .beta, and .gamma
        */
    }

    function displayMotion(motion) {
        $('#x').html(motion.x);
        $('#y').html(motion.y);
        $('#z').html(motion.z);
    }

    function startOscillator(evt) {
        oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 440;
        oscillator.connect(audioContext.destination);
        oscillator.noteOn(0);

        disable('#startOscillatorBtn');
        enable('#stopOscillatorBtn');
        evt.preventDefault();
        log('Started oscillator');
    }

    function stopOscillator(evt) {
        oscillator.noteOff(0);

        enable('#startOscillatorBtn');
        disable('#stopOscillatorBtn');
        evt.preventDefault();
        log('Stopped oscillator');
    }
});

