import request from '@/utils/request';

export default {
    agent_placelist: (data) => {
        return request({
            url: '/hotel/agent_place_list',
            method: 'get',
            params: data
        });
    },
    addplace: (data) => {
        return request({
            url: '/hotel/add_agentplace',
            method: 'post',
            data: data
        });
    },
    editplace: (data) => {
        return request({
            url: '/hotel/edit_agentplace',
            method: 'post',
            data: data
        });
    }
}