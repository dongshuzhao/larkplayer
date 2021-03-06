/**
 * @file 标准化用户传入的 source 参数
 * @author YuHui<yuhui06@baidu.com>
 * @version 1.0 | YuHui<yuhui06@baidu.com> | 2017/12/14 | initial
 */

import {isPlain} from './obj';
import MIMETypeMap from './mime-type-map';

/**
 * @const
 * 匹配 url 最后一个 . 后面的字符串
 */
const MIME_TYPE_REG = /\.([\w]+)$/;

/**
 * 根据 src 字符串获取视频类型
 *
 * @param {string} src 链接地址
 * @return {string|undefined} MIMEType 文件类型
 */
function getMIMEType(src) {
    let MIMEType = '';
    if (typeof src === 'string') {
        const matchResult = src.match(MIME_TYPE_REG);
        if (Array.isArray(matchResult)) {
            MIMEType = matchResult[1];
        }
    }

    return MIMETypeMap[MIMEType];
}


/**
 * 标准化单个 source 对象
 *
 * @param {Object} singleSource 传入的 source 对象
 * @param {string} singleSource.src 视频链接
 * @param {string=} singleSource.type 可选，视频类型，若不填则自动根据视频链接的后缀生成
 * @return {Object} singleSource 标准化后的 source 对象
 */
function nomalizeSingleSource(singleSource) {
    if (!isPlain(singleSource)) {
        throw new TypeError('SingleSource should be an Object');
        return;
    }

    if (typeof singleSource.src !== 'string') {
        throw new TypeError('SingleSource.src should be a string');
        return;
    }

    if (singleSource.hasOwnProperty('type') && typeof singleSource.type !== 'string') {
        throw new TypeError('SingleSource.type should be a string');
        return;
    }


    if (!singleSource.type) {
        singleSource.type = getMIMEType(singleSource.src);
    }

    return singleSource;
}

/**
 * 标准化 source
 *
 * @param {Object|Array} source 要添加到 video 标签里的 source，可以是单个的对象，也可以是包含多个对象的数组
 * @return {Array} 标准化后的 source
 */
export default function nomalizeSource(source) {
    if (isPlain(source)) {
        return [nomalizeSingleSource(source)];
    } else if (Array.isArray(source)) {
        return source.map(value => nomalizeSingleSource(value));
    } else {
        throw new TypeError('Source should be an Object or an Array which contains Object');
    }
}