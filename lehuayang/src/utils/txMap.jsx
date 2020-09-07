import 'es6-promise'
import '@babel/polyfill'
import {message} from 'ant-design-vue'

require('es6-promise').polyfill()

const MAP_KEY = 'TMSBZ-SNQYK-GU7JN-AYHVU-CTUA6-3CBM7'
const KEY_NAME = '乐活ZUI华阳小程序'
let txMap = {
    addMap: '',
    addMarker: '',
    getMyLocation: ''
}
/**
 *添加地图
 * @param container 地图容器id
 * @param longitude 中心经度
 * @param latitude 中心维度
 * @param zoom 缩放级别
 */
txMap.addMap = (container, longitude, latitude, zoom) => {
    return new qq.maps.Map(document.getElementById(container), {
        center: new qq.maps.LatLng(longitude, latitude),
        zoom: zoom
    });
}
/**
 * 添加标注获取标注坐标
 * @param data 其他标注对象 data所需数据结构{
                    map: null,
                    longitude: null,
                    latitude: null,
                    marker: null
                }
 *
 */
txMap.addMarker = (data) => {
    qq.maps.event.addListener(data.map, 'click', function (event) {
        let latLng = event.latLng,
            lat = latLng.getLat().toFixed(5),
            lng = latLng.getLng().toFixed(5);
        data.longitude = lng
        data.latitude = lat
        let marker = new qq.maps.Marker({
            position: latLng,
            map: data.map
        });
        if (data.marker) {
            data.marker.setMap(null);
        }
        data.marker = marker
        qq.maps.event.addListener(data.map, 'click', function (event) {
            marker.setMap(null);
        });
    });
}
/**
 * 获取定位地址并标记
 * @param data 其他标注对象 data所需数据结构{
                    map: null,
                    longitude: null,
                    latitude: null,
                    marker: null
                }
 *
 */
txMap.getMyLocation = (data) => {
    let geolocation = new qq.maps.Geolocation(MAP_KEY, KEY_NAME);
    geolocation.getIpLocation((position) => {
        data.longitude = position.lat
        data.latitude = position.lng
        setMap(data)
    }, () => {
        message.warning('获取位置信息失败请重新获取！')
    });
}
let setMap = (data) => {
    if (data.marker) {
        data.marker.setMap(null);
    }
    data.map.setZoom(20)
    let myLatlng = new qq.maps.LatLng(data.longitude, data.latitude)
    data.map.setCenter(myLatlng)
    let marker = new qq.maps.Marker({
        position: myLatlng,
        map: data.map,
    });
    data.marker = marker
}
export default txMap