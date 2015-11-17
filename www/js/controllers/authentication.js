var app = angular.module('timetracker.controllers.authentication', []);

/*********************************************************************
 * LoginCtrl
 *********************************************************************/
app.controller('LoginCtrl', function ($scope, $state, AuthService) {

	$scope.formData = {
		"email": "",
		"password": ""
	};

	$scope.login = function (form) {

		if (form.$valid) {
			console.log("LoginCtrl::login");
			AuthService.login($scope.formData.email, $scope.formData.password)
				.then(function () {
          localStorage.setItem('firstVisit', '1');
					$state.go("menu.time")
				});
		}
	};

});

/*********************************************************************
 * SignupCtrl
 *********************************************************************/
app.controller('SignupCtrl', function ($scope, $state, AuthService) {

	$scope.formData = {
		"name": "",
		"email": "",
		"password": ""
	};

	$scope.signup = function (form) {
		if (form.$valid) {
			console.log("SignupCtrl::signup");
			AuthService.signup($scope.formData.email,
                         $scope.formData.name,
                         $scope.formData.password)
				.then(function () {
          localStorage.setItem('firstVisit', '1');
          //  Set default values after user creation.
          AuthService.setGoalDefaults()
            .then(function () {
              $state.go("menu.time")
            });
				});
		}
	};

});
