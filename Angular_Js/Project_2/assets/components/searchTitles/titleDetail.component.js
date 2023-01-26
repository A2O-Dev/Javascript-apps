alte.component('titleDetail', {
    templateUrl: 'assets/components/searchTitles/titleDetail.template.html?v=' + window.ASSETS_VERSION,
    bindings: {
        titleItem: '<',
        onBack: '&'
    },
    controllerAs: 'cm',
    controller: function ($scope, authService, shoppingCartService) {

        var cm = this;
        cm.authService = authService;
        cm.owner = authService.getUser();
        cm.loading = false;
        cm.errors = {};
        cm.pageMessages = {};
        cm.sale = {};
        cm.header = false;

        cm.$onInit = function () {
            cm.sale = window.sale;
        };

        cm.$onChanges = function () {
            if (typeof cm.titleItem != 'undefined') {
                if (cm.titleItem.source == 'Demo') {
                    message = ['If you need to change the information in this Title, you must be use the Demo App'];
                    cm.showMessage(message);
                }
            }
        };

        cm.addItemToCart = function () {
            cm.loading = true;
            shoppingCartService.addItemToCart(cm.titleItem).then(function (httpSuccess) {
                var shoppingCart = httpSuccess.data.results;
                cm.showMessage(['The title was successfully added to the cart.']);
            }, function (httpError) {
                cm.errors = httpError.data.errors;
                console.error(httpError)
            }).finally(function () {
                cm.loading = false;
            });
        };

        cm.showMessage = function (message) {
            cm.pageMessages.success = message;
        };

        cm.loadItemList = function () {
            cm.onBack({});
            $scope.$parent.$broadcast('pagination_loadPage');
            cm.errors = {};
            cm.pageMessages = {};
        };

        $scope.$on('titleDetail_show', function (e, titleItem) {
            cm.show(titleItem);
        });

        cm.showFormEdit = function () {

            if (cm.titleItem.source != 'gotitle') {
                cm.onBack({});
                $scope.$root.$broadcast('postedTitles_showForm', cm.titleItem);
            } else {
                message = ['If you need to change the information in this Title, you must be use the Demo App'];
                cm.showMessage(message);
            }
        };

        cm.deleteTitle = function () {
            $scope.$root.$broadcast('formTitle_delete', cm.titleItem);
        };

        cm.showMessage = function (message) {
            cm.pageMessages.success = message;
        };

        cm.snakeToCamel = function (str) {
            if (typeof str !== 'undefined' && str !== null)
                return str.replace(/[_]/g, ' ');
            return '';
        };

        $scope.$on('titleDetail_showMessage', function (e, message) {
            cm.showMessage(message);
        });

        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }
});