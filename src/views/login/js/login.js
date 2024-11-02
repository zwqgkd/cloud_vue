import axios from "axios";

import axiosInstance from "@/js/axios.js";

import router from "@/routes/index.js";
import {ElMessage} from "element-plus";
import ClipboardJS from "clipboard";

export default {

    data() {
        return {
            email: "", // 用户输入的账号
            password: "", // 用户输入的密码


        };
    },


    methods: {
        /**
         * @brief 登录逻辑控制
         * */
        login() {
            axiosInstance
                .post("/user/login", {
                    //发送post请求
                    email: this.email,
                    password: this.password,
                })
                .then((resp) => {
                    let data = resp.data;
                    if (data.success){
                        let userAuth = data.data
                        const userInfo = {
                            id: userAuth.id,
                            email: userAuth.email,
                            role:userAuth.role
                        };
                        sessionStorage.setItem("token", userAuth.token)
                        sessionStorage.setItem("userInfo", JSON.stringify(userInfo)); // 保存数据
                        router.push("/index")
                        // this.$message({
                        //     message: "登录成功",
                        //     type: "success",
                        //     duration: 1500,
                        // });

                    }else{
                        // this.$message({
                        //     message: data.msg,
                        //     type: "error",
                        //     duration: 1500,
                        // });
                    }


                })
                .catch((error) => {
                    this.$message.error("服务器错误");
                });
        },
    },
};
