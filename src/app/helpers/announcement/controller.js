let AnnouncementModel = require('./model/AnnouncementModel.js')
let AnnouncementTypeModel = require('./model/AnnouncementTypeModel.js')
let AttachmentModel = require('./model/AttachmentModel.js')
let MetricsModel = require('./model/MetricsModel.js')
let Joi = require('joi')
let HttpStatus = require('http-status-codes')
const _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')
const ObjectStoreRest = require('./ObjectStore/ObjectStoreRest.js')
let uuidv1 = require('uuid/v1')
let dateFormat = require('dateformat')
let webService = require('request')
let envVariables = require('../environmentVariablesHelper.js')

class AnnouncementController {

  constructor() {
    //table name should be same as the name in database table
    let tableMapping = {
      'announcement': AnnouncementModel,
      'announcementtype': AnnouncementTypeModel,
      'attachment': AttachmentModel,
      'metrics': MetricsModel
    }

    let modelConstant = {
      'ANNOUNCEMENT': 'announcement',
      'ANNOUNCEMENTTYPE': 'announcementtype',
      'ATTACHMENT': 'attachment',
      'METRICS': 'metrics'
    }

    let statusConstant = {
        'ACTIVE': 'active',
        'CANCELLED': 'cancelled',
        'DRAFT': 'draft'
    }

    let metricsActivityConstant = {
        'READ': 'read',
        'RECEIVED': 'received'
    }

    this.objectStoreRest = new ObjectStoreRest(tableMapping, modelConstant)
    this.statusConstant = statusConstant
    this.metricsActivityConstant = metricsActivityConstant
  }

  /**
   * Public method to accept create announcement call
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  create(requestObj) {
    return this.__create()(requestObj)
  }

  __create() {
    return async((requestObj) => {

      const CREATE_ROLE = 'ANNOUNCEMENT_SENDER'
      // validate request
      let request = this.__validateCreateRequest(requestObj.body)
      if (!request.isValid) throw { msg: request.error, statusCode: HttpStatus.BAD_REQUEST }

      // let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
      // if (!authUserToken) throw { msg: 'UNAUTHORIZED', statusCode: HttpStatus.BAD_REQUEST }

      // try{  
      //   // TODO: verify  Is logged in userid matching with senderid
      //   let userProfile = await(this.__getUserProfile({ id: _.get(requestObj, 'body.request.createdBy')}, authUserToken))
      //   let organisation = _.find(userProfile.organisations, { organisationId: _.get(requestObj, 'body.request.sourceId') })
      //   if (_.isEmpty(organisation) || _.indexOf(organisation.roles, CREATE_ROLE) == -1) throw "user has no create access"
      // } catch(error) {
      //   if(error === 'USER_NOT_FOUND') {
      //     throw { msg: 'user not found', statusCode: HttpStatus.BAD_REQUEST }
      //   } else if (error === 'UNAUTHORIZE_USER') {
      //     throw { msg: 'user is not authorized', statusCode: HttpStatus.BAD_REQUEST }  
      //   } else {
      //     throw { msg: 'user has no create access', statusCode: HttpStatus.BAD_REQUEST }  
      //   }        
      // }

      try {
        var newAnnouncementObj = await (this.__createAnnouncement(requestObj.body.request))
      } catch (error) {
        throw { msg: 'unable to process the request!', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
      }

    try {
        if (newAnnouncementObj.data.id) {
            requestObj.body.request.announcementId = newAnnouncementObj.data.id
            this.createNotification(requestObj)
            return {
                announcement: newAnnouncementObj.data
            }
        }
    } catch (e) {
        // even if notification fails, it should still send annoucement in response
        return {
            announcement: newAnnouncementObj.data
        }
    }
})
  }

  /**
   * Validate the incoming request for creating an announcement
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  __validateCreateRequest(requestObj) {
    // TODO: Add validation for targt data structure
    let validation = Joi.validate(requestObj, Joi.object().keys({
      "request": Joi.object().keys({
        'sourceId': Joi.string().required(),
        'createdBy': Joi.string().required(),
        'title': Joi.string().required(),
        'from':Joi.string().required(),
        'type': Joi.string().required(),
        'description': Joi.string(),
        'target': Joi.object().min(1).required(),
        'links': Joi.array().items(Joi.string()),
        'attachments': Joi.array().items(Joi.string())
      }).required()
    }), { abortEarly: false })

    if (validation.error != null) {
      let messages = []
      _.forEach(validation.error.details, (error, index) => {
        messages.push({ field: error.path[0], description: error.message })
      })
      return { error: messages, isValid: false }
    }
    return { isValid: true };
  };

  /**
   * Get permissions list of the given user
   *
   * @param   {[type]}  data  [description]
   *
   * @return  {[type]}        [description]
   */
  __getUserProfile(data, authUserToken) {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(data.id)) {
        reject('user id is required!')
      }

