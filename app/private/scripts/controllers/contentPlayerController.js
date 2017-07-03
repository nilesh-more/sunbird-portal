'use strict';

angular.module('playerApp').controller('contentPlayerCtrl', function (noteService, $state, $scope, $sce, contentService, pdfDelegate, $timeout, config) {
    var player = this;
    $scope.isClose = $scope.isclose;
    $scope.isHeader = $scope.isheader;
    $scope.showModalInLectureView = true;

    $scope.updateDataOnWatch = function (scope) {
        if (scope.body) {
            showPlayer(scope.body);
        } else if (scope.id) {
            getContent(scope.id);
        }
    };

    function showPlayer(data) {
        $scope.contentData = data;
        $scope.showMetaData = $scope.isshowmetaview;
        if ($scope.contentData.mimeType === 'application/vnd.ekstep.ecml-archive' || $scope.contentData.mimeType === 'application/vnd.ekstep.html-archive') {
            $scope.showIFrameContent = true;
            var iFrameSrc = config.ekstep_CP_config.baseURL;
            $timeout(function () {
                var previewContentIframe = $('#contentViewerIframe')[0];
                previewContentIframe.src = iFrameSrc;
                previewContentIframe.onload = function () {
                    var configuration = {};
                    configuration.context = config.ekstep_CP_config.context;
                    configuration.context.contentId = $scope.contentData.identifier;
                    configuration.config = config.ekstep_CP_config.config;
                    previewContentIframe.contentWindow.initializePreview(configuration);
                };
            }, 1000);
        } else {
            $scope.showIFrameContent = false;
        }
    }
    /**
     * This function helps to show loader or any error message at the time of api call.
     * @param {Boolean} showMetaLoader
     * @param {String} messageClass
     * @param {String} message
     */
    function showLoaderWithMessage(showMetaLoader, messageClass, message, closeButton, tryAgainButton) {
        var error = {};
        error.showError = true;
        error.showMetaLoader = showMetaLoader;
        error.messageClass = messageClass;
        error.message = message;
        error.showCloseButton = closeButton;
        error.showTryAgainButton = tryAgainButton;
        $scope.errorObject = error;
    }

    function getContent(contentId) {
        var req = {contentId: contentId};
        contentService.getById(req).then(function (response) {
            if (response && response.responseCode === 'OK') {
                $scope.errorObject = {};
                showPlayer(response.result.content);
            } else {
                var message = 'Unable to play, please try Again or close.';
                showLoaderWithMessage(false, 'red', message, true, true);
            }
        }).catch(function (error) {
            var message = 'Unable to play, please try Again or close.';
            showLoaderWithMessage(false, 'red', message, true, true);
        });
    }

    $scope.close = function () {
        if ($scope.closeurl)
        {
            $state.go($scope.closeurl);
        }
        $scope.errorObject = {};
        if ($scope.id) {
            $scope.id = '';
        }
        if ($scope.body) {
            $scope.body = {};
        }

        $scope.visibility = false;

    };
    $scope.tryAgain = function () {
        $scope.errorObject = {};
        getContent($scope.id);
    };
    $scope.zoomIn = function () {
        pdfDelegate.$getByHandle('content-player').zoomIn();
    };
    $scope.zoomOut = function () {
        pdfDelegate.$getByHandle('content-player').zoomOut();
    };
    $scope.previous = function () {
        pdfDelegate.$getByHandle('content-player').prev();
        $scope.getCurrentPage = $scope.getCurrentPage > 1 ? $scope.getCurrentPage - 1 : $scope.getCurrentPage;
    };
    $scope.next = function () {
        pdfDelegate.$getByHandle('content-player').next();
        $scope.getCurrentPage = $scope.getCurrentPage < $scope.totalPageNumber ? $scope.getCurrentPage + 1 : $scope.getCurrentPage;
    };
    $scope.rotate = function () {
        pdfDelegate.$getByHandle('content-player').rotate();
    };
    $scope.goToPage = function (pageNumber) {
        pdfDelegate.$getByHandle('content-player').goToPage(pageNumber);
        $scope.getCurrentPage = pageNumber;
    };
    $scope.getTotalPage = function () {
        $timeout(function () {
            $scope.totalPageNumber = pdfDelegate.$getByHandle('content-player').getPageCount();
            $scope.getCurrentPage = pdfDelegate.$getByHandle('content-player').getCurrentPage();
        }, 2000);
    };
});