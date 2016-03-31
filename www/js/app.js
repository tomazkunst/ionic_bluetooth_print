// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
     }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.controller('Printing', function($scope, $ionicPlatform, $ionicLoading) {
    $scope.pair = false;
    $scope.print = true;
    $scope.index = 1;

    $scope.lovder = function(){
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    }

    $scope.hideLovder = function(){
        $ionicLoading.hide();
    }

    $ionicPlatform.ready(function() {
        $scope.pair = false;
        $scope.print = true;
  });

  $scope.toZero = function(){
    $scope.price = "";
  }

  $scope.scan = function(price) {
    $scope.lovder();
          var listPorts = function() {
            // list the available BT ports:
            bluetoothSerial.list(
                function(results) {$scope.$apply(function(){
                    //app.display(JSON.stringify(results));
                    $scope.items=results;
                    $scope.hideLovder();

                })},
                function(error) {
                    $scope.price=JSON.stringify(error);
                }
            );
        }
        var notEnabled = function() {
            $scope.name="Bluetooth is not enabled.";
        }

         // check if Bluetooth is on:
        bluetoothSerial.isEnabled(
            listPorts,
            notEnabled
        );
    };

    $scope.showView = function(view){
        console.log(view);
        $scope.$apply(function(){
            console.log(view);
            if (view=="pair"){
                $scope.pair = false;
                $scope.print = true;
            }
            else if(view=="print"){
                $scope.pair = true;
                $scope.print = false;
            }
        })
    };

    $scope.doPrint = function(price) {
        $scope.price=price
        data = $scope.getHeader();
        for (i=0;i<data.length;i++)
        {
            bluetoothSerial.write(data[i], function(){}, function(){console.log("fail")});
        }
    },

    $scope.getHeader = function() {
        var date = new Date();
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear()
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();

        var data = Array();
        data.push("\n------POTRDILO O POLOGU------\n\n");
        data.push("KSSO\n");
        data.push("Celjska cesta 28\n");
        data.push("3240 Smarje pri Jelsah\n");

        data.push("Datum: "+day+"."+(monthIndex+1)+"."+year+"\n");
        data.push("Ura: "+ h + ":" + m +"\n");
        data.push("Stevilka pologa: "+$scope.index+"\n");
        $scope.index++;
        data.push("Znesek: "+$scope.price+"Evrov\n");
        data.push("\n");
        data.push("\n");
        data.push("\n");
        data.push("\n");
        return data;
    }
  $scope.select = function(mac){
    $scope.lovder();
    console.log(mac);
    bluetoothSerial.connect(
        mac,  // device to connect to
        $scope.openPort,    // start listening if you succeed
        $scope.alert    // show the error if you fail
    );
  };
  $scope.alert = function(){
    alert("alert")
  };

  $scope.openPort = function(){
    console.log("port");
    $scope.showView("print");
    $scope.hideLovder();
    bluetoothSerial.subscribe(
        function(data){$scope.showView("print");}, 
        function(data){console.log("slaba");});
  };
});
