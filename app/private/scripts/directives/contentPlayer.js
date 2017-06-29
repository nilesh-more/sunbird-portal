'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentPlayer
 * @description
 * # contentPlayer
 */
angular.module('playerApp').directive('contentPlayer', function() {
    return {
        templateUrl: 'views/contentplayer/player.html',
        restrict: 'E',
        scope: {
            id: '=',
            body: '=',
            visibility: '=',
            isshowmetaview: '=',
            isclose: '=',
            isheader: '=',
            height: '=',
            width: '=',
            ispercentage: '='
        },
        link: function(scope, element, attrs) {
            if (scope.ispercentage) {
                $('#contentPlayer').css('height', scope.height + '%');
                $('#contentPlayer').css('width', scope.width + '%');
            } else {
                $('#contentPlayer').css('height', scope.height + 'px');
                $('#contentPlayer').css('width', scope.width + 'px');
            }

            scope.$watch('body', function() {
                scope.updateDataOnWatch(scope);
            });
            scope.$watch('id', function() {
                scope.updateDataOnWatch(scope);
            });
        },
        controller: 'contentPlayerCtrl'
    };
});

angular.module('playerApp').controller('contentPlayerCtrl', function(noteService, $rootScope, $scope, $sce, contentService, pdfDelegate, $timeout, config) {
    var player = this;
    $scope.isClose = $scope.isclose;
    $scope.isHeader = $scope.isheader;
    player.nightMode = true;
    $scope.add = {};
    // notes code
    player.showAddNoteModal = function() {
        $timeout(function() {
            $('#modalcontentNotes').modal('show');
        }, 100);
    };
    /* This function helps to show loader or any error message at the time of api call.
     * @param {Boolean} showMetaLoader
     * @param {String} messageClass
     * @param {String} message
     */
    function showLoaderWithMessage(showMetaLoader, messageClass, message) {
        var error = {};
        error.showError = true;
        error.showMetaLoader = showMetaLoader;
        error.messageClass = messageClass;
        error.message = message;
        $scope.error = error;
    }

    /**
     * This function called when api failed, and its show failed response for 2 sec.
     * @param {String} message
     */
    function handleFailedResponse(message) {
        showLoaderWithMessage(false, 'red', message);
        $timeout(function() {
            $scope.error = {};
        }, 2000);
    }

    /**
     * This function call search api and bind data
     * @param {type} request
     * @returns {undefined}
     */
    function search(request) {
        noteService.search(request).then(function(response) {
                if (response && response.responseCode === 'OK') {
                    player.error = {};
                    $scope.notesList = response.result.note;
                    player.notesCount = response.result.count;
                    if (response.result.count !== 0) {
                        player.contentNotes = response.result.note[0];
                        $scope.add.title = player.contentNotes.title;
                        $scope.add.note = player.contentNotes.note;
                        player.noteIdentifier = player.contentNotes.identifier;
                    }
                } else {
                    // handleFailedResponse(config.MESSAGES.NOTES.SEARCH.FAILED);
                }
            })
            .catch(function(error) {
                // handleFailedResponse(config.MESSAGES.NOTES.SEARCH.FAILED);
            });
    }
    $scope.createNote = function(noteData) {
        var requestData = {
            note: {
                note: noteData.note,
                userId: 'user1',
                title: noteData.title,
                // courseId: $scope.$root.courseId,
                contentId: $scope.contentData.identifier,
            }
        };

        showLoaderWithMessage(true, '', config.MESSAGES.NOTES.CREATE.START);
        noteService.create(requestData).then(function(response) {
            if (response && response.responseCode === 'OK') {
                $scope.error = {};
                $scope.ngInit();
                $scope.add.showCreateNote = false;
                // $scope.add = {};
                $scope.add.showModalError = false;
            } else {
                $scope.add.showModalError = true;
                handleFailedResponse(config.MESSAGES.NOTES.CREATE.FAILED);
            }
        }).catch(function(error) {
            $scope.add.showModalError = true;
            handleFailedResponse(config.MESSAGES.NOTES.CREATE.FAILED);
        });
    };
    $scope.ngInit = function() {
        // showLoaderWithMessage(true, '', config.MESSAGES.NOTES.SEARCH.START);
        var request = {
            filters: {
                userId: 'user1',
                // courseId: $scope.$root.courseId,
                contentId: $scope.contentData.identifier
            },
            sort_by: {
                'lastUpdatedOn': 'desc'
            }
        };

        search(request);
    };
    $scope.removeNote = function(noteId) {
        var requestData = { noteId: noteId };

        showLoaderWithMessage(true, '', config.MESSAGES.NOTES.REMOVE.START);
        noteService.remove(requestData).then(function(response) {
                if (response && response.responseCode === 'OK') {
                    $scope.notesList = $scope.notesList.filter(function(note) {
                        return note.identifier !== noteId;
                    });
                    $scope.error = {};
                } else {
                    handleFailedResponse(config.MESSAGES.NOTES.REMOVE.FAILED);
                }
            })
            .catch(function(error) {
                handleFailedResponse(config.MESSAGES.NOTES.REMOVE.FAILED);
            });
    };
    $scope.showAllNoteList = function() {
        $scope.showNoteList = true;
        // $rootScope.$emit('showAllNoteList', true);
    };
    $scope.closeNoteList = function() {
        $scope.showNoteList = false;
        // $rootScope.$emit('showAllNoteList', false);
    };
    player.updateNote = function(noteData) {
        var requestData = {
            noteId: player.noteIdentifier,
            note: noteData
        };

        delete requestData.note['identifier'];

        showLoaderWithMessage(true, '', config.MESSAGES.NOTES.UPDATE.START);
        noteService.update(requestData).then(function(response) {
                if (response && response.responseCode === 'OK') {
                    $scope.notesList = $scope.notesList.filter(function(note) {
                        return note.identifier !== noteData.identifier;
                    });
                    $scope.notesList.push(response.result.note);
                    $scope.ngInit();
                    $scope.error = {};
                    $scope.update.showUpdateNote = false;
                    $scope.showModalError = false;
                } else {
                    $scope.showModalError = true;
                    handleFailedResponse(config.MESSAGES.NOTES.UPDATE.FAILED);
                }
            })
            .catch(function(error) {
                $scope.showModalError = true;
                handleFailedResponse(config.MESSAGES.NOTES.UPDATE.FAILED);
            });
    };

    // end notes
    $scope.updateDataOnWatch = function(scope) {
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
            $timeout(function() {
                var previewContentIframe = $('#contentViewerIframe')[0];
                previewContentIframe.src = iFrameSrc;
                previewContentIframe.onload = function() {
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
        var req = { contentId: contentId };
        contentService.getById(req).then(function(response) {
            if (response && response.responseCode === 'OK') {
                $scope.errorObject = {};
                showPlayer(response.result.content);
            } else {
                var message = 'Unable to play, please try Again or close.';
                showLoaderWithMessage(false, 'red', message, true, true);
            }
        }).catch(function(error) {
            var message = 'Unable to play, please try Again or close.';
            showLoaderWithMessage(false, 'red', message, true, true);
        });
    }

    $scope.close = function() {
        $scope.errorObject = {};
        if ($scope.id) {
            $scope.id = '';
        }
        if ($scope.body) {
            $scope.body = {};
        }

        $scope.visibility = false;
    };
    $scope.tryAgain = function() {
        $scope.errorObject = {};
        getContent($scope.id);
    };
    $scope.zoomIn = function() {
        pdfDelegate.$getByHandle('content-player').zoomIn();
    };
    $scope.zoomOut = function() {
        pdfDelegate.$getByHandle('content-player').zoomOut();
    };
    $scope.previous = function() {
        pdfDelegate.$getByHandle('content-player').prev();
        $scope.getCurrentPage = $scope.getCurrentPage > 1 ? $scope.getCurrentPage - 1 : $scope.getCurrentPage;
    };
    $scope.next = function() {
        pdfDelegate.$getByHandle('content-player').next();
        $scope.getCurrentPage = $scope.getCurrentPage < $scope.totalPageNumber ? $scope.getCurrentPage + 1 : $scope.getCurrentPage;
    };
    $scope.rotate = function() {
        pdfDelegate.$getByHandle('content-player').rotate();
    };
    $scope.goToPage = function(pageNumber) {
        pdfDelegate.$getByHandle('content-player').goToPage(pageNumber);
        $scope.getCurrentPage = pageNumber;
    };
    $scope.getTotalPage = function() {
        $timeout(function() {
            $scope.totalPageNumber = pdfDelegate.$getByHandle('content-player').getPageCount();
            $scope.getCurrentPage = pdfDelegate.$getByHandle('content-player').getCurrentPage();
        }, 2000);
    };
});