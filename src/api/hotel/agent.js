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
    },
    placedatelist: (data) => {
        return request({
            url: '/hotel/agentplace_date_list',
            method: 'get',
            params: data
        });
    },
    add_placedate: (data) => {
        return request({
            url: '/hotel/agentplace_date',
            method: 'post',
            data: data
        });
    },
    edit_placedate: (data) => {
        return request({
            url: '/hotel/edit_agentplace_date',
            method: 'post',
            data: data
        });
    },
    placedate_status: (data) => {
        return request({
            url: '/hotel/agentplace_date_status',
            method: 'post',
            data: data
        });
    }
}