import request from '@/utils/request';

export default {
    shiplist: (data) => {
        return request({
            url: '/hotel/shiplist',
            method: 'get',
            params: data
        });
    },
    roomtypelist: (data) => {
        return request({
            url: '/hotel/roomtypelist',
            method: 'get',
            params: data
        });
    },
    addroomtype: (data) => {
        return request({
            url: '/hotel/addroomtype',
            method: 'post',
            data: data
        });
    },
    editroomtype: (data) => {
        return request({
            url: '/hotel/editroomtype',
            method: 'post',
            data: data
        });
    },
    book_room_list: (data) => {
        return request({
            url: '/hotel/bookroomlist',
            method: 'post',
            data: data
        });
    },
    add_book_room: (data) => {
        return request({
            url: '/hotel/bookroom',
            method: 'post',
            data: data
        });
    },
    meallist: (data) => {
        return request({
            url: '/hotel/meallist',
            method: 'get',
            params: data
        });
    },
    addmeal: (data) => {
        return request({
            url: '/hotel/addmeal',
            method: 'post',
            data: data
        });
    },
    editmeal: (data) => {
        return request({
            url: '/hotel/editmeal',
            method: 'post',
            data: data
        });
    },
    mealbooklist: (data) => {
        return request({
            url: '/hotel/mealbooklist',
            method: 'get',
            params: data
        });
    },
    addmealbook: (data) => {
        return request({
            url: '/hotel/addmealbook',
            method: 'post',
            data: data
        });
    }
}