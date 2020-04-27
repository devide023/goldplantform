import request from '@/utils/request.js';
export default {
    saveorgtree: (data) => {
        return request({
            url: '/organize/saveallorg',
            method: 'post',
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
    },
    all_tree_nodes: (data) => {
        return request({
            method: 'get',
            url: '/organize/alltree',
            params: data
        });
    },
    createnode: (data) => {
        return request({
            method: 'get',
            url: '/organize/create_node',
            params: data
        });
    },
    removenode: (data) => {
        return request({
            method: 'get',
            url: '/organize/remove_node',
            params: data
        });
    }
}
