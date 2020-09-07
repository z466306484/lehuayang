import 'fetch-polyfill'
import 'whatwg-fetch'
import 'es6-promise'
import 'isomorphic-fetch'
import '@babel/polyfill'
import 'fetch-detector'
import 'fetch-ie8'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {message} from 'ant-design-vue'

NProgress.configure({showSpinner: false})
require('es6-promise').polyfill()

/**
 * post,get方法
 * @type {{post: string, get: string}}
 */
let http = {
    post: '',
    get: '',
    getFile: '',
    postFile: ''
}

/**
 * 字符处理
 */
const querystring = require('querystring')

/**
 * 解析json
 * @param response
 * @returns {Promise.<any>}
 */
let parseJSON = (response) => {
    return response.json()
}

/**
 * 添加token请求头
 * @param json
 * @returns {{Accept: string, 'Content-Type': string}}
 */
let addTokenToHeaders = (json) => {
    if (json == null || json === 'undefined') {
        json = true
    }
    return {
        'Accept': 'application/json',
        'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded',
    }
}

/**
 * 添加请求头
 * @returns {{Accept: string}}
 */
let addTokenToFileHeaders = () => {
    return {
        'Accept': 'application/json',
    }
}
/**
 * 处理返回的response
 * @param response
 * @returns {*}
 */
let disposeResponse = (response) => {
    return response
}
/**
 * 处理相关逻辑错误
 * @param res
 * @returns {*}
 */
let disposeError = (res) => {
    return res
}
/**
 * 处理请求相关异常
 * @param error
 */
let disposeException = (error) => {
    message.warning('服务器繁忙...')
}
/**
 * fetch.get方法
 * @param url
 * @param params
 * @returns {Promise}
 */
http.get = (url, params, np) => {
    if (np == null || np === 'undefined') {
        np = true
    }
    if (params) {
        let paramsArray = []
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    return new Promise((resolve, reject) => {
        if (np) {
            NProgress.start()
        }
        fetch(url, {
            method: 'GET',
            headers: addTokenToHeaders(),
            mode: 'cors'
        }).then(disposeResponse).then(parseJSON).then(disposeError)
            .then(result => {
                if (np) {
                    NProgress.done()
                }
                resolve(result)
            }).catch(error => {
            if (np) {
                NProgress.done()
            }
            disposeException(error)
            reject(error)
        })
    })
}

/**
 * fetch post请求
 * @param url
 * @param params
 * @param json
 * @returns {Promise}
 */
http.post = (url, params, json, np, text) => {
    if (np == null || np === 'undefined') {
        np = true
    }
    if (json == null || json === 'undefined') {
        json = true
    }
    return new Promise((resolve, reject) => {
        if (np) {
            NProgress.start()
        }
        fetch(url, {
            method: 'POST',
            headers: addTokenToHeaders(json),
            body: json ? text ? params : JSON.stringify(params) : querystring.stringify(params),
            mode: 'cors'
        }).then(disposeResponse).then(parseJSON).then(disposeError)
            .then(result => {
                if (np) {
                    NProgress.done()
                }
                resolve(result)
            }).catch(error => {
            if (np) {
                NProgress.done()
            }
            disposeException(error)
            reject(error)
        })
    })
}
/**
 *
 * @param url
 * @param params
 * @returns {Promise<any>}
 */
http.getFile = (url, params) => {
    if (params) {
        let paramsArray = []
        //拼接参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    return new Promise(((resolve, reject) => {
            fetch(url, {
                method: 'GET',
                headers: addTokenToFileHeaders(),
                mode: 'cors'
            }).then(result => {
                result.blob().then(blob => {
                    if (result.headers.get('Content-Disposition')) {
                        let fileName = result.headers.get('Content-Disposition').split('=')[1]
                        if (window.navigator.msSaveOrOpenBlob) {
                            navigator.msSaveBlob(blob, fileName)//IE10+以上兼容
                        } else {
                            let url = window.URL.createObjectURL(blob)
                            let a = document.createElement('a')
                            a.href = url
                            a.download = decodeURIComponent(fileName)
                            document.body.appendChild(a)
                            a.click()
                            setTimeout(function () {
                                document.body.removeChild(a)
                                window.URL.revokeObjectURL(url)
                            }, 1000)
                        }
                    }
                })
            })
                .catch(error => {
                    disposeException(error)
                    reject(error)
                })
        })
    )
}
/**
 * 文件上传
 * @param url
 * @param params
 * @returns {Promise<any>}
 */
http.postFile = (url, params, np) => {
    if (np == null || np === 'undefined') {
        np = true
    }
    if (np) {
        NProgress.start()
    }
    return new Promise(((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: addTokenToFileHeaders(),
                body: params,
                mode: 'cors'
            }).then(parseJSON)
                .then(result => {
                    if (np) {
                        NProgress.done()
                    }
                    resolve(result)
                })
                .catch(error => {
                    if (np) {
                        NProgress.done()
                    }
                    disposeException(error)
                    reject(error)
                })
        })
    )
}

export default http
