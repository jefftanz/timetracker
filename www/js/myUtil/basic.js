var app = angular.module('timetracker.myUtil.basic', []);

var parseMyInt = function(numberValue){

  if (numberValue === null || numberValue.length === 0) {
    return 0;
  }else if (numberValue < 0){
    return 0;
  }else{
    return parseInt(numberValue);
  }

};
