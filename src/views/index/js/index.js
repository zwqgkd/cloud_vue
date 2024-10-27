import axiosInstance from "@/js/axios.js";
import router from "@/routes/index.js";
import {Fold, Message, MessageBox, Setting} from "@element-plus/icons-vue";

export default {
    components: {Fold, Setting, MessageBox, Message},

    data() {
        return {
            isCollapse: false,
            asideWidth: '200px'

        };
    },


    methods: {
        handleCollapse(){
            // this.isCollapse = !this.isCollapse;
            // this.asideWidth = this.isCollapse? '64px':'200px'

        }
    },
};
