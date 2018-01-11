//companionApp.directive('googleplace', function () {
//    return {
//        require: 'ngModel',
//        link: function (scope, element, attrs, model) {
//            var options = {
//                types: []//,
//                //componentRestrictions: {}
//            };
//            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

//            google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
//                scope.$apply(function () {
//                    model.$setViewValue(element.val());
//                });
//            });
//        }
//    };
//});


'use strict';

/**
 * A directive for adding google places autocomplete to a text box
 * google places autocomplete info: https://developers.google.com/maps/documentation/javascript/places
 *
 * Usage:
 *
 * <input type="text"  ng-autocomplete ng-model="autocomplete" options="options" details="details/>
 *
 * + ng-model - autocomplete textbox value
 *
 * + details - more detailed autocomplete result, includes address parts, latlng, etc. (Optional)
 *
 * + options - configuration for the autocomplete (Optional)
 *
 *       + types: type,        String, values can be 'geocode', 'establishment', '(regions)', or '(cities)'
 *       + bounds: bounds,     Google maps LatLngBounds Object, biases results to bounds, but may return results outside these bounds
 *       + country: country    String, ISO 3166-1 Alpha-2 compatible country code. examples; 'ca', 'us', 'gb'
 *       + watchEnter:         Boolean, true; on Enter select top autocomplete result. false(default); enter ends autocomplete
 *
 * example:
 *
 *    options = {
 *        types: '(cities)',
 *        country: 'ca'
 *    }
**/

angular.module("ngAutocomplete", [])
  .directive('ngAutocomplete', function ($parse, $rootScope, $timeout) {
      return {

          scope: {
              details: '=',
              ngModel: '=',
              lat: '=',
              lng: '=',
              options: '=',
              city: '='
          },

          link: function (scope, element, attrs, model) {

              //options for autocomplete
              var opts

              //convert options provided to opts
              var initOpts = function () {
                  opts = {}
                  if (scope.options) {
                      if (scope.options.types) {
                          opts.types = []
                          opts.types.push(scope.options.types)
                      }
                      if (scope.options.bounds) {
                          opts.bounds = scope.options.bounds
                      }
                      if (scope.options.country) {
                          opts.componentRestrictions = {
                              country: scope.options.country
                          }
                      }
                  }
              }
              initOpts()
              scope.bComplete = false
              //create new autocomplete
              //reinitializes on every change of the options provided
              var newAutocomplete = function () {

                  var autocomplete = new google.maps.places.Autocomplete(element[0], {});
                  google.maps.event.addListener(autocomplete, 'place_changed', function () {
                      //autocomplete.getPlace().geometry.location.lat()
                      var place = autocomplete.getPlace();
                      scope.details = place
                      scope.lat = place.geometry.location.lat().toFixed(6).toString();
                      scope.lng = place.geometry.location.lng().toFixed(6).toString();
                      scope.city = place.vicinity ? place.vicinity.toString() : place.name.toString();

                      scope.bComplete = true
                      scope.ngModel = element.val();
                      $timeout(function () {
                          scope.bComplete = false;
                      }, 500);
                  })
              }
              newAutocomplete()
              scope.$watch('ngModel', function () {
                  if (scope.bComplete == false) {
                      if (scope.ngModel != undefined && scope.ngModel != '' && scope.ngModel != null) {
                          new google.maps.Geocoder().geocode({ 'address': scope.ngModel }, function (results, status) {
                              if (status == 'OK') {
                                  scope.lat = results[0].geometry.location.lat().toFixed(6).toString();
                                  scope.lng = results[0].geometry.location.lng().toFixed(6).toString();
                                  scope.city = results[0].vicinity ? results[0].vicinity.toString() : results[0].name ? results[0].name.toString() : '';
                              } else {
                                  scope.lat = null
                                  scope.lng = null
                                  scope.city = null
                              }
                          });
                      }
                  }
              }, true);
              //watch options provided to directive
              scope.watchOptions = function () {
                  return scope.options
              };
              scope.$watch(scope.watchOptions, function () {
                  initOpts();
                  newAutocomplete();
                  //element[0].value = '';
                  //scope.ngAutocomplete = element.val();
                  scope.ngModel = element.val();
              }, true);
          }
      };
  });




