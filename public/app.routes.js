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
            onEnter: ['$state', 'auth', function($state, auth) {
              if (!auth.isLoggedIn()) {
                $state.go('login');
              }
            }],
        })
        .state('content.home', {
            url: "/home",
            templateUrl: "components/vis/index.html",
            data: { pageTitle: 'NANO projects' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: [
                            'assets/js/d3/d3.min.js',
                            'components/vis/js/App.js',
                            'components/vis/js/Binding.js',
                            'components/vis/css/project-style.css'
                            ]
                        }
                    ]);
                }
            }
        })

        .state('content.update', {
            url: "/update",
            templateUrl: "components/update/updateView.html",
            data: { pageTitle: 'Обновление данных проектов' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: [
                            'assets/css/plugins/dropzone/basic.css',
                            'assets/css/plugins/dropzone/dropzone.css',
                            'assets/js/plugins/dropzone/dropzone.js',

                            'assets/css/plugins/datapicker/angular-datapicker.css',
                            'assets/js/plugins/datapicker/angular-datepicker.js'
                            ]
                        }
                    ]);
                }
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: "shared/auth/loginView.html",
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth', function($state, auth) {
              if (auth.isLoggedIn()) {
                $state.go('content.home');
              }
            }],
            data: { pageTitle: 'Вход в систему', specialClass: 'gray-bg' }
        })
        .state('register', {
            url: "/register",
            templateUrl: "shared/auth/registerView.html",
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth', function($state, auth) {
              if (auth.isLoggedIn()) {
                $state.go('content.home');
              }
            }],
            data: { pageTitle: 'Регистрация', specialClass: 'gray-bg' }
        })


}
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
