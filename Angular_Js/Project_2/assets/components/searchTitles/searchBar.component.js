alte.requires.push('vsGoogleAutocomplete', 'ngCookies');
alte.component('searchBar', {
    templateUrl: 'assets/components/searchTitles/searchBar.template.html?v='+ window.ASSETS_VERSION,
    bindings: {
        barStyle: '<'
    },
    controllerAs: 'cm',
    controller: function($scope, $cookies) {
        var cm = this;

        cm.location = {};

        cm.options = {
            componentRestrictions: {country: 'US'}
        };

        cm.$onInit = function() {
        };

        $scope.$on('searchBar_setLocation', function(e, location) {
            cm.setLocation(location);
        });

        cm.setLocation = function(location) {
            if(typeof location.latitude !== 'undefined' && typeof location.longitude !== 'undefined' &&
                typeof location.name !== 'undefined') {
                cm.location.name = location.name;
                cm.location.placeId = location.placeId;
                cm.location.streetNumber = location.streetNumber;
                cm.location.street = location.street;
                cm.location.city = location.city;
                cm.location.state = location.state;
                cm.location.countryCode = location.countryCode;
                cm.location.country = location.country;
                cm.location.postCode = location.postCode;
                cm.location.district = location. district;
                cm.location.latitude = location.latitude;
                cm.location.longitude = location.longitude;
            }
        };

        cm.search = function (location) {
            $cookies.putObject('location', location);
            window.location.href = 'search';
        };
    }
});