roleCall.component('rolecallCard',{
    templateUrl: "/assets/components/rolecall/rolecallCard.template.html?v="+window.ASSETS_VERSION,
    bindings: {
        rolecall: '<'
    },
    controllerAs:'cm',
    controller : function ($scope, $http){
        var cm = this;

        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
        });

        cm.href = function () {
            location.href = "/rolecalls/" + cm.rolecall.id ;
        }
    }
});