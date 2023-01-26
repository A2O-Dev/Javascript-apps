alte.requires.push('vsGoogleAutocomplete', 'ngCookies', 'ngSanitize', 'ui.dateTimeInput', 'ui.bootstrap.datetimepicker');
alte.component('search', {
    templateUrl: 'assets/components/searchTitles/search.template.html?v='+ window.ASSETS_VERSION,
    bindings: {
    },
    controllerAs: 'cm',
    controller: function($scope, $http,searchBarService, authService, $cookies, $timeout) {
        var cm = this;
        cm.location = {};
        cm.loading = false;
        cm.titlesList = [];
        cm.showResults = true;
        cm.view = 'search';
        cm.authService = authService;
        cm.showAuthenticationFlag = false;
        cm.documentTypes = [];
        cm.searchFilter = {
            documentTypes : []
        };

        cm.options = {
            componentRestrictions: {country: 'US'}
        };

        cm.formFilter = false;

        cm.$onInit = function () {
            cm.offset = 0;
            cm.limit = 10;
            cm.loadDocumentTypes();

            $timeout(function() {
                cm.location = $cookies.getObject('location');
                if(typeof cm.location.latitude !== 'undefined' && cm.location.latitude !== null &&
                    typeof cm.location.longitude !== 'undefined' && cm.location.longitude !== null &&
                    typeof cm.location.name !== 'undefined' && cm.location.name !== null
                ){
                    cm.searchTitles(cm.offset, cm.limit);
                }
            });
        };

        cm.loadDocumentTypes = function(){
            $http({
                method: "GET",
                url:'assets/json/documentTypes.json',
                params: {}
            }).then(function httpSuccess(response){
                cm.documentTypes = response.data;
            }, function httpError(error){
                console.log(error);
            });
        };

        cm.toggleItemInList = function(list, item) {

            var idx = list.indexOf(item);

            // Is currently selected
            if (idx > -1) {
                list.splice(idx, 1);
            }

            // Is newly selected
            else {
                list.push(item);
            }
        };

        cm.searchTitles = function(offset, limit){
            cm.offset = offset;
            cm.limit = limit;
            cm.loading = true;
            $cookies.putObject('location', cm.location);
            searchBarService.getAllByLocation(
                cm.limit,
                cm.offset,
                cm.location.latitude,
                cm.location.longitude,
                cm.location.district,
                cm.location.state,
                cm.searchFilter
            ).then(function(httpSuccess){
                cm.titlesList = httpSuccess.data.results;
                cm.totalCount = httpSuccess.data.totalCount;
                cm.totalPostulantJobs = httpSuccess.data.totalPostulants;
                angular.forEach(cm.titlesList, function(title, index){
                   if(typeof title.expireDate !== 'undefined' && title.expireDate !== null){
                       title.expireDate = moment(title.expireDate.date);
                   }
                });
                cm.sendResults(cm.titlesList);
                },
                function (httpError) {
                    console.error(httpError);
                }).finally(function(){
                    cm.loading = false;
                    cm.location = $cookies.getObject('location');
                });
        };

        cm.sendResults = function (titles) {
            $scope.$broadcast('searchResults_recieveResults', titles);
        };

        cm.showPostJobForm = function() {

            if(cm.authService.hasUser()){
                cm.view = 'search-job-form';
            }else{
                cm.showAuthentication();
            }
        };

        cm.showAuthentication = function () {
            cm.showAuthenticationFlag = true;
        };

        cm.proceedToSearchJob = function (authUser) {
            if(typeof authUser !== 'undefined' && authUser !== null){
                cm.showAuthenticationFlag = false;
                cm.view = 'search-job-form';
            }
        };

        cm.showFormFilter = function () {
            cm.formFilter = true;
        };

        cm.hideFormFilter = function () {
            cm.formFilter = false;
        };

        cm.checkDateSearch = function () {
            if(!cm.searchFilter.dateSearch){
                cm.searchFilter.startDateSearch = undefined;
                cm.searchFilter.endDateSearch = undefined;
            }
        };

        cm.checkDateEffective = function () {
            if(!cm.searchFilter.dateEffective){
                cm.searchFilter.startDateEffective = undefined;
                cm.searchFilter.endDateEffective = undefined;
            }
        };

        cm.clearFormFilter = function () {
            cm.searchFilter = {
                documentTypes : []
            };
        };

        cm.hidePostJobForm = function() {
            cm.view = 'search';
        };

        $scope.$on('search_hidePagination',function () {
            cm.showResults = false;
        });

        $scope.$on('search_showPagination',function () {
            cm.showResults = true;
        });

        $scope.$on('search_hidePostJobForm', function () {
            cm.hidePostJobForm();
        })

    }
});