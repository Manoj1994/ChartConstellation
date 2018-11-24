'use strict'
var app = angular.module("mainApp");

app.service("ChartService", function($http){
  this.getChartTypes = function getChartTypes(){
    return $http({
      method: 'GET',
      url: '/chartType/getAllChartTypes'
    })
  }

  this.getAllAttributes = function getAllAttributes(){
    return $http({
      method: 'GET',
      url: '/chartType/getAllAttributes'
    })
  }

  this.getImages =  function getAllImages () {
    return $http({
      method: 'GET',
      url: '/chartType/getAllImages'
    })
  }
})
