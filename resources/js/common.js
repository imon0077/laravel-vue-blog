import {mapGetters} from 'vuex'
export default{
    data(){
        return {

        }
    },
    methods:{
        async callApi(method, url, dataObj){
            try {
                return await axios({
                    method: method,
                    url: url,
                    data: dataObj
                });
            } catch (e) {
                return e.response
            }
        },

        i (desc, title="Hey!") {
            this.$Notice.info({
                title: title,
                desc: desc
            });
        },
        s (desc="Data has been added successfully.", title="Great!") {
            this.$Notice.success({
                title: title,
                desc: desc
            });
        },
        w (desc, title="Oops!") {
            this.$Notice.warning({
                title: title,
                desc: desc
            });
        },
        e (desc, title="Oops!") {
            this.$Notice.error({
                title: title,
                desc: desc
            });
        },
        swr (desc="Something went wrong, Please try again.", title="Oops!") {
            this.$Notice.error({
                title: title,
                desc: desc
            });
        },

        checkUserPermission(){
            console.log(this.$route.name)
        }

    },

    computed: {
        ...mapGetters({
            'userPermission'    : 'getUserPermission'
        }),

        isReadPermitted(){
            this.checkUserPermission()
            //console.log('user permission', this.userPermission)
        },
        isWritePermitted(){

        },
        isUpdatePermitted(){

        },
        isDeletePermitted(){

        },
    },
}