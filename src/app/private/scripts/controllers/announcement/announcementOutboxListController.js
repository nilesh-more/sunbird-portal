'use strict'

angular.module('playerApp')
  .controller('announcementOutboxListController', ['$rootScope', '$scope',
    'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService', 'PaginationService',
    function($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService, PaginationService) {
      var announcementOutboxData = this
      announcementOutboxData.pager = {};
      announcementOutboxData.setPage = setPage;
      announcementOutboxData.showLoader = true
      announcementOutboxData.showDataDiv = false

      announcementOutboxData.renderAnnouncementList = function() {
        announcementService.getOutBoxAnnouncementList($rootScope.userId).then(function(apiResponse) {
            apiResponse = apiResponse.data;
            if (apiResponse && apiResponse.responseCode === 'OK') {
              announcementOutboxData.result = apiResponse.result
              announcementOutboxData.listData = apiResponse.result.announcements.content
              initController();
              if (announcementOutboxData.listData.length > 0) {
                announcementOutboxData.showDataDiv = true
              }
            } else {
              toasterService.error(apiResponse.params.errmsg)
            }
          })
          .catch(function(err) {
            toasterService.error(err.data.params.errmsg)
          })
          .finally(function() {
            announcementOutboxData.showLoader = false
          });
      }

      function initController() {
        // initialize to page 1
        announcementOutboxData.setPage(1);
      }

      function setPage(page) {
        if (page < 1 || page > announcementOutboxData.pager.totalPages) {
          return;
        }
        // get pager object from service
        announcementOutboxData.pager = PaginationService.GetPager(announcementOutboxData.listData.length, page);
        // get current page of items
        announcementOutboxData.items = announcementOutboxData.listData.slice(announcementOutboxData.pager.startIndex, announcementOutboxData.pager.endIndex + 1);
      }

        announcementOutboxData.showModal = function(modalId) {
            $('#' + modalId).modal('show')
        }
        announcementOutboxData.closeModal = function(modalId) {
            $('#' + modalId).modal('hide')
        }
        announcementOutboxData.deleteAnnouncement = function(announcementId) {
            // Call the delete service
            announcementService.deleteAnnouncement(announcementId).then(function(apiResponse) {
                apiResponse = apiResponse.data
                //console.log(JSON.stringify(apiResponse))
                // Check if response successful
                if (apiResponse && apiResponse.responseCode === 'OK' && apiResponse.result.status === 'cancelled') {
                    // Show success toaster
                    toasterService.success('Announcement cancelled successfully.')
                    announcementOutboxData.renderAnnouncementList()
                } else {
                    toasterService.error(apiResponse.params.errmsg)
                }
            }).catch(function(err) {
                toasterService.error(err.data.params.errmsg)
            }).finally(function() {
                // Close the modal popup and reset v alue of deleteAnnouncementId
                announcementOutboxData.closeModal('announcementDeleteModal')
            })
        }
        announcementOutboxData.getResend = function(announcementId) {
	      announcementService.getResend(announcementId).then(function(apiResponse) {
	        apiResponse = apiResponse.data
	        //console.log(JSON.stringify(apiResponse))
	        if (apiResponse && apiResponse.responseCode === 'OK') {
            if (apiResponse.hasOwnProperty('result')){
  	          // TODO - open the create announcement with edit mode and prepopulated data
  	          announcementOutboxData.editPopup(apiResponse.result)
              //announcementOutboxData.resendAnnouncement(apiResponse.result)
            } else {
              toasterService.error('An unexpected error occured.')
            }
	        } else {
	          toasterService.error(apiResponse.params.errmsg)
	        }
	      }).catch(function(err) {
	        toasterService.error(err.data.params.errmsg)
	      }).finally(function() {})
	    }
      announcementOutboxData.editPopup = function(announcement) {
            $rootScope.$broadcast('editAnnouncementBeforeResend', announcement);
      }
    }
])