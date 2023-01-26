roleCall.requires.push('ui.select','ngSanitize', 'ui.dateTimeInput' ,'ui.bootstrap.datetimepicker', 'vsGoogleAutocomplete');
roleCall.component('rolecallForm',{
    templateUrl: "/assets/components/rolecall/rolecallForm.template.html?v="+window.ASSETS_VERSION,
    bindings: {
        rolecall: '<',
        onSaved: '&',
        onCancelled: '&',
        uploadConfig: '<',
        castingDirector: '<'
    },
    controllerAs:'cm',
    controller : function ($rootScope, $scope, $http, rolecallTypeService, rolecallService, projectService, utilService, rolecallAttributeValueService, $timeout) {
        var cm = this;
        cm.pageMessages = {};
        cm.form = {};
        cm.loading = false;
        cm.projectList = [];
        cm.form.processing=false;

        cm.timePickerOptions = {
            format: "LL",
            stepping: 15,
            allowInputToggle: true,
            ignoreReadonly: true,
            showClose: true,
            icons : {
                close : 'fa fa-check'
            }
        };


        cm.age = {
            enabled: true,
            slider: {
                floor: 0,
                ceil: 100,
                step: 1,
                disabled: false,
                hideLimitLabels: true
            },
            value: {
                'minValue': 0,
                'maxValue': 100
            }
        };

        cm.searchRadiusList = [
            {
                name: '5 miles',
                value: 5
            }, {
                name: '10 miles',
                value: 10
            }, {
                name: '25 miles',
                value: 25
            }, {
                name: '50 miles',
                value: 50
            }, {
                name: '100 miles',
                value: 100
            }, {
                name: '200 miles',
                value: 200
            },{
                name: '500 miles',
                value: 500
            },{
                name:'1000 miles',
                value: 1000
            }
        ];

        cm.paymentTypeList = [
            {
                value : 'paid',
                name : 'Paid'
            },{
                value : 'unpaid',
                name : 'Unpaid'
            }
        ];
        cm.genderList = [
            {
                value: 'male',
                name: 'Male'
            },
            {
                value: 'female',
                name: 'Female'
            }
        ];

        cm.tmpRolecall = {
            requiredTalentsCount: 1,
            requirementSheet: {
                title: 'Role Requirements',
                category: {
                    code: 'person'
                }
            },
            searchRadius: cm.searchRadiusList[0].value,
            project: {}
        };

        cm.$onInit = function() {
            cm.loadProjects();
            cm.loadTypes();
            cm.loadUnionTypes();
            if (typeof cm.rolecall === 'undefined' && typeof window.rolecall !== 'undefined') {
                cm.rolecall = window.rolecall;
            }

            if (typeof cm.uploadConfig !== 'undefined') {
                cm.uploadConfig = cm.uploadConfig;
            }
        };

        cm.$onChanges = function() {
            if (typeof cm.rolecall !== 'undefined') {
                cm.tmpRolecall = angular.copy(cm.rolecall);

                if (!(typeof cm.tmpRolecall.roleAge == 'undefined' || cm.tmpRolecall.roleAge == null)) {
                    cm.age.value.minValue = cm.tmpRolecall.roleAge.minValue;
                    cm.age.value.maxValue = cm.tmpRolecall.roleAge.maxValue;
                }
            }
        };

        cm.$doCheck = function() { };

        cm.loadTypes = function () {
            rolecallTypeService.getAll({
                limit: 200
            }).then(function (httpSuccess) {
                cm.rolecallTypeList = httpSuccess.data.results;
                if (typeof cm.tmpRolecall.type == 'undefined') {
                    cm.tmpRolecall.type = cm.rolecallTypeList[0];
                }
            }, function(httpError) {
                console.error(httpError);
            });
        };

        cm.loadProjects = function() {
            projectService.getAll(null, null, 200, 0).then(function (httpSuccess) {
                cm.projectList = httpSuccess.data.results;
            }, function(httpError) {

            });
        };

        cm.loadUnionTypes = function(){
            cm.form.processing=false;
            rolecallAttributeValueService.getAll({'union_type': 'union'}).then(function (httpSuccess){
                cm.unionTypeList = httpSuccess.data.results;
            }, function(httpError) {
                console.error(httpError);
            });
        };

        cm.applyForm = function() {
            cm.form.errors = {};
            var response = null;
            if (!cm.form.$submitted) {
                cm.form.$setSubmitted();
            }

            if (typeof cm.tmpRolecall.id != 'undefined'
                && cm.tmpRolecall.location != null
                && cm.rolecall.location != null
                && cm.tmpRolecall.location.name == cm.rolecall.location.name) {
                cm.form.location.$setValidity('vsAutocompleteValidator', true);
            }

            if (cm.form.$valid) {
                cm.loading = true;
                cm.form.processing = true;
                if (typeof cm.tmpRolecall.type != 'undefined') {
                    cm.tmpRolecall.rolecallTypeId = cm.tmpRolecall.type.id;
                }

                if (cm.age.enabled === true) {
                    cm.tmpRolecall.roleAge = cm.age.value;
                } else {
                    cm.tmpRolecall.roleAge = null;
                }

                $scope.$broadcast('requirementSheetForm_applyForm');

                if (typeof cm.tmpRolecall.id == 'undefined') {
                    response = rolecallService.create(cm.tmpRolecall);
                } else {
                    response = rolecallService.update(cm.tmpRolecall);
                }

                response.then(function (httpResponse) {
                    cm.form.processing = false;
                    if (typeof cm.rolecall == 'undefined') {
                        cm.rolecall = {};
                    }
                    angular.extend(cm.tmpRolecall, httpResponse.data.results[0]);
                    if (cm.tmpRolecall.startDate != null) {
                        cm.tmpRolecall.startDate = moment(cm.tmpRolecall.startDate.date);
                    }

                    if (cm.tmpRolecall.endDate != null) {
                        cm.tmpRolecall.endDate = moment(cm.tmpRolecall.endDate.date);
                    }

                    if (cm.tmpRolecall.createdAt != null) {
                        cm.tmpRolecall.createdAt = moment(cm.tmpRolecall.createdAt.date);
                    }

                    $http({
                        "method": "GET",
                        "url": "/api/requirement-sheets/"+cm.tmpRolecall.requirementSheet.id+"/attributes"
                    }).then(function(httpResponse) {
                        cm.tmpRolecall.requirementSheet.attrRequirementList = httpResponse.data.results;
                        angular.extend(cm.rolecall, cm.tmpRolecall);

                        cm.onSaved({
                            rolecall: cm.rolecall
                        });
                    }, function(httpError) {
                        console.error(httpError);
                    }).finally( function () {
                        cm.loading = false;
                    });
                }, function (httpResponse) {
                    cm.form.processing = false;
                    console.error(httpResponse);
                    cm.form.errors = httpResponse.data.errors;
                    cm.loading = false;
                })
            }
        };

        cm.cancelForm = function() {
            $scope.$broadcast('imageUpload');
            cm.onCancelled();

        };

        cm.imageChanged = function (image) {
            cm.tmpRolecall.image = image;
        };

        cm.showProjectFormModal = function(project) {
            cm.form.processing=true;
            if (typeof project == 'undefined') {
                project = {};
            }
            $scope.$broadcast("projectFormModal_show", project);
            cm.form.processing=false;
        };

        cm.projectFormModalSaved = function(project) {
            cm.form.processing=false;
            var projectIndex = utilService.findItemPos(project, cm.projectList);
            if (projectIndex == -1) {
                cm.projectList.push(project);
            }
            cm.tmpRolecall.project = project;
        }
    }
});