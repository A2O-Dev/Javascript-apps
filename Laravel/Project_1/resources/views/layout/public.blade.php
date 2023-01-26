<!DOCTYPE html>
<html lang="en" ng-app="roleCall">

<head>
    <title>{{ isset($page['title'])? $page['title']: config('app.name', 'RoleCall')." - A Creative Asset Discovery and Management System" }} </title>
    <meta name="description" content="{{ isset($page['description'])? $page['description'] : "Cast and find actors, crew, locations, props, vehicles, wardrobe, animals and stories for your next film or creative production. With RoleCall, studio system scale meets the indie world." }}">
    <meta property="og:image" content="{{ isset($page["imageUrl"])? $page["imageUrl"]: url('/assets/images/logo_rolecall_rich_link.png') }}"/>
    <meta property="og:title" content="{{ isset($page["title"])? $page['title']: config('app.name', 'RoleCall')." - A Creative Asset Discovery and Management System" }}" />
    <meta property="og:description" content="{{ isset($page['description'])? $page['description'] : "Cast and find actors, crew, locations, props, vehicles, wardrobe, animals and stories for your next film or creative production. With RoleCall, studio system scale meets the indie world." }}" />
    <meta property="og:url" content="{{ isset($page['url'])? $page['url']: url('/') }}">

    <!--  Non-Essential, But Recommended -->
    <meta content='summary' name='twitter:card'/>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="">
    <meta name="google-site-verification" content="{{ config('services.google.site_verification.id') }}" />
    {{--<base href="{{ url('').'/' }}">--}}

    <link rel="shortcut icon" href="{{ "/assets/images/favicon.ico?v=". config('view.assets.version') }}" type="/image/x-icon">
    <link rel="icon" href="{{ "/assets/images/favicon.ico?v=". config('view.assets.version') }}" type="/image/x-icon">

    <!-- Bootstrap Core CSS -->
    <link href="{{ '/vendor/bootstrap/css/bootstrap.min.css' }}" rel="stylesheet">

    <!-- Material AngularJs -->
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.12/angular-material.min.css">

    <!-- Custom Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Raleway:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
    <link rel="stylesheet" href="{{ "/assets/fonts/RoleCallIcons/style.css?v=". config('view.assets.version') }}">
    <link rel="stylesheet" href="{{ "/vendor/font-awesome-4.7.0/css/font-awesome.min.css" }}">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- angular Slider -->
    <link href="{{ '/vendor/angular-slider/rzslider.css' }}" type="text/css" rel="stylesheet">

    <!-- Theme CSS -->

    {{-- Vendor library css--}}

    <link href="{{ '/vendor/ui-select/select.css' }}" rel="stylesheet" type="text/css">
    <link href="{{ '/vendor/angular-bootstrap-datetimepicker/datetimepicker.css' }}" rel="stylesheet" type="text/css">
    <link href="{{ '/vendor/eonasdan-datetimepicker/build/css/bootstrap-datetimepicker.min.css' }}" rel="stylesheet" type="text/css">

    @yield('styles')

    <link href="{{ '/assets/css/style.css?v='.config('view.assets.version') }}" rel="stylesheet" type="text/css">
    <link href="{{ '/assets/css/style-public.css?v='.config('view.assets.version') }}" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="/css/general.css?v={{ config('view.assets.version') }}">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- jQuery -->
    <script src="{{ '/vendor/jquery/jquery.min.js' }}"></script>

    <!-- Angularjs -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.6/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.6/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.6/angular-aria.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.6/angular-messages.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.6/angular-sanitize.min.js"></script>

    <!-- Angular Material Library -->
    <script src="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.12/angular-material.min.js">

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ config("services.google.analytics.id") }}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '{{ config("services.google.analytics.id") }}');
    </script>
</head>

<body id="page-top">
{{--<div id="skipnav"><a href="#maincontent">Skip to main content</a></div>--}}
@if(!array_key_exists('print', $_GET))
    @include('layout.public_navigation')
@endif
<div class="main-content">
    @yield('content')
</div>

<video-player></video-player>


<!-- Bootstrap Core JavaScript -->
<script src="{{ '/vendor/bootstrap/js/bootstrap.min.js' }}"></script>

