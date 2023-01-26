roleCall.component('rolecallCreate',{
    templateUrl: "/assets/components/rolecall/rolecallCreate.template.html?v="+window.ASSETS_VERSION,
    bindings: {
    },
    controllerAs:'cm',
    controller : function ($scope, $http, rolecallTypeService) {
        var cm = this;
        cm.castingDirectorList = [];
        cm.projectList = [];

        cm.pageMessages = {};
        cm.rolecallTypeList = [];

        cm.$onInit = function() {
        };

        cm.rolecallSaved = function (rolecall) {
            cm.pageMessages.success = ["Role call was created successfully. Redirecting..."];
            setTimeout(function() {
                location.replace('/rolecalls/'+ rolecall.id);
            }, 3000);
        };

        cm.rolecallCancelled = function() {
            window.history.back();
        };
    }
});