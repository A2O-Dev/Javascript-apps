roleCall.component('rolecallArchivedList',{
    templateUrl: "/assets/components/rolecall/rolecallArchivedList.template.html?v="+window.ASSETS_VERSION,
    bindings: {

    },
    controllerAs:'cm',
    controller : function (rolecallService){

        var cm = this;

        cm.rolecallArchivedList = [];
        cm.loading=false;
        cm.$onInit = function() {
            cm.offset = 0;
            cm.limit = 12;
            cm.loadRoleCallArchivedList(cm.offset, cm.limit);
        };

        cm.loadRoleCallArchivedList = function(offset, limit){
            cm.offset = offset;
            cm.limit = limit;
            cm.loading=true;
            rolecallService.getAll('archived', limit, offset).then(function (httpSuccess) {
                cm.rolecallArchivedList = httpSuccess.data.results;
                cm.totalCount = httpSuccess.data.totalCount;
            }).finally(function () {
                cm.loading=false;
            })
        };

    }
});