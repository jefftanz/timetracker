/**
 * Created by jeff on 11/20/15.
 */
var app = angular.module('timetracker.filters.timelength', []);

app.filter("timelength", function () {
  return function (timeSE) {
    console.log("timeSE: "+timeSE);
    var time;
    var milliSecDif;
    var hours;
    var minutes;
    var minuteText = '';
    var hourText = '';

    if (!timeSE) {
      return '';
    }

    time = timeSE.split('|');
    console.log("time 0: "+time[0]);
    console.log("time 1: "+time[1]);

    milliSecDif = parseInt(time[1]) - parseInt(time[0]);
    console.log("milliSecDif: "+milliSecDif);

    //Hours
    hours = Math.floor(milliSecDif / 3600);
    if (hours == 1){
      hourText = hours.toString() +" "+ "hr";
    }else if (hours > 1){
      hourText = hours.toString() +" "+ "hrs";
    }

    //Minutes
    minutes = (milliSecDif - (hours * 3600)) / 60;
    if (minutes > 0){
      minuteText = minutes.toString() + " " + "min";
    }

    console.log("hours: "+hourText);
    console.log("minutes: "+minuteText);

    return hourText + " " + minuteText;
    //moment.epochUTC
    //return moment.utc(moment(time[1]).diff(moment(time[0]))).format("mm");

  };
});
