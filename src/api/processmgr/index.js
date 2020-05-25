import request from '@/utils/request';

export default {
    list: (data) => {
        return request({
            url: '/process/list',
            method: 'post',
            data: data
        });
    },
    addprocess: (data) => {
        return request({
            url: '/process/add',
            method: 'post',
            data: data
        });
    }
}