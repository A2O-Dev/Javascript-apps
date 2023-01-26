roleCall.component('rolecallActiveList',{
    templateUrl: "/assets/components/rolecall/rolecallActiveList.template.html?v="+window.ASSETS_VERSION,
    bindings: {

    },
    controllerAs:'cm',
    controller : function (rolecallService){

        var cm = this;

        cm.rolecallActiveList = [];
        cm.loading = false;
        cm.$onInit = function() {
            cm.offset = 0;
            cm.limit = 12;
            cm.loadRoleCallActiveList(cm.offset, cm.limit);
        };

        cm.loadRoleCallActiveList = function(offset, limit){
            cm.offset = offset;
            cm.limit = limit;
            cm.loading = true;
            rolecallService.getAll('active', limit, offset).then(function (httpSuccess) {
                cm.rolecallActiveList = httpSuccess.data.results;
                cm.totalCount = httpSuccess.data.totalCount;
            }, function (httpError) {
                console.error(httpError);
            }).finally(function () {
                cm.loading = false;
            })
        };

    }
});