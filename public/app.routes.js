/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/content/home");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('content', {
            abstract: true,
            url: "/content",
            templateUrl: "shared/common/content.html",
        })
        .state('content.home', {
            url: "/home",
            templateUrl: "components/home/homeView.html",
            data: { pageTitle: 'NANO projects' }
        })
        .state('content.update', {
            url: "/update",
            templateUrl: "components/update/updateView.html",
            data: { pageTitle: 'Обновление данных проектов' }
        })
        .state('login', {
            url: "/login",
            templateUrl: "shared/auth/loginView.html",
            data: { pageTitle: 'Вход в систему', specialClass: 'gray-bg' }
        })
        .state('register', {
            url: "/register",
            templateUrl: "shared/auth/registerView.html",
            data: { pageTitle: 'Регистрация нового пользователя', specialClass: 'gray-bg' }
        })


}
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
