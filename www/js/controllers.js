angular.module('app.controllers', ['ngCordova'])


.controller('camCtrl',['$scope','$cordovaBarcodeScanner','$state',
    

   function($scope,$cordovaBarcodeScanner,$state) {

    $scope.scan=function(){

    cordova.plugins.barcodeScanner.scan(
      function (result) {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
          $state.go('app.tab.lugares-detalle', { aId:result.text});
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          "preferFrontCamera" : true, // iOS and Android
          "showFlipCameraButton" : true, // iOS and Android
          "prompt" : "Place a barcode inside the scan area", // supported on Android only
          "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
      }
   );
}



    } 

])

.controller('NuevoLugarCtrl', function($scope,ComentarioService,$http,$ionicLoading,$window, SeleccionInterna,$ionicPopup,$state,$stateParams){
    $scope.tituloLugar='';
   $scope.imgLugar='';
   $scope.descripLugar='';
   $scope.dirLugar='';
   $scope.tipLugar='';

  $scope.guardar = function(){
    console.log("entre a guardar");
        $http({
        method : 'post',
        url : 'https://cultural-api.herokuapp.com/api/Lugares',
        data :{
            title:$scope.tituloLugar,
            image:$scope.imgLugar,
            description:$scope.descripLugar,
            latitud:5,
            longitud:5,
            qr:'hola',
            direccion:$scope.dirLugar,
            tipo:'edificacion'
           }
        }).success(function(data) {
            console.log(data);
            console.log("se agrego un lugar");
        });      
  };

})

.controller('NuevoFavoritoCtrl', function($scope,ComentarioService,$http,$ionicLoading,$window, SeleccionInterna,$ionicPopup,$state,$stateParams){
   $scope.informacion = SeleccionInterna.getUser();
   $scope.lugar = SeleccionInterna.getLugarSeleccionado();
    $scope.estrella='ion-ios-star-outline';


$scope.setRating = function() {
    $scope.lugar = SeleccionInterna.getLugarSeleccionado();
        if ($scope.estrella=='ion-ios-star-outline') {
         $scope.estrella = 'ion-ios-star';

          console.log("entre a la save");
        $http({
        method : 'post',
        url : 'https://cultural-api.herokuapp.com/api/Favoritos',
        data :{
            id_user:$scope.informacion.uid,
            id_lugar:$scope.lugar._id,
            title:$scope.lugar.title,
            image:$scope.lugar.image
           }
        }).success(function(data) {
            console.log(data);
        });
      }else {
          $scope.estrella = 'ion-ios-star-outline';
          var identificador = $stateParams.aId;
          var identificador2 = $scope.lugar._id;
          //$scope.delete = function(){
            console.log("entre a la delete");
            console.log("borre",identificador);
            console.log("borre2",identificador2);
            var base='https://cultural-api.herokuapp.com/api/Favoritos/';
            //aca
              $http({
        method : 'delete',
        url : 'https://cultural-api.herokuapp.com/api/Favoritos/5760d15a2aba48030035d0cd',
        data :{
            id_user:$scope.informacion.uid,
            id_lugar:$scope.lugar._id,
            title:$scope.lugar.title,
            image:$scope.lugar.image
           }
        }).success(function(data) {
            console.log(data);
        });

        };

    } 

})



.controller('favoritosCtrl', ['$scope','FavoritoService','SeleccionInterna','$timeout','$state', '$ionicLoading',function($scope,FavoritoService,SeleccionInterna,$timeout, $state,$ionicLoading ) {
  $scope.favoritos = [];
  $scope.informacion = SeleccionInterna.getUser();
$scope.$on('$ionicView.enter', function() {
  FavoritoService.getAll().then(function(response){
    $scope.favoritos = response.data;
  });
});

  $scope.selectFavorito=function(favorito){
    SeleccionInterna.setLugarSeleccionado(favorito);
  };

}])


