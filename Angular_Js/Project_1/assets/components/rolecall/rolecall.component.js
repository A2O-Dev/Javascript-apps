roleCall.component('rolecall',{
    templateUrl: "/assets/components/rolecall/rolecall.template.html?v="+window.ASSETS_VERSION,
    bindings: {
        rolecall:'<',
        uploadConfig : '<'
    },
    controllerAs:'cm',
    controller : function ($scope, $http, $interval) {

        var cm = this;
        cm.loading= false;
        cm.parseDates = function() {
            if (typeof cm.rolecall.startDate != 'undefined'
                && cm.rolecall.startDate != null
                && typeof cm.rolecall.startDate.date != 'undefined') {
                cm.rolecall.startDate = moment(cm.rolecall.startDate.date);
            }
            if (typeof cm.rolecall.endDate != 'undefined'
                && cm.rolecall.startDate != null
                && typeof cm.rolecall.endDate.date != 'undefined') {
                cm.rolecall.endDate = moment(cm.rolecall.endDate.date);
            }
            if (typeof cm.rolecall.createdAt.date != 'undefined') {
                cm.rolecall.createdAt = moment(cm.rolecall.createdAt.date);
            }

        };
        cm.$onInit = function() {
            if(typeof rolecall == 'undefined') {
                if (typeof window.currentRolecall !== 'undefined') {
                    cm.rolecall = window.currentRolecall;
                } else {
                    cm.rolecall = {
                        isNew: true,
                        editing: true
                    }
                }
                cm.parseDates();
            }

            if (typeof cm.uploadConfig === 'undefined' && typeof window.uploadConfig !== 'undefined') {
                cm.uploadConfig = window.uploadConfig;
            }

            $('#rolecall-tabs').on('show.bs.tab', function (e) {
                cm.loadTabList(e.target.id);
            });

            //Init the interval to update the tabs counts
            $interval(function() {
                $scope.$broadcast('rolecallTalentsTotal_load');
            }, 10000);

        };

        cm.loadTabList = function(tabId) {
            switch(tabId) {
                case 'matchedTalentsTab':
                    $scope.$broadcast('matchedTalents_load');
                    break;
                case 'selectedTalentsTab':
                    $scope.$broadcast('selectedTalents_load');
                    break;
                case 'passedTalentsTab':
                    $scope.$broadcast('passedTalents_load');
                    break;
                case 'bookedTalentsTab':
                    $scope.$broadcast('bookedTalents_load');
                    break;
                case 'invitedTalentsTab':
                    $scope.$broadcast('invitedTalents_load');
                    break;
                case 'callbackTalentsTab':
                    $scope.$broadcast('callbackTalents_load');
                    break;
            }
        };

        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
        });

        cm.archiveRolecall = function(){
            cm.loading= true;
            $( '[data-toggle="tooltip"]' ).tooltip( "hide" );
            var request = {
                method : "PUT",
                url : '/api/rolecalls/'+ cm.rolecall.id,
                data : {
                    status: 'archived'
                }
            };

            $http(request).then(function (httpResponse) {
                var attrRequirementList = cm.rolecall.requirementSheet.attrRequirementList;
                angular.extend(cm.rolecall, httpResponse.data.results[0]);
                cm.parseDates();
                cm.rolecall.requirementSheet.attrRequirementList = attrRequirementList;
                cm.loadTabList($("ul#rolecall-tabs li.active > a")[0].id);
            }, function (httpResponse) {
                console.error(httpResponse);
                cm.roleCallFormErrors = httpResponse.data.errors;
            }).finally(function () {
                cm.loading= false;
            });
        };

        cm.restore = function(){
            cm.loading= true;
            $( '[data-toggle="tooltip"]' ).tooltip( "hide" );
            var request = {
                method : "PUT",
                url : '/api/rolecalls/'+ cm.rolecall.id,
                data : {
                    status: 'active'
                }
            };
            $http(request).then(function (httpResponse) {
                var attrRequirementList = cm.rolecall.requirementSheet.attrRequirementList;
                angular.extend(cm.rolecall, httpResponse.data.results[0]);
                cm.parseDates();
                cm.rolecall.requirementSheet.attrRequirementList = attrRequirementList;
                cm.loadTabList($("ul#rolecall-tabs li.active > a")[0].id);
            }, function (httpResponse) {
                console.error(httpResponse);
                cm.roleCallFormErrors = httpResponse.data.errors;
            }).finally(function () {
                cm.loading= false;
            });
        };
    }
});