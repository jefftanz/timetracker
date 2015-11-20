var app = angular.module('timetracker.controllers.time', []);


/*********************************************************************
 * TimeListCtrl
 *********************************************************************/
app.controller('TimeListCtrl', function ($scope, $state, $ionicLoading, TimeService) {

	$scope.time = TimeService;

  console.log("inside TimeListCtrl");

	$ionicLoading.show();
	$scope.time.load().then(function () {
		$ionicLoading.hide();
	});

	$scope.refreshItems = function () {
		$scope.time.refresh().then(function () {
      console.log("TimeListCtrl-refreshItems");
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.nextPage = function () {
		$scope.time.next().then(function () {
      console.log("TimeListCtrl-nextPage");
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

  $scope.editTime = function(id){
    $state.go("menu.edit", { "timeId": id});
  };

  $scope.addTime = function(){
    $state.go("menu.add");
  };

  //TODO Refresh meal data after user has logged out.
  // Or Remove the logout process for version 1.0?
  //$scope.label = "No More Results";

});

/*********************************************************************
 * TimeCreateCtrl
 *********************************************************************/
app.controller('TimeCreateCtrl', function ($scope,
                                           $state,
                                           $ionicPopup,
                                           $ionicLoading,
                                           TimeService) {

	$scope.resetFormData1 = function () {
    console.log("resetFormData1");

		$scope.formData = {
			'title': '',
      'theDate': new Date(),
			'startTime': ((new Date()).getHours() * 60 * 60),
      'endTime': ((new Date()).getHours() * 60 * 60),
      'timeSE': '',
      'timeCategory': '',
      'timeGroups': [
        {'desc': "Cooking", 'value': "cooking"},
        {'desc': "Cleaning", 'value': "cleaning"},
        {'desc': "Driving", 'value': "driving"},
        {'desc': "Eat", 'value': "eat"},
        {'desc': "Entertainment", 'value': "entertainment"},
        {'desc': "Family", 'value': "family"},
        {'desc': "Friends", 'value': "friends"},
        {'desc': "Meeting", 'value': "meeting"},
        {'desc': "Networking", 'value': "networking"},
        {'desc': "Other", 'value': "other"},
        {'desc': "School", 'value': "school"},
        {'desc': "Socialize", 'value': "socialize"},
        {'desc': "Sleep", 'value': "sleep"},
        {'desc': "Study", 'value': "study"},
        {'desc': "Work", 'value': "work"},
        {'desc': "Workout", 'value': "workout"}
      ],
      'selectedOption': {'desc': "Work", 'value': "work"}
		};
	};

  $scope.startTime = ((new Date()).getHours() * 60 * 60);
  $scope.endTime = ((new Date()).getHours() * 60 * 60);
  $scope.theDate = new Date();

  var weekDaysList = ["S", "M", "T", "W", "T", "F", "S"];
  var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

  $scope.datepickerTheDate = {
    titleLabel: 'Title',  //Optional
    todayLabel: 'Today',  //Optional
    closeLabel: 'Close',  //Optional
    setLabel: 'Set',  //Optional
    setButtonType : 'button-positive',  //Optional
    todayButtonType : 'button-assertive',  //Optional
    closeButtonType : 'button-stable',  //Optional
    inputDate: new Date(),  //Optional
    mondayFirst: true,  //Optional
    weekDaysList: weekDaysList, //Optional
    monthList: monthList, //Optional
    templateType: 'popup', //Optional
    showTodayButton: 'true', //Optional
    modalHeaderColor: 'bar-positive', //Optional
    modalFooterColor: 'bar-positive', //Optional
    from: new Date(2012, 8, 2), //Optional
    to: new Date(2018, 8, 25),  //Optional
    callback: function (val) {  //Mandatory
      datePickerTheDateCallback(val);
    },
    dateFormat: 'dd-MM-yyyy', //Optional
    closeOnSelect: false, //Optional
  };

  var datePickerTheDateCallback = function (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      $scope.theDate = val;
      $scope.datepickerTheDate.inputDate = val;
      $scope.formData.theDate = val;
      console.log('Selected date is : ', val)
    }
  };

  //Because this is an add does it reset it every time...?
  $scope.timePickerStartTime = {
    inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
    step: 15,                           //Optional
    format: 12,                         //Optional
    titleLabel: 'Start time',           //Optional
    setLabel: 'Set',                    //Optional
    closeLabel: 'Close',                //Optional
    setButtonType: 'button-positive',   //Optional
    closeButtonType: 'button-stable',   //Optional
    callback: function (val) {          //Mandatory
      timePickerStartTimeCallback(val);
    }
  };

  function timePickerStartTimeCallback(val) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      $scope.timePickerStartTime.inputEpochTime = val;
      $scope.startTime = val;
      $scope.formData.startTime = val;

      //var selectedTime = new Date(val * 1000);
      //console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
    }
  }

  $scope.timePickerEndTime = {
    inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
    step: 15,                           //Optional
    format: 12,                         //Optional
    titleLabel: 'End time',             //Optional
    setLabel: 'Set',                    //Optional
    closeLabel: 'Close',                //Optional
    setButtonType: 'button-positive',   //Optional
    closeButtonType: 'button-stable',   //Optional
    callback: function (val) {    //Mandatory
      timePickerEndTimeCallback(val);
    }
  };

  function timePickerEndTimeCallback(val) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      $scope.timePickerStartTime.inputEpochTime = val;
      $scope.endTime = val;
      $scope.formData.endTime = val;
    }
  }

	$scope.resetFormData1();

	$scope.createTime = function (form) {
    console.log("TimeCtrl::createTime");
		if (form.$valid) {
      var alertPopup;
      if ($scope.formData.startTime > $scope.formData.endTime){
        alertPopup = $ionicPopup.alert({title: 'Start time invalid'});
        alertPopup.then(function(res) {console.log('StartTime > EndTime');});
      }else if ($scope.formData.startTime === $scope.formData.endTime){
        alertPopup = $ionicPopup.alert({title: 'Start time invalid'});
        alertPopup.then(function(res) {console.log('StartTime === EndTime');});
      }else{
        $ionicLoading.show();
        TimeService.createTime($scope.formData).then(function () {
          $scope.resetFormData1();
          $ionicLoading.hide();
          form.$setPristine(true);
          $state.go("menu.time");
        });
      }
		}
	};

});

/*********************************************************************
 * TimeEditCtrl
 *********************************************************************/
app.controller('TimeEditCtrl', function ($scope,
                                         $state,
                                         $ionicPopup,
                                         $ionicLoading,
                                         TimeService) {

  $scope.timeId = $state.params.timeId;
  $scope.time = TimeService;
  $scope.startTime = ((new Date()).getHours() * 60 * 60);
  $scope.endTime = ((new Date()).getHours() * 60 * 60);
  $scope.theDate = new Date();

  var weekDaysList = ["S", "M", "T", "W", "T", "F", "S"];
  var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

  $scope.datepickerTheDate = {
    titleLabel: 'Title',  //Optional
    todayLabel: 'Today',  //Optional
    closeLabel: 'Close',  //Optional
    setLabel: 'Set',  //Optional
    setButtonType : 'button-positive',  //Optional
    todayButtonType : 'button-assertive',  //Optional
    closeButtonType : 'button-stable',  //Optional
    inputDate: new Date(),  //Optional
    mondayFirst: true,  //Optional
    weekDaysList: weekDaysList, //Optional
    monthList: monthList, //Optional
    templateType: 'popup', //Optional
    showTodayButton: 'true', //Optional
    modalHeaderColor: 'bar-positive', //Optional
    modalFooterColor: 'bar-positive', //Optional
    from: new Date(2012, 8, 2), //Optional
    to: new Date(2018, 8, 25),  //Optional
    callback: function (val) {  //Mandatory
      datePickerTheDateCallback(val);
    },
    dateFormat: 'dd-MM-yyyy', //Optional
    closeOnSelect: false, //Optional
  };

  var datePickerTheDateCallback = function (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      $scope.theDate = val;
      $scope.datepickerTheDate.inputDate = val;
      $scope.formData.theDate = val;
      console.log('Selected date is : ', val)
    }
  };

  //Because this is an add does it reset it every time...?
  $scope.timePickerStartTime = {
    inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
    step: 15,  //Optional
    format: 12,  //Optional
    titleLabel: 'Start time',  //Optional
    setLabel: 'Set',  //Optional
    closeLabel: 'Close',  //Optional
    setButtonType: 'button-positive',  //Optional
    closeButtonType: 'button-stable',  //Optional
    callback: function (val) {    //Mandatory
      timePickerStartTimeCallback(val);
    }
  };

  function timePickerStartTimeCallback(val) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      $scope.timePickerStartTime.inputEpochTime = val;
      $scope.startTime = val;
      $scope.formData.startTime = val;

      //var selectedTime = new Date(val * 1000);
      //console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
    }
  }

  $scope.timePickerEndTime = {
    inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
    step: 15,  //Optional
    format: 12,  //Optional
    titleLabel: 'End time',  //Optional
    setLabel: 'Set',  //Optional
    closeLabel: 'Close',  //Optional
    setButtonType: 'button-positive',  //Optional
    closeButtonType: 'button-stable',  //Optional
    callback: function (val) {    //Mandatory
      timePickerEndTimeCallback(val);
    }
  };

  function timePickerEndTimeCallback(val) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      $scope.timePickerStartTime.inputEpochTime = val;
      $scope.endTime = val;
      $scope.formData.endTime = val;

      //var selectedTime = new Date(val * 1000);
      //console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
    }
  }

  $scope.setTime = function(){
    var time = TimeService.getTime($state.params.timeId);

    console.log("inside setTime");

    $scope.formData = {
      'title': time.get("title"),
      'theDate': time.get("theDate"),
      'startTime': time.get("startTime"),
      'endTime': time.get("endTime"),
      'timeSE': time.get("timeSE"),
      'timeCategory': time.get("timeCategory"),
      'timeGroups': [
        {'desc': "Cooking", 'value': "cooking"},
        {'desc': "Cleaning", 'value': "cleaning"},
        {'desc': "Driving", 'value': "driving"},
        {'desc': "Eat", 'value': "eat"},
        {'desc': "Entertainment", 'value': "entertainment"},
        {'desc': "Family", 'value': "family"},
        {'desc': "Friends", 'value': "friends"},
        {'desc': "Meeting", 'value': "meeting"},
        {'desc': "Networking", 'value': "networking"},
        {'desc': "Other", 'value': "other"},
        {'desc': "School", 'value': "school"},
        {'desc': "Socialize", 'value': "socialize"},
        {'desc': "Sleep", 'value': "sleep"},
        {'desc': "Study", 'value': "study"},
        {'desc': "Work", 'value': "work"},
        {'desc': "Workout", 'value': "workout"}
      ],
      'selectedOption':  {'desc': "Work", 'value': "work"}
    };

    console.log("timeCategory: "+ $scope.formData.timeCategory);

    //Set selectedOption in Food Groups combo box
    var index = 0;
    switch($scope.formData.timeCategory){
      case "cooking": index = 0; break;
      case "cleaning": index = 1; break;
      case "driving": index = 2; break;
      case "eat": index = 3; break;
      case "entertainment": index = 4; break;
      case "family": index = 5; break;
      case "friends":  index = 6; break;
      case "meeting":   index = 7; break;
      case "networking":   index = 8; break;
      case "other":   index = 9; break;
      case "school":   index = 10; break;
      case "sleep":   index = 11; break;
      case "socialize":   index = 12; break;
      case "study":   index = 13; break;
      case "work":   index = 14; break;
      case "workout":   index = 15; break;
      default : index = 0; break;
    };

    console.log("index: "+index);

    $scope.formData.selectedOption = $scope.formData.timeGroups[index];

    $scope.timePickerStartTime.inputEpochTime = time.get("endTime");
    $scope.endTime = time.get("endTime");
    $scope.formData.endTime = time.get("endTime");

    $scope.timePickerStartTime.inputEpochTime = time.get("startTime");
    $scope.startTime = time.get("startTime");
    $scope.formData.startTime = time.get("startTime");

    $scope.theDate = time.get("theDate");
    $scope.datepickerTheDate.inputDate = time.get("theDate");
    $scope.formData.theDate = time.get("theDate");
  };

  //TODO move foundGroups from formData to a global variable for this controller.

  $scope.resetFormData = function () {
    console.log("inside resetFormData");

    $scope.formData = {
      'title': '',
      'theDate': '',
      'startTime': '',
      'endTime': '',
      'timeSE': '',
      'timeCategory' : '',
      'timeGroups': [
        {'desc': "Cooking", 'value': "cooking"},
        {'desc': "Cleaning", 'value': "cleaning"},
        {'desc': "Driving", 'value': "driving"},
        {'desc': "Eat", 'value': "eat"},
        {'desc': "Entertainment", 'value': "entertainment"},
        {'desc': "Family", 'value': "family"},
        {'desc': "Friends", 'value': "friends"},
        {'desc': "Meeting", 'value': "meeting"},
        {'desc': "Networking", 'value': "networking"},
        {'desc': "Other", 'value': "other"},
        {'desc': "School", 'value': "school"},
        {'desc': "Socialize", 'value': "socialize"},
        {'desc': "Sleep", 'value': "sleep"},
        {'desc': "Study", 'value': "study"},
        {'desc': "Work", 'value': "work"},
        {'desc': "Workout", 'value': "workout"}
      ],
      'selectedOption':  {'desc': "Work", 'value': "work"}
    };

    //TODO I probably do not need three of the same values on the form.
    // Figure out which ones are needed and which I can remove.
    var newDateEpoch = ((new Date()).getHours() * 60 * 60);
    var newDate = new Date();

    $scope.timePickerStartTime.inputEpochTime = newDateEpoch;
    $scope.endTime = newDateEpoch;
    $scope.formData.endTime = newDateEpoch;

    $scope.timePickerStartTime.inputEpochTime = newDateEpoch;
    $scope.startTime = newDateEpoch;
    $scope.formData.startTime = newDateEpoch;

    $scope.theDate = newDate;
    $scope.datepickerTheDate.inputDate = newDate;
    $scope.formData.theDate = newDate;
  };

  $scope.saveTime = function (form) {
    var alertPopup;
    if ($scope.formData.startTime > $scope.formData.endTime){
      alertPopup = $ionicPopup.alert({title: 'Start time invalid'});
      alertPopup.then(function(res) {console.log('StartTime > EndTime');});
    }else if ($scope.formData.startTime === $scope.formData.endTime){
      alertPopup = $ionicPopup.alert({title: 'Start time invalid'});
      alertPopup.then(function(res) {console.log('StartTime === EndTime');});
    }else{
      $ionicLoading.show();
      TimeService.update($scope.formData, $scope.timeId).then(function () {
        $scope.time.refresh().then(function(){
          $scope.resetFormData();
          $ionicLoading.hide();
          form.$setPristine(true);
          $state.go("menu.time");
        });
      });
    }
  };

  $scope.deleteTime = function (timeId){
    $ionicLoading.show();

    TimeService.destroyTime($scope.timeId).then(function () {
      $ionicLoading.hide();

      $scope.time.refresh().then(function(){
        $scope.resetFormData();
        $ionicLoading.hide();
        $state.go("menu.time");
      });
    });

  };

  $scope.resetFormData();
  $scope.setTime();

});
