var app = angular.module('timetracker.services.time', [
  "timetracker.myUtil.basic"
]);

app.service("TimeService", function ($q, $ionicPopup, AuthService) {
	var self = {
		'page': 0,
		'page_size': 20,
		'isLoading': false,
		'isSaving': false,
		'hasMore': true,
		'results': [],
		'refresh': function () {
			self.page = 0;
			self.isLoading = false;
			self.isSaving = false;
			self.hasMore = true;
			self.results = [];
			return self.load();
		},
		'next': function () {
			self.page += 1;
			return self.load();
		},
		'load': function () {
			self.isLoading = true;
			var d = $q.defer();

			// Initialise Query
			var Time = Parse.Object.extend("Time");
			var timeQuery = new Parse.Query(Time);
			timeQuery.descending('created');
			timeQuery.equalTo("owner", AuthService.user);

			// Paginate
			timeQuery.skip(self.page * self.page_size);
			timeQuery.limit(self.page_size);

			// Perform the query
			timeQuery.find({
				success: function (results) {
					angular.forEach(results, function (item) {
            self.results.push(item);
					});
					//console.debug(self.results);
					//Displays objects in console to easily read

					// Are we at the end of the list?
					if (results.length == 0) {
						self.hasMore = false;
					}

					// Finished
					d.resolve();
				}
			});

			return d.promise;
		},
		'createTime': function (data) {
			self.isSaving = true;
			var d = $q.defer();
      var iconName;
			var Time = Parse.Object.extend("Time");
			var user = AuthService.user;
			var time = new Time();

      time.set("owner", user);
      time.set("title", data.title);
      time.set("theDate", new Date());
      time.set("startTime", data.startTime);
      time.set("endTime", data.endTime);
      time.set("timeCategory", data.timeCategory);

      switch(data.selectedOption.value){
        default: iconName = 'img/mike.png';break;
      }

      time.set("iconName", iconName);

      time.save(null, {
				success: function (time) {
					self.results.unshift(time);
					d.resolve(time);
				},
				error: function (item, error) {
					$ionicPopup.alert({
						title: "Error saving time",
						subTitle: error.message
					});
					d.reject(error);
				}
			});

			return d.promise;
		},
    'getTime': function (timeId) {
      for (var i = 0; i < this.results.length; i++){
        if (this.results[i].id == timeId){
          self.selectedTime = this.results[i];
          return this.results[i];
        }
      }
      console.log("Time Not found");
      return undefined;
    },
    'getTimeIndex': function (timeId) {
      for (var i = 0; i < this.results.length; i++){
        if (this.results[i].id == timeId){
          return i;
        }
      }
      return undefined;
    },
    'update': function (formData, timeId) {
      self.isSaving = true;
      var d = $q.defer();
      var iconName;
      var Time = Parse.Object.extend("Time");
      var user = AuthService.user;
      var item = this.getTime(timeId);
      var time = new Time(item);

      time.set("owner", user);
      time.set("id", timeId);
      time.set("title", formData.title);
      time.set("theDate", new Date());
      time.set("startTime", '');
      time.set("endTime", '');
      time.set("timeCategory", formData.selectedOption.value);

      switch(formData.selectedOption.value){
        default : iconName = 'img/mike.png';break;
      }

      time.set("iconName", iconName);

      time.save(null, {
        success: function (time) {
          self.results.unshift(time);
          d.resolve(time);
        },
        error: function (item, error) {
          $ionicPopup.alert({
            title: "Error saving time",
            subTitle: error.message
          });
          d.reject(error);
        }
      });

      return d.promise;
    },
    'destroyTime': function (timeId) {
      self.isSaving = true;
      var d = $q.defer();
      var index = this.getTimeIndex(timeId);

      self.results[index].destroy().then(function(){
        d.resolve();
      });

      return d.promise;
    }

	};

	return self;
});
