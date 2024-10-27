<template>
  <div class="common-layout">
    <el-container class="el-container">
      <el-aside class="login-aside"></el-aside>
      <el-main class="login-right">
        <div class="user-login">
          <div class="user-login-top">

            <img src="./images/login_logo.png" class="logo">
            <div>
              <span style="font-size: 2rem; color: azure"
              >格力算法管理平台</span
              >
            </div>
          </div>
          <div class="mini-account">
            <input
                v-model="email"
                placeholder="请输入邮箱"
                style="
                border-radius: 4px;
                width: 50%;
                height: 30px;
                margin-top: 30px;
              "
            />
          </div>
          <div class="mini-password">
            <input
                type="password"
                v-model="password"
                placeholder="请输入密码"
                style="
                border-radius: 4px;
                width: 50%;
                height: 30px;
                margin-top: 8px;
              "
            />
          </div>
          <!-- 登录页面跳转到主页面 -->
          <div>
            <button
                data-v-659840cf=""
                type="submit"
                class="login-btn"
                @click="login"
                style="
                width: 50%;
                margin-top: 30px;
                height: 40px;
                background-color: rgb(53, 28, 177);
              "
            >
              <span style="color: aliceblue">登 录</span>
            </button>
          </div>
        </div>


      </el-main>
    </el-container>
  </div>
</template>

<script src="./js/login.js"></script>

<style scoped>


.el-container {
  height: 100vh;
}

.user-login {
  position: relative;
  top: 20%;
  text-align: center;
}

.login-aside {
  background-image: url(./images/login_left.png);
  background-repeat: no-repeat;

  width: 50%;
}

.login-right {
  background-color: rgb(6, 6, 53);
  width: 50%;
}
</style>
