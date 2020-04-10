import request from '@/utils/request';

export function list(data) {
    return request({
        method: 'post',
        url: '/role/list',
        data: data
    });
}