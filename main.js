"use strict";

(function () {

    // GENERAL FUNCTIONS

    Number.isNaN = Number.isNaN || function(value) {
        return typeof value === "number" && isNaN(value);
    }

    window.debug = false;

    function assert(condition, message) {
        if (!condition && window.debug) {
            throw new Error(message);
        }
    }

    // APPLICATION FUNCTIONS

    var timeUnitValues = {
        "seconds": 1
    };
    timeUnitValues.minutes = timeUnitValues.seconds * 60;
    timeUnitValues.hours = timeUnitValues.minutes * 60;
    timeUnitValues.days = timeUnitValues.hours * 24;
    timeUnitValues.weeks = timeUnitValues.days * 7;
    timeUnitValues.months = timeUnitValues.days * 30.4375 // Avg days in a month;
    timeUnitValues.years = timeUnitValues.months * 12;

    function getRelativeTimeSpan(viewModel) {

        var theirSeconds = viewModel.number * timeUnitValues[viewModel.unit];

        var relativeSeconds = (function calculateRelativeTimeSpan(theirSeconds, myAge, theirAge) {
            var ratio = myAge / theirAge
            var mySeconds = theirSeconds * ratio
            return mySeconds
        }(theirSeconds, viewModel.myAge, viewModel.theirAge));

        var formattedRelativeSeconds = (function formatSeconds(seconds) {

            function format(number, label) {

                var roundedNumber = Math.floor(number);

                var name = (function (roundedNumber) {
                    var names = [
                        "zero",
                        "one",
                        "two",
                        "three",
                        "four",
                        "five",
                        "six",
                        "seven",
                        "eight",
                        "nine"
                    ];
                    if (roundedNumber >= names.length) {
                        return roundedNumber.toString();
                    }
                    return names[roundedNumber];
                }(roundedNumber));

                var s = roundedNumber === 1 ? "" : "s"
                return name + " " + label + s
            }

            if (Number.isNaN(seconds) || seconds < 0) {
                return "(loading)";
            }
            
            // Get an int() number of seconds
            // and return a pretty string
            // like 'two hours', 'seven weeks', 'one year', etc

            if (seconds < 60) {
                return format(seconds, "second");
            }
            
            var minutes = seconds / 60;
        
            if (minutes < 60) {
                return format(minutes, "minute");
            }
        
            var hours = minutes / 60;
        
            if (hours < 24) {
                return format(hours, "hour");
            }
        
            var days = hours / 24;
        
            if (days < 7) {
                return format(days, "day");
            }
        
            var weeks = days / 7;
        
            if (weeks < 8) {
                return format(weeks, "week");
            }
        
            var months = days / 30.4375 // Avg days in a month
        
            if (months < 24) {
                return format(months, "month");
            }
        
            var years = months / 12;
        
            return format(years, "year");
        }(relativeSeconds));

        return formattedRelativeSeconds;
    }

    function getViewModel() {
        function getNumber(id) {
            var number = document.getElementById(id).value;
            number = parseFloat(number);
            return number;
        }

        var myAge = getNumber("my-age");
        var theirAge = getNumber("their-age");
        var timeNumber = getNumber("number");
        var timeUnit = document.getElementById("unit").value;

        assert(myAge > 0, "\"My Age\" should be a non-negative number, but it's " + myAge + ".");
        assert(theirAge > 0, "\"Their Age\" should be a non-negative number, but it's " + theirAge + ".");
        assert(timeNumber > 0, "\"Time Number\" should be a number, but it's " + timeNumber + ".");

        var validTimeUnits = Object.keys(timeUnitValues);
        assert(validTimeUnits.indexOf(timeUnit) !== -1, "\"Time Unit\" " + timeUnit + " is invalid.");

        return {
            myAge: myAge,
            theirAge: theirAge,
            number: timeNumber,
            unit: timeUnit
        };
    }

    window.update = function onUpdate() {
        var viewModel = getViewModel();

        (function setRelativeTimeResult(viewModel) {
            var relativeTime = getRelativeTimeSpan(viewModel);
            document.getElementById("relative-time-span").innerText = relativeTime;
        }(viewModel));

        (function makeUnitOptionsPluralOrSingular(viewModel) {
            var s = viewModel.number === 1 ? "" : "s";
            var options = document.getElementById("unit").options;
            Array.prototype.forEach.call(options, function (option) {
                if (option.text[option.text.length - 1] === "s") {
                    option.text = option.text.substring(0, option.text.length - 1);
                }
    
                option.text = option.text + s;
            });
        }(viewModel));

        (function updateUrl(viewModel) {
            window.location.hash = [viewModel.myAge, viewModel.theirAge, viewModel.number, viewModel.unit].join("+");
        }(viewModel));
    };

    // SETUP THE PAGE

    (function readViewModelFromUrl() {
        function setNumber(id, value) {
            var float = parseFloat(value);
            if (Number.isNaN(float)) {
                return;
            }

            document.getElementById(id).value = value;
        }

        // .substring(1) SPLITS THE '#' CHARACTER OFF THE BEGINNING.
        var hashData = window.location.hash.substring(1).split("+");
        if (hashData.length !== 4) {
            return;
        }

        setNumber("my-age", hashData[0]);
        setNumber("their-age", hashData[1]);
        setNumber("number", hashData[2]);
        document.getElementById("unit").value = hashData[3];
    }());
    update();

}());