.controller('lugaresCtrl', ['$scope','lugaresService','SeleccionInterna','$timeout','$state', '$ionicLoading','$ionicModal','$ionicSlideBoxDelegate',function($scope,lugaresService,SeleccionInterna,$timeout, $state,$ionicLoading ,$ionicModal,$ionicSlideBoxDelegate )  {
//Modal para datos personales

$scope.show = function() {
  $ionicLoading.show({
    template: '<p>Cargando...</p><ion-spinner></ion-spinner>'
  });
};

$scope.hide = function(){
      $ionicLoading.hide();
};
$ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal1 = modal;
    });
    //Inicializando lugares
$scope.lugares = [];
var user= SeleccionInterna.getUser();
 $scope.foto=user.google.profileImageURL;
 $scope.nombre=user.google.displayName;
 $scope.email=user.google.email;
 $scope.$on('$ionicView.enter', function() {


   });
	var lugar= 'Lugares';
 $scope.$on('$ionicView.enter', function() {
   $scope.show($ionicLoading);
  lugaresService.getAll(lugar).then(function(response){

    console.info(response.data);
    console.log(response.data);
    $scope.lugares = response.data;

  }).finally(function($ionicLoading) {
      // On both cases hide the loading
      $scope.hide($ionicLoading);
    });

});
	$scope.selectLugar=function(lugar){
    SeleccionInterna.setLugarSeleccionado(lugar);
  };
  
    $ionicModal.fromTemplateUrl('templates/image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $ionicSlideBoxDelegate.slide(0);
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });

    // Call this functions if you need to manually control the slides
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
  
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };
  
    $scope.goToSlide = function(index) {
      $scope.modal.show();
      $ionicSlideBoxDelegate.slide(index);
    };
  
    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };


}])

.controller('detallesCtrl', ['$scope','DetalleService','ComentarioService','$state','SeleccionInterna','$location','$stateParams',function($scope,DetalleService,ComentarioService,$state,SeleccionInterna,$location,$stateParams) {
  var identificador = $stateParams.aId;
  $scope.detalle = [];
  DetalleService.getAll(identificador).then(function(response){
    console.info(response.data);
    console.log(response.data);
    $scope.detalle = response.data;
  });
  $scope.comentarios = [];

  ComentarioService.getAll().then(function(response){
    $scope.comentarios = response.data.reverse();
  });
  

  $scope.go = function ( path ) {
  $location.path( path );
};

}])

.controller('detallesFavoritoCtrl', ['$scope','DetalleService','ComentarioService','$state','SeleccionInterna',function($scope,DetalleService,ComentarioService,$state,SeleccionInterna) {
  $scope.lugar = SeleccionInterna.getLugarSeleccionado();

  var identificador = $scope.lugar.id_lugar;
  console.log("id",identificador);
  $scope.detalle = [];
  DetalleService.getAll(identificador).then(function(response){
    console.info(response.data);
    console.log(response.data);
    $scope.detalle = response.data;
  });
  $scope.comentarios = [];

  ComentarioService.getAll().then(function(response){
    $scope.comentarios = response.data;
  });
}])

.controller('LoginCtrl',['$scope','Auth','$state','$ionicActionSheet','$ionicPopup','SeleccionInterna',function($scope,Auth,$state,$ionicActionSheet,$ionicPopup,SeleccionInterna){
	var ref = new Firebase("https://APICULTURAL.firebaseio.com");
	$scope.usuarioGoogle = {};
 $scope.google_data = {};
  $scope.logiar = function(){
  ref.authWithOAuthPopup("google", function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);

    var authData = ref.getAuth();
		SeleccionInterna.setUsuarioSeleccionado(authData);
    console.log("getUser:",SeleccionInterna.getUser());
		$scope.google_data = authData;
    var today=SeleccionInterna.fechaExacta();
		var childRef= ref.child(authData.uid);
		ref.child(authData.uid).once('value', function(snapshot) {
     var exists = (snapshot.val() !== null);
     if(!exists){
			 console.log('No existe');
			 childRef.set({
			 name: authData.google.displayName,
			 provider: authData.provider,
			 image : authData.google.profileImageURL,
			 creacion:today
			 });
		 }else{
			 console.log('existe');
			 var dateRef=ref.child(authData.uid+'/'+'creacion');
			 dateRef.remove();
			 childRef.update({
			 	lastLogin :today
			 });


		 }
   });

    $state.go('app.tab.lugares');
  }
}, {
remember: "sessionOnly",
scope: "email"
});

}
//LogOut
$scope.logout = function() {
 var hideSheet = $ionicActionSheet.show({
    titleText: 'Estás seguro?',
    destructiveText: 'Log out',
    cancelText: 'Cancel',
    cancel: function() {
       },
    destructiveButtonClicked: function() {
      hideSheet();

      return alertCallback();
    }
  });
}
function alertCallback(){
    ref.unauth();

    $scope.$on("$ionicView.afterLeave", function () {
            $ionicHistory.clearCache();
    });

    console.log("Saliendo de la app");
  var alertPopup = $ionicPopup.alert({
      title: 'Logging Out',
      template: 'Thanks for using CulturalAPP'
    });
    alertPopup.then(function(res) {
    $state.go('app.login');
  });
};
}]).$inject = ['Auth', '$state'];;
