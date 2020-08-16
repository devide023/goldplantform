import request from '@/utils/request';

export default {
    shiplist: (data) => {
        return request({
            url: '/hotel/shiplist',
            method: 'get',
            params: data
        });
    },
    allshiplist: (data) => {
        return request({
            url: '/hotel/allshiplist',
            method: 'get',
            params: data
        });
    },
    enabelship: (data) => {
        return request({
            url: '/hotel/enableship',
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
    agentlist: (data) => {
        return request({
            url: '/hotel/agentlist',
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
    add_ship_roomtype: (data) => {
        return request({
            url: '/hotel/add_shiproomtype',
            method: 'post',
            data: data
        });
    },
    get_ship_roomtype_list: (data) => {
        return request({
            url: '/hotel/shiproomtypelist',
            method: 'get',
            params: data
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
    book_room_ok: (data) => {
        return request({
            url: '/hotel/bookroom_ok',
            method: 'post',
            data: data
        });
    },
    book_room_unaudit: (data) => {
        return request({
            url: '/hotel/bookroom_unaudit',
            method: 'post',
            data: data
        });
    },
    edit_book_room: (data) => {
        return request({
            url: '/hotel/edit_bookroom',
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
    },
    editmealbook: (data) => {
        return request({
            url: '/hotel/editmealbook',
            method: 'post',
            data: data
        });
    },
    book_meal_ok: (data) => {
        return request({
            url: '/hotel/bookmeal_ok',
            method: 'post',
            data: data
        });
    },
    book_meal_unaudit: (data) => {
        return request({
            url: '/hotel/bookmeal_unaudit',
            method: 'post',
            data: data
        });
    }
}