<script src="https://player.vimeo.com/api/player.js"></script>
<script src="https://www.youtube.com/iframe_api"></script>

<!-- Moment Js -->
<script type="text/javascript" src="{{ '/vendor/moment/moment.min.js' }}"></script>
<script type="text/javascript" src="{{ '/vendor/moment/moment-timezone-with-data-10-year-range.min.js' }}"></script>

<!-- Dark Sky -->
<script type="text/javascript" src="{{ '/vendor/darkSky/angular-dark-sky.js' }}"></script>

<!-- Dark Sky -->
<script type="text/javascript" src="{{ '/assets/js/wkhtmltopdf.js' }}"></script>

<script>
    var roleCall = angular.module('roleCall', [
        'ngMaterial', 'ngMessages',
        'dark-sky', 'ngSanitize', 'ui.select', 'vsGoogleAutocomplete',
        'ae-datetimepicker', 'rzModule', 'ngFileUpload', 'ngclipboard', 'chart.js'
    ]).config(['$locationProvider', 'darkSkyProvider','$mdThemingProvider', function($locationProvider, darkSkyProvider, $mdThemingProvider) {
        $locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });
        darkSkyProvider.setApiKey('ee1ba817ef54555c47b5d5515f1e97db');
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('indigo')
            .warnPalette('orange')
    }]);
    var authUser = {!! (\Auth::check()? json_encode(\Auth::user()->toArray(\App\Models\User::ARRAY_FULL)) : 'undefined') !!};
    var ASSETS_VERSION = '{!! config('view.assets.version') !!}';
    $(document).ready(function() {
        var height = ((window.innerHeight > 0) ? window.innerHeight : screen.height) - 1;
        height = height;
        $(".main-content").css('min-height', (height) + "px");
        $(".section-signup").css('min-height', (height) + "px");
    });

</script>

{{-- Chart Js --}}
<script type="text/javascript" src="{{ '/vendor/chartjs/Chart.min.js?v='. config('view.assets.version') }}"></script>
<script type="text/javascript" src="{{ '/vendor/angular-chartjs/angular-chart.js?v='. config('view.assets.version') }}"></script>
{{-- Ui Select --}}
<script type="text/javascript" src="{{ '/vendor/ui-select/select.js' }}"></script>

<script type="text/javascript" src="{{ '/vendor/angular-slider/rzslider.min.js' }}"></script>

{{-- Upload file --}}
<script type="text/javascript" src="{{ '/vendor/ng-file-upload/ng-file-upload-shim.min.js' }}"></script>
<script type="text/javascript" src="{{ '/vendor/ng-file-upload/ng-file-upload.min.js' }}"></script>
{{-- datetimepicker template --}}
<script type="text/javascript" src="{{ '/vendor/angular-bootstrap-datetimepicker/datetimepicker.js' }}"></script>
<script type="text/javascript" src="{{ '/vendor/angular-bootstrap-datetimepicker/datetimepicker.templates.js' }}"></script>
{{-- vsGoogleAutocomplete --}}
<script type="text/javascript" src="{{ '/vendor/vsGoogleAutocomplete-0.5.0/dist/vs-google-autocomplete.min.js' }}"></script>
<script type="text/javascript" src="{{ '/vendor/vsGoogleAutocomplete-0.5.0/dist/vs-autocomplete-validator.min.js' }}"></script>
{{-- ngclipboard --}}
<script src="https://cdn.rawgit.com/zenorocha/clipboard.js/master/dist/clipboard.min.js"></script>
<script type="text/javascript" src="{{ '/vendor/ngclipboard/dist/ngclipboard.min.js' }}"></script>
{{-- dateTimeInput --}}
<script type="text/javascript" src="{{ '/vendor/angular-date-time-input-1.2.1/src/dateTimeInput.js' }}"></script>
{{-- eonasdan-datetimepicker --}}
<script type="text/javascript" src="{{ '/vendor/eonasdan-datetimepicker/build/js/bootstrap-datetimepicker.min.js' }}"></script>
<script type="text/javascript" src="{{ '/vendor/angular-eonasdan-datetimepicker/dist/angular-eonasdan-datetimepicker.js' }}"></script>

@yield('scripts')

<script type="text/javascript" src="/js/app.js?v={{ config('view.assets.version') }}"></script>

</body>

</html>
