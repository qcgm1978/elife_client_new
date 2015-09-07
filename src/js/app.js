var elife = angular.module('elife', [
    'ngRoute',
    'ngCookies',
    'ngTouch',
    'mobile-angular-ui',
    'mobile-angular-ui.core.fastclick',
    //'at.multirange-slider',
    'ui.slider',
    'angular-carousel',
    'mobile-angular-ui.core.outerClick',
    'mobileInfiniteScroll',
    'angularLazyImg',
])
    .factory('_serarchCity', ['$http', '$timeout', '$cookieStore', '$rootScope', function ($http, $timeout, $cookieStore, $rootScope) {
        console.log('cached');
        return $http({
            method: 'post',
            url: $rootScope.baseUrl + '/OFSTCUST/area/search.action',
            data: {
                't_k': $cookieStore.get('t_k'),
                'c_no': $cookieStore.get('c_no'),
                'country_code': 'CN',
                'keyword': ''
            },
            cache: true
        });
    }])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|http|ftp|mailto|javascript|tel):/);
    }])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home/index', {
            templateUrl: 'views/home/index.html',
            controller: 'IndexCtrl',
            reloadOnSearch: true,
            resolve: {
                delay: function ($q) {
                    var delay = $q.defer();
                    dataIn("send", "pageview");
                    return null;
                }
            }
        })
            .when('/home/search', {
                templateUrl: 'views/home/search.html',
                controller: 'IndexSearchCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/search', {
                templateUrl: 'views/discount/search.html',
                controller: 'IndexSearchCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/search_result/', {
                templateUrl: 'views/discount/offer_search_result.html',
                controller: 'OfferSearchResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/gpp_search_result/', {
                templateUrl: 'views/discount/gpp_offer_search_result.html',
                controller: 'GppOfferSearchResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/search_result/:id/:keyword/:searchType', {
                templateUrl: 'views/discount/offer_search_result.html',
                controller: 'OfferSearchResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/category/:smallCode', {
                templateUrl: 'views/discount/offer_search_result.html',
                controller: 'OfferSearchResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            // .when('/discount/category/:largeCode/:largeName/:smallCode/:smallName', {
            //     templateUrl: 'views/discount/offer_search_result.html',
            //     controller: 'OfferSearchResultCtrl'
            // })
            .when('/home/search_result/:id/:keyword', {
                templateUrl: 'views/home/business_search_result.html',
                controller: 'BusinessSearchResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/home/search_result/:id/:keyword/:smallCode', {
                templateUrl: 'views/home/business_search_result.html',
                controller: 'BusinessSearchResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/home/search_result/:id/:keyword/', {
                templateUrl: 'views/home/business_search_result.html',
                controller: 'BusinessSearchResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/home/search_no_result', {
                templateUrl: 'views/home/business_no_result.html',
                controller: 'BusinessSearchResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/index', {
                templateUrl: elife.isElifeAndroid ? 'views/discount/index_android.html' : 'views/discount/index_normal.html',
                controller: 'IndexDiscountCtrl'
            })
            .when('/discount/nearby_offer', {
                templateUrl: 'views/discount/nearby_offer_list.html',
                controller: 'NearbyOfferListCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/locator/:no', {
                templateUrl: 'views/home/locator.html',
                controller: 'LocatorCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/choose_locator', {
                templateUrl: 'views/home/choose_locator.html',
                controller: 'LocatorCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/business/index/:id', {
                templateUrl: 'views/home/business_info.html',
                controller: 'BusinessInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/business/recommend', {
                templateUrl: 'views/home/business_recommend.html',
                controller: 'businessRecommendCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/business/special_offer', {
                templateUrl: 'views/home/special_offer.html',
                controller: 'specialOfferCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/card_offer/:id/:bank', {
                templateUrl: 'views/discount/card_offer_info.html',
                controller: 'DiscountInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/bank_offer/:id', {
                templateUrl: 'views/discount/bank_offer_info.html',
                controller: 'DiscountInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/card_list', {
                templateUrl: 'views/discount/card_offer_list.html',
                controller: 'CardOfferListCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/business_offer/:id/:code/:stid', {
                templateUrl: 'views/discount/business_offer_info.html',
                controller: 'DiscountInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/business/other_store/:id', {
                templateUrl: 'views/home/other_store.html',
                controller: 'OtherStoreInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/business/business_available_store/:ptf_code/:type', {
                templateUrl: 'views/home/business_available_store.html',
                controller: 'DiscountStoreListCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/business/bank_available_store/:ptf_code/:type', {
                templateUrl: 'views/home/bank_available_store.html',
                controller: 'DiscountStoreListCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/business/store_available_store/:ptf_code/:type', {
                templateUrl: 'views/home/store_available_store.html',
                controller: 'DiscountStoreListCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/business_district', {
                templateUrl: 'views/home/business_district.html',
                controller: 'BusinessDistrictInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/error/other/:id', {
                templateUrl: 'views/error/other_error.html',
                controller: 'ErrorCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/review/album', {
                templateUrl: 'views/home/review_album.html',
                controller: 'ReviewCommentAlbumCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/review/album_noup', {
                templateUrl: 'views/home/review_album_noupload.html',
                controller: 'ReviewAlbumCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/business/album/:id', {
                templateUrl: 'views/home/business_album.html',
                controller: 'ReviewAlbumCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/error/business/:id', {
                templateUrl: 'views/error/business_error.html',
                controller: 'ErrorCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/error/district/:id', {
                templateUrl: 'views/error/district_error.html',
                controller: 'ErrorCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/business/detail/:id', {
                templateUrl: 'views/home/business_detail.html',
                controller: 'BusinessDetailCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/review/index/:id/:type', {
                templateUrl: 'views/home/review_index.html',
                controller: 'ReviewIndexCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/review/photo_added/:store_id/:ablum_id', {
                templateUrl: 'views/home/review_photo_added.html',
                controller: 'PhotoAddedCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/review/photo_added/:store_id', {
                templateUrl: 'views/home/review_photo_added.html',
                controller: 'PhotoAddedCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/review/photo_edit/:store_id', {
                templateUrl: 'views/home/review_photo_edit.html',
                controller: 'PhotoEditCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/review/comment/:id/:type', {
                templateUrl: 'views/home/review_comment.html',
                controller: 'ReviewCommentCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/review/comment_personal/:id/:type', {
                templateUrl: 'views/home/review_comment_personal.html',
                controller: 'ReviewCommentCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/comment/:id/:stid', {
                templateUrl: 'views/home/review_comment.html',
                controller: 'DiscountCommentCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/comment/:id/:stid/:store_id/:large_flag', {
                templateUrl: 'views/home/review_comment.html',
                controller: 'DiscountCommentCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/home/yidai_business/:name', {
                templateUrl: 'views/home/yidai_business.html',
                controller: 'YidaiBusinessCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/home/shanku_business/:name', {
                templateUrl: 'views/home/shanku_business.html',
                controller: 'ShankuBusinessCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/home/category/:id/:name', {
                templateUrl: 'views/home/food.html',
                controller: 'CategoryResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/home/category/:id/:name/:isSecondType', {
                templateUrl: 'views/home/food.html',
                controller: 'CategoryResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/home/food', {
                templateUrl: 'views/home/food_selected.html',
                controller: 'CategoryResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/discount_food/:type/:code', {
                templateUrl: 'views/discount/discount_food.html',
                controller: 'OfferSearchResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/discount_food', {
                templateUrl: 'views/discount/discount_food.html',
                controller: 'OfferSearchResultCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/home/categories', {
                templateUrl: 'views/home/categories.html',
                controller: 'HomeCategoriesCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/home/guess_u_like_list', {
                templateUrl: 'views/home/guess_u_like_list.html',
                controller: 'GuessULikeListCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/categories', {
                templateUrl: 'views/discount/discount_categories.html',
                controller: 'HomeCategoriesCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            // .when('/discount/category/:id/:largeName', {
            //     templateUrl: 'views/discount/discount_category.html',
            //     controller: 'DiscountCategoryCtrl'
            // })
            .when('/discount/customers/:storeCode/:code', {
                templateUrl: 'views/discount/customers_info.html',
                controller: 'CustomersInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/customers_more/:storeCode/:gppCode', {
                templateUrl: 'views/discount/customers_more_info.html',
                controller: 'CustomersMoreCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/customers_add_order/:storeCode/:code/:price', {
                templateUrl: 'views/discount/customers_add_order.html',
                controller: 'CustomersAddOrderCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/discount/customers_succeeded', {
                templateUrl: 'views/discount/customers_succeeded.html',
                controller: 'CustomersInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/district_list', {
                templateUrl: 'views/error/district_list.html',
                controller: 'DistrictListCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/test', {
                templateUrl: 'views/home/test.html',
                controller: 'TestCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/index', {
                templateUrl: 'views/personal/personal.html',
                controller: 'PersonalCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/my_favorites', {
                templateUrl: 'views/personal/my_favorites.html',
                controller: 'MyFavoritesCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            // .when('/personal/my_customers',{
            //   templateUrl:'views/personal/my_customers.html',
            //   controller:'MyCustomersCtrl'
            // })
            .when('/personal/send_customers', {
                templateUrl: 'views/personal/send_customers.html',
                controller: 'MyCustomersCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/my_comment', {
                templateUrl: 'views/personal/my_comment.html',
                controller: 'MyCommentCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/my_comment/:id/:a/:b/:c', {
                templateUrl: 'views/personal/my_comment_detail.html',
                controller: 'MyCommentDetailCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/customers_drawback', {
                templateUrl: 'views/personal/customers_drawback.html',
                controller: 'MyCustomersCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/customers_drawback_info', {
                templateUrl: 'views/personal/customers_drawback_info.html',
                controller: 'MyCustomersCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/my_customers_info/:gppActId/:gppCode/:gppStatus', {
                templateUrl: 'views/personal/my_customers_info.html',
                controller: 'MyCustomersCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/my_customers_info_drawback', {
                templateUrl: 'views/personal/my_customers_info_drawback.html',
                controller: 'MyCustomersCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/my_customers_info_unpaid', {
                templateUrl: 'views/personal/my_customers_info_unpaid.html',
                controller: 'MyCustomersCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/pay_e_coupon/:store_code', {
                templateUrl: 'views/personal/pay_e_coupon.html',
                controller: 'PayECouponCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/e_coupon', {
                templateUrl: 'views/personal/e_coupon.html',
                controller: 'ECouponCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/e_coupon_intro', {
                templateUrl: 'views/personal/e_coupon_intro.html',
                controller: 'ECouponCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/e_coupon_blank', {
                templateUrl: 'views/personal/e_coupon_blank.html',
                controller: 'ECouponCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/e_coupon_business_list/:code', {
                templateUrl: 'views/personal/e_coupon_business_list.html',
                controller: 'ECouponCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/e_coupon_business_blank', {
                templateUrl: 'views/personal/e_coupon_business_blank.html',
                controller: 'ECouponCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            //个人信息
            .when('/personal/personal_info', {
                templateUrl: 'views/personal/personal_info.html',
                controller: 'PersonalInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/personal_change_nickname', {
                templateUrl: 'views/personal/personal_change_nickname.html',
                controller: 'PersonalInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/personal_change_tel', {
                templateUrl: 'views/personal/personal_change_tel.html',
                controller: 'PersonalInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/personal_change_tel2', {
                templateUrl: 'views/personal/personal_change_tel2.html',
                controller: 'PersonalInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/personal_change_passwd', {
                templateUrl: 'views/personal/personal_change_passwd.html',
                controller: 'PersonalInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            //我的交易明细 已移除
            // 更多模块
            .when('/more/index', {
                templateUrl: 'views/more/index.html',
                controller: 'MoreIndexCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/more/feedback', {
                templateUrl: 'views/more/feedback.html',
                controller: 'PersonalCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/more/help', {
                templateUrl: 'views/more/help.html',
                controller: 'PersonalCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/error/district_list', {
                templateUrl: 'views/error/district_list.html',
                controller: 'DistrictListCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            //测试
            .when('/error/district_list/:id/:name/:address/:tel', {
                templateUrl: 'views/error/district_list.html',
                controller: 'DistrictListCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/error/categories', {
                templateUrl: 'views/error/categories.html',
                controller: 'HomeCategoriesCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/orders', {
                templateUrl: 'views/personal/orders.html',
                controller: 'PersonalOrdersCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/my_customers', {
                templateUrl: 'views/personal/my_customers.html',
                controller: 'GppOrderCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/app_orders', {
                templateUrl: 'views/personal/app_orders.html',
                controller: 'AppOrderCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/ewm_orders', {
                templateUrl: 'views/personal/ewm_orders.html',
                controller: 'ewmOrderCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/pay_orders/:entry/:store_id/:order_id/:tran_way', {
                templateUrl: 'views/personal/pay_orders.html',
                controller: 'PayOrderCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/pay_orders/:entry/:store_id/:order_id/:order_amt/:tran_way', {
                templateUrl: 'views/personal/pay_orders.html',
                controller: 'PayOrderCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/pay_orders/:store_id/:order_id/:money', {
                templateUrl: 'views/personal/pay_orders.html',
                controller: 'PayOrderCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            // 支付确认页面
            .when('/personal/pay_confirm/', {
                templateUrl: 'views/personal/pay_confirm.html',
                controller: 'PayConfirmCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            //直接显示金额
            // .when('/personal/pay_orders_info/:store_id/:order_id', {
            //     templateUrl: 'views/personal/pay_orders_info.html',
            //     controller: 'PayOrderCtrl'
            // })
            //二维码已支付详情
            .when('/personal/order_detail/:store_id/:order_id', {
                templateUrl: 'views/personal/order_detail.html',
                controller: 'OrderDetailCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/home/jifen_business/:name', {
                templateUrl: 'views/home/jifen_business.html',
                controller: 'JifenBusinessCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/ticket/:ticket', {
                templateUrl: 'views/auth/index.html',
                controller: 'TicketLoginCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/navigation/location/:destination/:destStoreName/:destLongitude/:destLatitude', {
                templateUrl: 'views/navigation/navigation_location.html',
                controller: 'NavigationLocationCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/navigation/route/:origin/:destination/:destStoreName/:destLongitude/:destLatitude', {
                templateUrl: 'views/navigation/navigation_route.html',
                controller: 'NavigationRouteCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            //天天抽奖
            // .when('/draw/check_draw',{
            //   templateUrl:'views/draw/check_draw.html',
            //   controller:'CheckDrawCtrl'
            // })
            // .when('/draw/win_draw',{
            //   templateUrl:'views/draw/win_draw.html',
            //   controller:'WinDrawCtrl'
            // })
            // .when('/draw/want_draw',{
            //   templateUrl:'views/draw/want_draw.html',
            //   controller:'WantDrawCtrl'
            // })
            // .when('/draw/already_draw',{
            //   templateUrl:'views/draw/already_draw.html',
            //   controller:'AlreadyDrawCtrl'
            // })
            .when('/draw/drawinfo/:id', {
                templateUrl: 'views/draw/draw_info.html',
                controller: 'DrawInfoCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/draw/winnerlist/:id', {
                templateUrl: 'views/draw/list_draw.html',
                controller: 'ListDrawCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/draw/mydraw', {
                templateUrl: 'views/draw/my_draw.html',
                controller: 'MyDrawCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/draw/drawlist', {
                templateUrl: 'views/draw/everyday_draw.html',
                controller: 'EverydayDrawCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            //优惠券
            .when('/coupon/couponDetail', {
                templateUrl: 'views/coupon/coupon_detail.html',
                controller: 'CouponDetailCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/coupon/myCoupon', {
                templateUrl: 'views/coupon/my_coupon.html',
                controller: 'MyCouponCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/subscribe/onlineBook', {
                templateUrl: 'views/subscribe/online_book.html',
                controller: 'OnlineBookCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/subscribe/orderSub', {
                templateUrl: 'views/subscribe/order_sub.html',
                // controller: 'OrderSubCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/subscribe/orderDetail', {
                templateUrl: 'views/subscribe/order_detail.html',
                // controller: 'OrderDetailCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/subscribe/numProving', {
                templateUrl: 'views/subscribe/num_proving.html',
                // controller: 'NumProvingCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            // e生活客户端扫一扫功能fix、融e联首页的扫一扫
            .when('/scan', {
                templateUrl: 'views/fix/scan_fix.html',
                controller: 'ScanFixCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/scan_login', {
                templateUrl: 'views/fix/scan_login.html',
                controller: 'ScanLoginCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            // 扫一扫的第二个入口（非首页的扫一扫，是融e联的扫一扫）
            .when('/scan/:encryptStr', {
                templateUrl: 'views/fix/scan_fix.html',
                controller: 'ScanFixCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/reload', {
                templateUrl: 'views/fix/reload_fix.html',
                controller: 'ReloadFixCtrl',
                resolve: {
                    delay: function ($q) {
                        var delay = $q.defer();
                        dataIn("send", "pageview");
                        return null;
                    }
                }
            })
            .when('/personal/credit', {
                templateUrl: 'views/personal/my_integral.html',
                controller: 'PersonalCreditCtrl',
                //resolve: {
                //    delay: function ($q) {
                //        var delay = $q.defer();
                //        dataIn("send", "pageview");
                //        return null;
                //    }
                //}
            });
    }])
    /* ||2015.5.4|| */
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.transformRequest = [function (data) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function (obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;
                for (name in obj) {
                    value = obj[name];
                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }
                return query.length ? query.substr(0, query.length - 1) : query;
            };
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    }])
//2015-07-02 lazy load config
    .config(['lazyImgConfigProvider', function (lazyImgConfigProvider) {
        scrollable = document.querySelector('#scrollable');
        lazyImgConfigProvider.setOptions({
            offset: 100, // how early you want to load image (default = 100)
            errorClass: 'error', // in case of loading image failure what class should be added (default = null)
            successClass: 'success', // in case of loading image success what class should be added (default = null)
            onError: function (image) {
            }, // function fired on loading error
            onSuccess: function (image) {
            }, // function fired on loading success
            container: angular.element(scrollable) // if scrollable container is not $window then provide it here
        });
    }])
    /* ||2015.5.4|| */
    .controller('MainController', ['$rootScope', '$cookieStore', '$scope', '$timeout', 'API', function ($rootScope, $cookieStore, $scope, $timeout, API) {
        // 全局变量存储
        // $rootScope.imgBaseUrl = "http://115.28.109.25/elife/dist";
        $rootScope.storeNameLimit = 4;
        // Needed for the loading screen
        $rootScope.$on('$routeChangeStart', function (evt, next, current) {
            $rootScope.loading = true;
            if (!next) {
                return;
            }
            if (/index\.html$/.test(next.templateUrl) || /views\/home\/categories\.html/.test(next.templateUrl) || /business_district/.test(next.templateUrl) || /views\/discount\/index_android\.html/.test(next.templateUrl) || /views\/discount\/index_normal\.html/.test(next.templateUrl)) {
                $rootScope.removeAllCookies();
            }
        });
        // 五月版暂时不上的功能 请使用 ng-hide="hidden"
        $rootScope.hidden = true;
        // 首先获取地理位置
        // 如果获取不到经纬度和城市名称将无法进行下一步
        // if (!$cookieStore.get('lat') || !$cookieStore.get('lng') || $cookieStore.get('city_name')) {
        //     // TODO 获取经纬度，跳转到城市选择页面
        //     location.hash = '/locator';
        // } else {
        //     $rootScope.cityName = $cookieStore.get('city_name');
        // }
        global = {};
        // obs._on('getCityCodeSuccess',function() {
        //     $rootScope.location = 
        // });
        obs._on('networkInfoCallback', function () {
            $timeout(function () {
                $rootScope.hasWifi = elife_app.networkInfo.user_select + elife_app.networkInfo.is_wifi;
            }, 0);
        });
        // obs._on('loginSuccess', function () {
        //     $timeout(function () {
        //         $rootScope.token = elife_app.token;
        //     }, 0);
        // });
        // obs._on('loginFailed', function () {
        //     $timeout(function () {
        //         $rootScope.token = undefined;
        //     }, 0);
        // });
        // if ($cookieStore.get('t_k')) {
        $timeout(function () {
            if (ICBCUtil.isElifeAndroid()) {
                elife_app.GetNativeFunctionAndroid({'keyword': 'getToken', 'showLoginFlag': '0'});
            } else if (ICBCUtil.isElifeIos()) {
                ICBCUtil.nativeGetConfig({
                    'key': 'getToken',
                    'dataString': 'close',
                    'callBack': "GetTokenCallbackIos"
                });
            }
        }, 0);
        // } else {
        // $rootScope.token = undefined;
        // }
        // 获取渠道号码
        var channelNo = ICBCUtil.getIMChannel();
        $cookieStore.put('c_no', channelNo);

        // $cookieStore.put('c_no', '314'); 
        // $cookieStore.put('t_k', 'd5f786a06c394988abf2a2ad7f899082');
        //for dev
        // // 如果是非首次登陆，则每次加载都先从app获取token
        // 临时写入，以便调试使用
        if (!$cookieStore.get('city_code')) {
            console.log("已写入city_code");
            $cookieStore.put('city_code', '110100');
            console.log("cookie值为" + $cookieStore.get('city_code'));
        }
        else {
            console.log("已存在city_code");
            console.log("cookie:" + $cookieStore.get('city_code'));
        }
        // 获取城市编码city_code
        $timeout(function () {
            if (ICBCUtil.isElifeAndroid()) {
                elife_app.GetNativeFunctionAndroid({'keyword': 'getCityCode'});
            } else if (ICBCUtil.isElifeIos()) {
                ICBCUtil.nativeGetConfig({
                    'key': 'getCityCode',
                    'callBack': "GetCityCodeCallbackIos"
                });
            }
        }, 0);
        if (ICBCUtil.isIPhone()) {
            ICBCUtil.nativeGetConfig({
                key: 'saveIdent',
                dataString: $cookieStore.get('t_k')
            });
        } else if (ICBCUtil.isAndroid()) {
            // 安卓尚未调试 hybridapp.js 还没写完
            // elife_app.GetNativeFunctionAndroid({"keyword":$cookieStore.get('t_k'),"c_no":"312"});
        }
        // 比较城市代码
        $rootScope.$on('$routeChangeSuccess', function (evt, current, previous) {
            //console.log(previous);
            // 我的交易明细返回标志
            if (!previous && (ICBCUtil.isAndroid() || ICBCUtil.isIPhone())) {
                $cookieStore.put('noPrevPage', '1');
            }
            $rootScope.token = $cookieStore.get('t_k');
            // 每次路由改变都要判断wifi
            $timeout(function () {
                if (ICBCUtil.isElifeAndroid()) {
                    //获取网络情况 共两位 第一位为是否选择“仅wifi显示图片” 第二位为是否处于wifi环境
                    elife_app.GetNativeFunctionAndroid({'keyword': 'getNetworkStatus'});
                } else if (ICBCUtil.isElifeIos()) {
                    ICBCUtil.nativeGetConfig({
                        'key': 'getNetworkStatus',
                        'callBack': "GetNetworkStatusCallback"
                    });
                } else {
                    $rootScope.hasWifi = "01";
                }
            }, 0);
            $rootScope.loading = false;
        });
        $rootScope.toast = function (content, duration) {
            // alert("toast");
            duration = duration || 3000;
            $scope.toastShow = true;
            // $scope.toastContent = content;
            document.getElementById("toast_content").innerHTML = content;
            if (this._timer) {
                $timeout.cancel(this._timer);
            }
            this._timer = $timeout(function () {
                $scope.toastShow = false;
            }, duration);
        };
        //调用系统返回
        $rootScope.return_btn = function ($event) {
            if (ICBCUtil.isElifeAndroid()) {
                elife_app.GetNativeFunctionAndroid({'keyword': 'return_btn'});
            } else if (ICBCUtil.isElifeIos()) {
                ICBCUtil.nativeGetConfig({
                    'key': 'return_btn',
                    'callBack': ''
                });
            } else {
                window.history.back();
                return false;
            }
        };
        $rootScope.removeCookie = function () {
            var KEY_STORE_FILTER_DISTRICT = "storeDistrict";
            var KEY_STORE_FILTER_CITY_DISTRICT = "storeCityDistrict";
            var KEY_STORE_FILTER_MODE = "storeFilterMode";
            var KEY_STORE_ORDER_NAME = "storeOrderName";
            var KEY_STORE_ORDER_KEY = "storeOrderKey";
            var KEY_STORE_FILTER_DISTANCE = "storeFilterDistance";
            var KEY_STORE_FILTER_TYPE = "storeFilterType";
            var KEY_STORE_FILTER_BIG_TYPE = "storeFIlterBigType";
            var KEY_STORE_SEARCH_KEYNAME = "keyname";
            $cookieStore.remove(KEY_STORE_FILTER_MODE);
            $cookieStore.remove(KEY_STORE_FILTER_DISTANCE);
            $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
            $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
            $cookieStore.remove(KEY_STORE_FILTER_TYPE);
            $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
            $cookieStore.remove(KEY_STORE_ORDER_KEY);
            $cookieStore.remove(KEY_STORE_ORDER_NAME);
            $cookieStore.remove(KEY_STORE_SEARCH_KEYNAME);
        };
        //清楚cookie并调用手机返回
        $rootScope.removeCookieBack = function () {
            $rootScope.removeCookie();
            if (ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid()) {
                // document.getElementsByClassName("return_btn")[0].setAttribute("href","javascript:void(0);");
                // window.history.back();
                if (ICBCUtil.isElifeAndroid()) {
                    elife_app.GetNativeFunctionAndroid({'keyword': 'return_btn'});
                } else if (ICBCUtil.isElifeIos()) {
                    ICBCUtil.nativeGetConfig({
                        'key': 'return_btn',
                        'callBack': ''
                    });
                }
            } else {
                window.history.back();
                history.back();
            }
        };
        //清楚cookie并调用js返回
        $rootScope.removeCookieJsBack = function () {
            $rootScope.removeCookie();
            window.history.back();
            history.back();
        };
        $rootScope.parseImageUrl = function (url) {
            if ($rootScope.hasWifi == "10") {
                return "images/e生活缺省图.png";
            } else {
                if (/^http/.test(url)) {
                    return url;
                } else {
                    return $rootScope.imgBaseUrl + url;
                }
            }
        };
        $scope.toastShow = false;
        $scope.toastContent = '';
    }])
    .directive('pageTitle', [function () {
        return {
            restrict: 'A',
            compile: function (elem, attrs) {
                var title = attrs.pageTitle;
                return function (scope, elem) {
                    document.title = title;
                };
            }
        };
    }
    ])
    .directive('fallbackSrc', function () {
        var fallbackSrc = {
            link: function postLink(scope, iElement, iAttrs) {
                iElement.bind('error', function () {
                    angular.element(this).attr("src", iAttrs.fallbackSrc);
                });
            }
        };
        return fallbackSrc;
    });
elife.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);
var _ = angular.element;
elife.isElifeAndroid = ICBCUtil.isElifeAndroid();