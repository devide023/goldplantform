import request from '@/utils/request';

export function list(data) {
    return request({
        method: 'post',
        url: '/organize/list',
        data: data
    });
}