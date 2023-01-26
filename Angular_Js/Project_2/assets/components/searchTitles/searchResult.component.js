alte.component('searchResult', {
    templateUrl: 'assets/components/searchTitles/searchResult.template.html?v='+ window.ASSETS_VERSION,
    bindings: {

    },
    controllerAs: 'cm',
    controller: function($scope) {
        var cm = this;

        cm.found_titles = [];
        cm.tmpTitle = {};
        cm.showResultsFlag = false;
        cm.titlePreview = false;
        cm.titleDetail = false;

        $scope.$on('searchResults_recieveResults', function(e, results){
            cm.showResults(results);
        });

        cm.showResults = function(results){
            cm.found_titles = results;

            angular.forEach(cm.found_titles, function (title) {
                if(typeof title.dateSearch != 'undefined' && typeof title.dateSearch != null){
                    if (typeof title.dateSearch.date != 'undefined' && typeof title.dateSearch.date != 'function') {
                        title.dateSearch = moment(title.dateSearch.date);
                    }
                }

                if(typeof title.dateEffective != 'undefined' && typeof title.dateEffective != null){
                    if (typeof title.dateEffective.date != 'undefined' && typeof title.dateEffective.date != 'function') {
                        title.dateEffective = moment(title.dateEffective.date);
                    }
                }
            });

            cm.showResultsFlag = true;
        };

        cm.showPreview = function (titleItem) {
            $scope.$parent.$broadcast('search_hidePagination');
            cm.tmpTitle = titleItem;
            cm.titlePreview = true;
        };

        cm.hidePreview = function () {
            $scope.$parent.$broadcast('search_showPagination');
            cm.titlePreview = false;
        };

        cm.showForm = function () {
            cm.showFormTitle = true;
        };

        cm.hideForm = function () {
            cm.showFormTitle = false;
        };

        cm.showDetail = function () {
            $scope.$parent.$broadcast('search_hidePagination');
            cm.titleDetail = true;
        };

        cm.hideDetail = function () {
            $scope.$parent.$broadcast('search_showPagination');
            cm.titleDetail = false;
        };

        $scope.$on('postedTitles_showForm',function (e,title) {
            cm.tmpTitle = angular.copy(title);
            cm.showForm();
        });

        $scope.$on('postedTitles_hideForm',function () {
            cm.tmpTitle = {
                'documentList':[]
            };
            cm.hideForm();
        });

        $scope.$on('postedTitles_showDetail', function(e,title){
            cm.tmpTitle = angular.copy(title);
            cm.tmpTitle.search = true;
            cm.showDetail();
        });

    }
});