'use strict';
app.controller( 'JobDetailCtrl', [ 'ENV', '$log', '$scope', '$stateParams', '$state', '$ionicPopup', '$ionicModal', 'ApiService',
function( ENV, $log, $scope, $stateParams, $state, $ionicPopup, $ionicModal, ApiService ) {
    $scope.detail = {
      Type: $stateParams.Type,
      ContainerNo: $stateParams.ContainerNo,
      JobNo: $stateParams.JobNo,
      TrxNo: $stateParams.TrxNo,
      LineItemNo: $stateParams.LineItemNo,
      Description: $stateParams.Description,
      DoneFlag: $stateParams.DoneFlag
    };
    var currentDate = new Date();
    $scope.Update = {
      ContainerNo: $scope.detail.ContainerNo,
      remark: $stateParams.Remark,
      datetime: currentDate,
      strDatetime: currentDate.getTime()
    };
    if ( $scope.detail.Type === 'OPEN' ) {
      $scope.strDoneOrUpdateTitle = 'Detail Infos';
      $scope.strDoneOrUpdate = '';
    } else if ( $scope.detail.Type === 'UPDATE' ) {
      $scope.strDoneOrUpdateTitle = 'Update Remark';
      $scope.strDoneOrUpdate = 'Update';
    } else {
      $scope.strDoneOrUpdateTitle = 'Detail Infos';
      $scope.strDoneOrUpdate = 'Done';
    }
    $scope.returnList = function() {
      $state.go( 'jobList', {
        'JobNo': $scope.detail.JobNo,
        'TrxNo': $scope.detail.TrxNo
      }, {
        reload: true
      } );
    };
    $scope.update = function() {
      currentDate.setFullYear( $scope.Update.datetime.getFullYear() );
      currentDate.setMonth( $scope.Update.datetime.getMonth() );
      currentDate.setDate( $scope.Update.datetime.getDate() );
      currentDate.setHours( $scope.Update.datetime.getHours() );
      currentDate.setMinutes( $scope.Update.datetime.getMinutes() );
      var jsonData = '';
      if ( $scope.detail.Type === 'UPDATE' ) {
        jsonData = 'TrxNo=' + $scope.detail.TrxNo + '&LineItemNo=' + $scope.detail.LineItemNo +
          '&ContainerNo=' + $scope.Update.ContainerNo + '&CntrRemark=' + $scope.Update.remark +
          '&CargoStatusCode=N';
      } else if ( $scope.detail.Type === 'DONE' ) {
        jsonData = 'TrxNo=' + $scope.detail.TrxNo + '&LineItemNo=' + $scope.detail.LineItemNo +
          '&ContainerNo=' + $scope.Update.ContainerNo + '&CntrRemark=' + $scope.Update.remark +
          '&CargoStatusCode=Y';
      }
      var strUri = '/api/tms/sibl2/update?' + jsonData;
      ApiService.GetParam( strUri, true ).then( function success( result ) {
        if ( result.data.results >= 0 ) {
          $state.go( 'jobList', {
            'JobNo': $scope.detail.JobNo,
            'TrxNo': $scope.detail.TrxNo
          }, {
            reload: true
          } );
        }
      } );
    };
    var canvas = document.getElementById( 'signatureCanvas' );
    resizeCanvas();
    var signaturePad = new SignaturePad( canvas );
    //signaturePad.backgroundColor = "white";
    //signaturePad.minWidth = 2;
    //signaturePad.maxWidth = 4.5;
    $scope.clearCanvas = function() {
      $scope.signature = null;
      signaturePad.clear();
    }
    $scope.saveCanvas = function() {
      var sigImg = signaturePad.toDataURL();
      $scope.signature = sigImg;
    }

    function resizeCanvas() {
      var ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth - 50;
      canvas.height = window.innerHeight / 4 - 50;
    };
    } ] );
