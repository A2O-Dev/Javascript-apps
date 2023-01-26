roleCall.component('latestRolecalls',{
    templateUrl: "/assets/components/rolecall/latestRolecalls.template.html?v="+window.ASSETS_VERSION,
    bindings: {

    },
    controllerAs:'cm',
    controller : function ($scope, $http){

        var cm = this;

        cm.latestRolecallList = [];
        cm.loading = true;

        cm.$onInit = function() {
            cm.loadLatestRoleCallList();
        };

        cm.loadLatestRoleCallList = function(){
            $http({
                method: "GET",
                url:'/api/rolecalls',
                params: {
                    'length':4,
                    'status': 'active',
                    'order[0][column]': 'updatedAt',
                    'order[0][dir]': 'desc'
                }
            }).then(function httpSuccess(response){
                cm.loading = false;
                cm.latestRolecallList = response.data.results;
                angular.forEach(cm.latestRolecallList, function (rolecall) {
                    if(rolecall.startDate !== null){
                        rolecall.startDate = moment(rolecall.startDate.date);
                    }
                    if(rolecall.endDate !== null){
                        rolecall.endDate = moment(rolecall.endDate.date);
                    }
                })

            }, function httpError(error){
                console.log(error);
            });
        };

    }
});