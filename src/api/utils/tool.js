export default {
    baseurl: process.env.VUE_APP_BASEURL,
    descartFn: function (nums) {
        let t = nums.reduce((a, b) => {
            let m = a.map(item => {
                return b.map(i => {
                    return [i].concat(item)
                })
            })
            let f = m.reduce((c, d) => {
                return c.concat(d)
            }, [])
            return f
        })
        return t
    },
    unique: function unique(arr) {
        let hash = [];
        for (var i = 0; i < arr.length; i++) {
            if (hash.indexOf(arr[i]) === -1) {
                hash.push(arr[i]);
            }
        }
        return hash;
    }

}