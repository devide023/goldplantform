import request from '@/utils/request.js';
export default {
    saveorgtree: (data) => {
        return request({
            url: '/organize/add',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        })
    },
    getorgtree: (data) => {
        return request({
            url: '/organize/list',
            method: 'post',
            data: data
        })
    },
    getnodeinfo: (data) => {
        return request({
            url: '/organize/find',
            method: 'get',
            params: data
        })
    },
    updatenodeinfo: (data) => {
        return request({
            url: '/organize/edit',
            method: 'post',
            data: data
        })
    },
    subnodes: (data) => {
        return request({
            url: '/organize/curentnodes',
            method: 'get',
            params: data
        });
    }
}
