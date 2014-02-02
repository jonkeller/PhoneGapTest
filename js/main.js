requirejs.config(
{
    paths:
    {
        'jquery': '../external/jQuery/jquery-1.11.0.min',
        'bootstrap': '../external/bootstrap/dist/js/bootstrap.min'
    },
    shim:
    {
        'googleAnalytics':
        {
        	exports: 'ga'
        },
        'bootstrap.min':
        {
            deps: ['jquery'],
            exports: '$'
        }
    }
});

requirejs(['jquery', 'googleAnalytics', 'bootstrap'], function($)
{
    var audioContext;
    var oscillator;

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady(); // Running on desktop browser
    }

    function onDeviceReady() {
        $('#startWatchingGeolocationBtn').on('click', startWatchingGeolocation);
        $('#stopWatchingGeolocationBtn').on('click', stopWatchingGeolocation);
        $('#startWatchingAccelerometerBtn').on('click', startWatchingAccelerometer);
        $('#stopWatchingAccelerometerBtn').on('click', stopWatchingAccelerometer);
        $('#startOscillatorBtn').on('click', startOscillator);
        $('#stopOscillatorBtn').on('click', stopOscillator);

        setStatus('Ready');
        if (navigator.geolocation) {
            //navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError/*, geolocationOptions*/);
            enable('#startWatchingGeolocationBtn');
        } else {
            setStatus('No geolocation');
        }

        if (navigator.accelerometer) {
            //navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError)
            enable('#startWatchingAccelerometerBtn');
        } else {
            setStatus('No accelerometer');
        }

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext);            
            enable('#startOscillatorBtn');
        } catch (e) {
            setStatus('No audioContext');
        }
    }

    function setStatus(string) {
        $('#status').html(string);
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
        setStatus('Started watching geolocation');
        disable('#startWatchingGeolocationBtn');
        enable('#stopWatchingGeolocationBtn');
        evt.preventDefault();
    }

    function stopWatchingGeolocation(evt) {
        navigator.geolocation.clearWatch(geolocationWatchId);
        geolocationWatchId = null;
        setStatus('Stopped watching geolocation');
        enable('#startWatchingGeolocationBtn');
        disable('#stopWatchingGeolocationBtn');
        evt.preventDefault();
    }

    function geolocationSuccess(position) {
        setStatus('Received geolocation data');
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
        setStatus('Geolocation Failure: ' + error.message);
    }

    var accelerometerOptions = { frequency: 500 };
    var accelerometerWatchId = null;

    function startWatchingAccelerometer(evt) {
        accelerometerWatchId = navigator.accelerometer.watchAcceleration(accelerometerSuccess, accelerometerError, accelerometerOptions); 
        setStatus('Started watching accelerometer');
        disable('#startWatchingAccelerometerBtn');
        enable('#stopWatchingAccelerometerBtn');
        evt.preventDefault();
    }

    function stopWatchingAccelerometer(evt) {
        navigator.accelerometer.clearWatch(accelerometerWatchId);
        accelerometerWatchId = null;
        setStatus('Stopped watching accelerometer');
        enable('#startWatchingAccelerometerBtn');
        disable('#stopWatchingAccelerometerBtn');
        evt.preventDefault();
    }

    function accelerometerSuccess(acceleration) {
        setStatus('Received accelerometer data');
        $('#x').html(acceleration.x);
        $('#y').html(acceleration.y);
        $('#z').html(acceleration.z);
        $('#accelerometerTimestamp').html(acceleration.timestamp?new Date(acceleration.timestamp).toString():'null');
    }

    function accelerometerError(error) {
        setStatus('Accelerometer Failure: ' + error.message);
    }

    function startOscillator(evt) {
        oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 440;
        oscillator.connect(audioContext.destination);
        oscillator.noteOn(0);

        disable('#startOscillatorBtn');
        enable('#stopOscillatorBtn');
        evt.preventDefault();
    }

    function stopOscillator(evt) {
        oscillator.noteOff(0);

        enable('#startOscillatorBtn');
        disable('#stopOscillatorBtn');
        evt.preventDefault();
    }
});

