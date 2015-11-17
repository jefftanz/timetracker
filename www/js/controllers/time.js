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
      'theDate': '',
			'startTime': ((new Date()).getHours() * 60 * 60),
      'endTime': ((new Date()).getHours() * 60 * 60),
      'timeCategory': [
        {'desc': "Work", 'value': "work"},
        {'desc': "Meeting", 'value': "meeting"},
        {'desc': "Friends", 'value': "friends"},
        {'desc': "Family", 'value': "family"},
        {'desc': "Entertainment", 'value': "entertainment"}
      ],
      'selectedOption': {'desc': "Work", 'value': "work"}
		};
	};

  $scope.epochTime = 12600;

  //Because this is an add does it reset it every time...?
  $scope.timePickerObject = {
    inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
    step: 15,  //Optional
    format: 12,  //Optional
    titleLabel: '12-hour Format',  //Optional
    setLabel: 'Set',  //Optional
    closeLabel: 'Close',  //Optional
    setButtonType: 'button-positive',  //Optional
    closeButtonType: 'button-stable',  //Optional
    callback: function (val) {    //Mandatory
      timePickerCallback(val);
    }
  };

  function timePickerCallback(val) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      $scope.formData.startTime = val;
      $scope.timePickerObject.inputEpochTime = val;
      //$scope.inputEpochTime = val;
      var selectedTime = new Date(val * 1000);
      console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
    }
  }

	$scope.resetFormData1();

	$scope.createTime = function (form) {
		if (form.$valid) {

			$ionicLoading.show();
      TimeService.createTime($scope.formData).then(function () {
				$scope.resetFormData1();
				$ionicLoading.hide();
				form.$setPristine(true);
        $state.go("menu.time");
			});
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

  $scope.setTime = function(){
    var time = TimeService.getTime($state.params.timeId);

    $scope.formData = {
      'title': time.get("title"),
      'theDate': time.get("theDate"),
      'startTime': time.get("startTime"),
      'endTime': parseInt(time.get("endTime")),
      'timeCategory': [
        {'desc': "Work", 'value': "work"},
        {'desc': "Meeting", 'value': "meeting"},
        {'desc': "Friends", 'value': "friends"},
        {'desc': "Family", 'value': "family"},
        {'desc': "Entertainment", 'value': "entertainment"}
      ],
      'selectedOption':  {'desc': "Work", 'value': "work"}
    };

    //Set selectedOption in Food Groups combobox
    var index = 0;
    switch($scope.formData.group){
      //TODO figure this out with customized time categories by the user
    };
    $scope.formData.selectedOption = $scope.formData.timeCategory[index];

  };

  //TODO move foundGroups from formData to a global variable for this controller.

  $scope.resetFormData = function () {
    $scope.formData = {
      'title': '',
      'theDate': '',
      'startTime': '',
      'endTime': '',
      'timeCategory': [
        {'desc': "Work", 'value': "work"},
        {'desc': "Meeting", 'value': "meeting"},
        {'desc': "Friends", 'value': "friends"},
        {'desc': "Family", 'value': "family"},
        {'desc': "Entertainment", 'value': "entertainment"}
      ],
      'selectedOption':  {'desc': "Work", 'value': "work"}
    };
  };

  $scope.saveTime = function (form) {
    $ionicLoading.show();
    TimeService.update($scope.formData, $scope.timeId).then(function () {

      $scope.time.refresh().then(function(){
        $scope.resetFormData();
        $ionicLoading.hide();
        form.$setPristine(true);
        $state.go("menu.time");
      });
    });
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

  $scope.setTime();

});
