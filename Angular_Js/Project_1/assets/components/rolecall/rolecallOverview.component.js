roleCall.requires.push('ui.dateTimeInput' ,'ui.bootstrap.datetimepicker', 'ngclipboard');
roleCall.component('rolecallOverview',{
    templateUrl: "/assets/components/rolecall/rolecallOverview.template.html?v="+window.ASSETS_VERSION,
    bindings: {
        rolecall: '<',
        editing: '<',
        uploadConfig : '<'
    },
    controllerAs:'cm',
    controller : function ($scope, $http, $rootScope, authService, $location, utilService) {
        var cm = this;
        cm.tmpRolecall = {};
        cm.pageMessages = {};
        cm.editingRolecall = {};
        cm.authService = authService;
        cm.loading = true;
        cm.copiedToClipboard = false;

        cm.$onInit = function() {
            cm.loadAttributeReqList();
            cm.generateUrlPublic();
            cm.generatePreviewUrl();
            if (typeof cm.editing === true) {
                cm.showForm();
            }

            if (typeof cm.uploadConfig !== 'undefined') {
                cm.uploadConfig = cm.uploadConfig;
            }

            $("#publicUrl").on('focus', function() {
                $(this).select();
            });
        };

        cm.loadAttributeReqList = function() {
            $http({
                "method": "GET",
                "url": "/api/requirement-sheets/"+cm.rolecall.requirementSheet.id+"/attributes",
                params: {
                    'limit': 100
                }
            }).then(function(httpResponse) {
                cm.rolecall.requirementSheet.attrRequirementList = httpResponse.data.results;
            }, function(httpError) {
                console.error(httpError);
            }).finally(function () {
                cm.loading = false;
            });
        };

        cm.showForm = function() {
            cm.loading = true;
            cm.rolecall.editing = true;
            cm.editingRolecall = angular.copy(cm.rolecall);
            $scope.$broadcast('attributeRequirement_refresh');
        };

        $scope.$on('rolecallOverview_cancelLoading', function() {
            cm.loading = false;
        });

        cm.cancelForm = function() {
            cm.rolecall.editing = false;
        };

        cm.applyForm = function(savedRolecall) {
            angular.extend(cm.rolecall, savedRolecall);
            cm.rolecall.editing = false;
            $rootScope.$broadcast('rolecallTalentsTotal_load');
            cm.pageMessages.success = ["The rolecall info was saved successfully."];
        };

        cm.showImageViewer = function () {
            $scope.$broadcast('imageViewer_showForm');
        };

        cm.generateUrlPublic = function () {
            var codeBase64 = btoa(cm.rolecall.id);
            cm.urlPublic = $location.protocol() + "://" + location.host + "/rolecall-page/" + codeBase64;
        };

        cm.generatePreviewUrl = function () {
            var codeBase64 = btoa(cm.rolecall.id);
            cm.previewUrl = $location.protocol() + "://" + location.host + "/rolecall-preview/" + codeBase64;
        };

        cm.showShareRolecall = function() {
            cm.publicUrlCopied = false;
            cm.previewUrlCopied = false;
            $('#shareRolecallModal').modal('show');
        };

        cm.publicUrlCopySuccess = function(e) {
            cm.publicUrlCopied = true;
            cm.previewUrlCopied = false;
        };

        cm.previewUrlCopySuccess = function(e) {
            cm.publicUrlCopied = false;
            cm.previewUrlCopied = true;
        };

        cm.clipboardError = function(e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        }
    }
});