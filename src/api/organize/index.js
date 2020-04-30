import request from '@/utils/request.js';
export default {
    list: function (data) {
        return request({
            method: 'post',
            url: '/organize/list',
            data: data
        });
    },
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
    },
    editednode: (data) => {
        return request({
            method: 'post',
            url: '/organize/edited_node',
            data: data
        });
    },
    get_orgnode_users: (data) => {
        return request({
            url: '/organize/getorgusers',
            method: 'get',
            params: data
        });
    }
}