      let options = {
        method: 'GET',
        uri: envVariables.DATASERVICE_URL + 'user/v1/read/' + data.id,
        headers: this.getRequestHeader({ xAuthUserToken: authUserToken })
      }
      this.httpService(options).then((data) => { 
        data.body = JSON.parse(data.body)  
        resolve(_.get(data, 'body.result.response'))
      })

      .catch((error) => {
        if (_.get(error, 'body.params.err') === 'USER_NOT_FOUND') {
          reject('USER_NOT_FOUND')
        } else if (_.get(error, 'body.params.err') === 'UNAUTHORIZE_USER') {
          reject('UNAUTHORIZE_USER')
        } else {
          reject("UNKNOWN_ERROR")  
        }        
      })
    })
  }

    __createAnnouncement(data) {
        return new Promise((resolve, reject) => {
            let announcementId = uuidv1()
            
            if (!data) reject({ msg: 'invalid request' })

            let query = {
                table: this.objectStoreRest.MODEL.ANNOUNCEMENT,
                values: {
                    'id': announcementId,
                    'sourceid': data.sourceId,
                    'createddate': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
                    'userid': data.createdBy,
                    'details': {
                        'title': data.title,
                        'type': data.type,
                        'description': data.description,
                        'from':data.from,
                    },
                    'target': data.target,
                    'links': data.links,
                    'status': this.statusConstant.ACTIVE,
                    'attachments': data.attachments
                }
            }

            this.objectStoreRest.createObject(query)
            .then((data) => {
                if (!_.isObject(data)) {
                    reject({ msg: 'unable to create announcement' })
                } else {
                    resolve({ data: { id: announcementId } })
                }
            })
            .catch((error) => {
                reject({ msg: 'unable to create announcement' })
            })
        })
  }

  /**
   * Call the notification service to send notifications about the announcement.
   *
   * @return  {[type]}  [description]
   */
  createNotification(data) {
     return this.__createAnnouncementNotification()(data);
  }

  __createAnnouncementNotification() {
        return async((data) => {
            let requestObj = {"to": "", "type": "fcm", "data": {"notificationpayload": {"msgid": data.body.request.announcementId, "title": data.body.request.title, "msg": data.body.request.description, "icon": "", "time": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"), "validity": "-1", "actionid": "1", "actiondata": "", "dispbehavior": "stack"} } }
            let options = {"method": "POST", "uri": envVariables.DATASERVICE_URL + "data/v1/notification/send", "body": {"request": requestObj }, "json": true }
            let authUserToken = _.get(data, 'kauth.grant.access_token.token') || data.headers['x-authenticated-user-token']
            if (!authUserToken){
             throw {msg: 'UNAUTHORIZED', statusCode: HttpStatus.BAD_REQUEST } 
            }
            options.headers =this.getRequestHeader({ xAuthUserToken: authUserToken });
            var targetIds = [];
            if (data.body.request.target) {
                _.forIn(data.body.request.target, (value, key) => {
                    if (_.isObject(value)) {
                        _.forEach(value.ids, (v, k) => {
                            targetIds.push(v);
                        });
                    }
                });
            }
            this.forEachPromise(targetIds, this.sendNotification, options, this).then(() => {
                console.log('done');
            });
        })

    }

  /**
   * Get announcement
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  getAnnouncementById(requestObj) {
    return this.__getAnnouncementById(requestObj)
  }

  __getAnnouncementById(requestObj) {
    return new Promise((resolve, reject) => {
      let query = {
        table: this.objectStoreRest.MODEL.ANNOUNCEMENT,
        query: {
          'id': requestObj.params.id
        }
      }

      this.objectStoreRest.findObject(query)
        .then((data) => {
          if (!_.isObject(data)) {
            reject({ msg: 'unable to fetch announcement', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
          } else {
            _.forEach(data.data.content, (announcementObj) => {
              if (_.isString(announcementObj.target)) announcementObj.target = JSON.parse(announcementObj.target)
            })
            resolve(_.get(data.data, 'content[0]'))
          }
        })
        .catch((error) => {
          reject({ msg: 'unable to fetch announcement', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
        })
    })
  }

  getDefinitions(requestObj){
    return this.__getDefinitions()(requestObj)
  }
  __getDefinitions() {
      return async((requestObj) => {
          let responseObj = {};
          if (requestObj.body.definitions) {
              if (requestObj.body.definitions.includes('announcementtypes')) {
                  let announcementTypes = await (this.__getAnnouncementTypes(requestObj));
                  responseObj["announcementtypes"] = announcementTypes;
              }
              if (requestObj.body.definitions.includes('senderlist')) {
                  let senderlist = await (this.__getSenderList()(requestObj));
                  responseObj["senderlist"]= senderlist;
              }
              return responseObj;
          }else{
             return { msg: 'unable to fetch ', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
          }
      });
  }

 /**
   * Get a list of announcement types
   *
   * @return  {[type]}  [description]
   */
  __getAnnouncementTypes(requestObj) {
    return new Promise((resolve, reject) => {
      let query = {
        table: this.objectStoreRest.MODEL.ANNOUNCEMENTTYPE,
        query: {
          'rootorgid': _.get(requestObj, 'body.rootorgid')
        }
      }

      this.objectStoreRest.findObject(query)
        .then((data) => {
          if (!_.isObject(data)) {
            resolve({ msg: 'unable to fetch announcement types', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
          } else {
            resolve(data.data)
          }
        })
        .catch((error) => {
          console.log(error)
          reject({ msg: 'unable to fetch announcement types', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
        })
    })
  }

  /**
   * Cancel announcement
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  cancelAnnouncementById(requestObj) {
    return this.__cancelAnnouncementById()(requestObj)
  }

  __cancelAnnouncementById() {
        return async((requestObj) => {
            let query = {
                table: this.objectStoreRest.MODEL.ANNOUNCEMENT,
                values: {
                    id: _.get(requestObj, 'body.request.announcenmentid'),
                    status: this.statusConstant.CANCELLED
                }
            }
            var status = await (this.__checkPermisionForCancel()(requestObj));
            return new Promise((resolve, reject) => {
                if (status) {
                    this.objectStoreRest.updateObjectById(query)
                        .then((data) => {
                            if (!_.isObject(data)) {
                                reject({
                                    msg: 'unable to cancel the announcement',
                                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR
                                })
                            } else {
                                resolve({
                                    id: requestObj.params.announcementId,
                                    status: this.statusConstant.CANCELLED
                                })
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                            reject({
                                msg: 'unable to cancel the announcement',
                                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
                            })
                        })
                } else {
                    reject({
                        msg: 'unable to cancel the announcement',
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
                    })
                }
            })
        })
    }

  __checkPermisionForCancel() {
      return async((requestObj) => {
          if (requestObj) {
              requestObj.params = {};
              let userId = _.get(requestObj, 'body.request.userid');
              requestObj.params.id = _.get(requestObj, 'body.request.announcenmentid');
              var response = await (this.getAnnouncementById(requestObj));
              return response.userid === userId ? true : false
          }else{
            return false;
          }
      });
  }

    /**
    * Get inbox of announcements for a given user
    *
    * @param   {[type]}  requestObj  [description]
    *
    * @return  {[type]}              [description]
    */
    getUserInbox(requestObj) {
        return this.__getUserInbox()(requestObj)
    }

    __getUserInbox() {
        return async((requestObj) => {
            let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
            if (!authUserToken) throw { msg: 'UNAUTHORIZED..', statusCode: HttpStatus.BAD_REQUEST }

            // Get user id and profile
            let userProfile = await(this.__getUserProfile({ id: _.get(requestObj, 'body.request.userId') }, authUserToken))

            // Parse the list of Geolocations (User > Orgs > Geolocations) from the response
            let targetList = []
            _.forEach(userProfile.organisations, function(userOrg) {
                if(userOrg.locationId) targetList.push(userOrg.locationId)
            });

            //handle emty target list
            // TODO: add this validation back when data starts becoming available
            // if (_.isEmpty(targetList)) return { count:1, announcements: [] }

            // Query announcements where target is listed Geolocations
            let query = {
                table: this.objectStoreRest.MODEL.ANNOUNCEMENT,
                query: {
                    // TODO: remove the below wildcard query and implement the commented specific query
                    // 'target.geo.ids': targetList
                    "wildcard" : { "target.geo.ids" : { "value" : "*" } },
                    "status": this.statusConstant.ACTIVE
                }
            }
            try {
                let data = await (new Promise((resolve, reject) => {
                    this.objectStoreRest.findObject(query)
                    .then((data) => {
                        if (!_.isObject(data)) {
                            reject({ msg: 'unable to fetch announcement inbox', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
                        } else {
                            resolve(data.data.content)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        reject({ msg: 'unable to fetch announcement inbox', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
                    })
                }))

                //Get read and received status and append to response
                let announcementIds = []
                _.forEach(data, (announcement, k) => {
                    announcementIds.push(announcement.id)
                    announcement[this.metricsActivityConstant.READ] = false
                    announcement[this.metricsActivityConstant.RECEIVED] = false
                })
                let metricsData = await(this.__getMetricsForInbox(announcementIds, userProfile.id))

                if (metricsData) {
                    _.forEach(metricsData, (metricsObj, k) => {
                        let announcementObj = _.find(data, {"id": metricsObj.announcementid})
                        announcementObj[metricsObj.activity] = true
                    })
                }

                return  {count:_.size(data), announcements: data}

            } catch(error) {
                throw { msg: 'unable to process your request', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
            }
        })
    }

    __getMetricsForInbox(announcementIds, userId) {
        return new Promise((resolve, reject) => {
        let query = {
            table: this.objectStoreRest.MODEL.METRICS,
            query: {
                "announcementid" : announcementIds,
                "userid": userId
            }
        }

        this.objectStoreRest.findObject(query)
        .then((data) => {
            if (!_.isObject(data)) {
                resolve(false)
            } else {
                let readData = []
                _.forEach(data.data.content, (metricsObj) => {
                    readData.push({'announcementid': metricsObj.announcementid, 'activity': metricsObj.activity})
                })
                resolve(readData)
            }
        })
        .catch((error) => {
            resolve(false)
        })


    })
        
    }


    /**
     * Get outbox of announcements for a given user
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    getUserOutbox(requestObj) {
        return new Promise((resolve, reject) => {

            // validate request
            let request = this.__validateOutboxRequest(requestObj)
            if (!request.isValid) throw { msg: request.error, statusCode: HttpStatus.BAD_REQUEST }

            // build query
            let query = {
                table: this.objectStoreRest.MODEL.ANNOUNCEMENT,
                query: {
                    'userid': _.get(requestObj, 'request.userId')
                }
            }
            let metrics_clone = undefined;

            // execute query and process response
            this.objectStoreRest.findObject(query)
            .then((data) => {
                if (!_.isObject(data)) {
                    reject({ msg: 'unable to fetch sent announcements', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
                } else {
                    this.getMetrics(_.map(data.data.content,"id"), query)
                        .then((metricsData) => {
                            let announcementCount = _.size(data.data);
                            let metrics = {};
                            let response = {count: announcementCount, announcements: data.data }
                             if (metricsData) {
                                _.map(response.announcements.content, (value, key) => {
                                      metrics = {read:0,received:0}
                                    _.forEach(metricsData, (v, k) => {
                                        if (response.announcements.content[key].id == k) {
                                            _.forEach(v[0].values, (ele, indec) => {
                                                if (ele.name === 'read') {
                                                    metrics.read = ele.count;
                                                }
                                                if (ele.name === 'received') {
                                                    metrics.received = ele.count;
                                                }
                                            });
                                            metrics_clone = _.clone(metrics);
                                            response.announcements.content[key]['metrics'] = metrics_clone;
                                        }
                                    });
                                });
                                resolve(response)
                            } else {
                                resolve(response);
                            }
                        })
                }
            })
            .catch((error) => {
                console.log(error)
                reject({ msg: 'unable to fetch sent announcements', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
            })
        })
    }

  /**
   * Validate the incoming request for creating an announcement
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  __validateOutboxRequest(requestObj) {
    let validation = Joi.validate(requestObj, Joi.object().keys({
      "request": Joi.object().keys({
        'userId': Joi.string().required()
      }).required()
    }), { abortEarly: false })

    if (validation.error != null) {
      let messages = []
      _.forEach(validation.error.details, (error, index) => {
        messages.push({ field: error.path[0], description: error.message })
      })
      return { error: messages, isValid: false }
    }
    return { isValid: true }
  }

  /**
   * Get a list of senders on whose behalf the user can send announcement
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */

  __getSenderList() {
      return async((requestObj) => {
          let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
          let userData = {}
          try {
              return await (new Promise((resolve, reject) => {
                  this.__getUserProfile({
                          id: _.get(requestObj, 'body.userid')
                      }, authUserToken)
                      .then((data) => {
                          if (!_.isObject(data)) {
                              reject({ msg: 'unable to fetch senderlist', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
                          } else {
                              userData[data.id] = data.firstName + " " + data.lastName
                              resolve(userData)
                          }
                      })
                      .catch((error) => {
                          reject(error)
                      })
              }))
          } catch (e) {
              throw {msg: 'Unable to fetch the senderlist', statusCode: HttpStatus.INTERNAL_SERVER_ERROR } }
      });
  }

    /**
     * Mark announcement(s) received for a given user
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    received(requestObj) {
        return this.__received()(requestObj)
    }

    __received(requestObj) {
        return async((requestObj) => {

            // validate request
            let request = this.__validateMetricsRequest(requestObj)
            if (!request.isValid) throw { msg: request.error, statusCode: HttpStatus.BAD_REQUEST }

            try {
                var metricsData = await (this.__createMetrics(requestObj.request, this.metricsActivityConstant.RECEIVED))
                return {metrics: metricsData.data}
            } catch (error) {
                throw { msg: 'unable to update status!', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
            }
            
        })      
    }

    /**
     * Mark announcement(s) read for a given user
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    read(requestObj) {
        return this.__read()(requestObj)
    }

    __read(requestObj) {
        return async((requestObj) => {

            // validate request
            let request = this.__validateMetricsRequest(requestObj)
            if (!request.isValid) throw { msg: request.error, statusCode: HttpStatus.BAD_REQUEST }

            try {
                var metricsData = await (this.__createMetrics(requestObj.request, this.metricsActivityConstant.READ))
                return {metrics: metricsData.data}
            } catch (error) {
                throw { msg: 'unable to update status!', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
            }
            
        })      
    }    

    /**
     * Validate the incoming request for creating a metrics
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    __validateMetricsRequest(requestObj) {
        let validation = Joi.validate(requestObj, Joi.object().keys({
            "request": Joi.object().keys({
                'userId': Joi.string().required(),
                'announcementId': Joi.string().required(),
                'channel': Joi.string().required()
            }).required()
        }), { abortEarly: false })

        if (validation.error != null) {
            let messages = []
            _.forEach(validation.error.details, (error, index) => {
                messages.push({ field: error.path[0], description: error.message })
            })
            return { error: messages, isValid: false }
        }
        return { isValid: true }
    }


    __createMetrics(requestObj, metricsActivity) {
        return new Promise((resolve, reject) => {
            // build query
            let metricsId = uuidv1()
            let query = {
                table: this.objectStoreRest.MODEL.METRICS,
                values: {
                    'id': metricsId,
                    'userid': requestObj.userId,
                    'announcementid': requestObj.announcementId,
                    'channel': requestObj.channel,
                    'activity': metricsActivity,
                    'createddate': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
                }
            }

            this.objectStoreRest.createObject(query)
            .then((data) => {
                if (!_.isObject(data)) {
                    reject({ msg: 'unable to update metrics' })
                } else {
                    resolve({ data: { id: metricsId } })
                }
            })
            .catch((error) => {
                reject({ msg: 'unable to update metrics' })
            })

        })
    }

    /**
     * Get the announcement data to duplicate for resending
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    getResend(requestObj) {
        return this.__getAnnouncementById(requestObj)
    }


    /**
     * Resend the edited announcement
     * @param  {[type]} requestObj [description]
     * @return {[type]}            [description]
     */
    resend(requestObj) {
        // TODO: duplicate file data??

        return this.__create()(requestObj)
    }





  httpService(options) {
      return new Promise((resolve, reject) => {
          if (!options) reject('options required!')
          options.headers = options.headers || this.getRequestHeader();
          webService(options, (error, response, body) => {
              if (error || response.statusCode >= 400) {
                  reject(error)
              } else {
                  resolve({response, body }) }
          })
      })
  }

  getRequestHeader(opt) {
    return {
      'x-device-id': 'x-device-id',
      'ts': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
      'x-consumer-id': envVariables.PORTAL_API_AUTH_TOKEN,
      'content-type': 'application/json',
      'accept': 'application/json',
      'x-authenticated-user-token': opt.xAuthUserToken || '',
      'Authorization': 'Bearer ' + envVariables.PORTAL_API_AUTH_TOKEN
    }
  }

  forEachPromise(items, fn, options, context) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item, options, context);
        });
    }, Promise.resolve());
  }

  sendNotification(item, options, context) {
      options.body.request.to = item;
      return new Promise((resolve, reject) => {
          context.httpService(options).then((data) => {
            resolve(data);
          }).catch((error) => {
              reject(error);
          })
      });
  }

   getMetrics(id, options){
    return this.__getMetrics()(id, options)
   }
  __getMetrics() {
  return async((id, options) =>{
    let result = {};
    let query = {table: this.objectStoreRest.MODEL.METRICS, query: {'announcementid': ""},facets:[{"activity":null}] }
    var instance = this;
        var awaitData = undefined;
        for (let i = 0; i < id.length; i++) {
            await (new Promise((resolve, reject) => {
                query.query.announcementid = id[i];
                instance.objectStoreRest.findObject(query)
                    .then((data) => {
                        if (!data.data.content) {
                            resolve({msg: 'unable to fetch metrics', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
                            } else {
                              result[data.data.content[0].announcementid] = data.data.facets;
                              resolve(data.data);
                        }
                    });
            }));
            if (i == id.length - 1) {
                return result;
            }
        }
    })
  }
 }
module.exports = new AnnouncementController()
