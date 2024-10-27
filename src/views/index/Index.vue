
<template>

  <div >
    <el-container>
      <el-aside  :width="asideWidth" style=" min-height: 100vh; background-color: #001529">
        <div style="height: 60px; color: white; display: flex; align-items: center; ">
          <img src="@/assets/images/login_logo.png" style="width: 40px; height: 40px; margin-left: 20px"/>
        </div>

        <el-menu router :default-active="this.$router.path" :collapse="isCollapse" :collapse-transition="false" style="border: none;background-color:#001529;" text-color="rgba(255, 255, 255, 0.65)" active-text-color="#ffd04b" >
          <el-menu-item index="/scheme-manage">
           方案管理
          </el-menu-item>
          <el-menu-item index="/operator-manage">算子管理</el-menu-item>
          <el-menu-item index="/license-manage">License管理</el-menu-item>
          <el-menu-item index="/user-manage">用户管理</el-menu-item>
          <el-menu-item index="/role-manage">角色管理</el-menu-item>
        </el-menu>

      </el-aside>

      <el-container>
        <el-header style="background-color: #001529">
          <el-icon style="color: white; margin-top: 20px;" @click="handleCollapse">
            <Fold/>
          </el-icon>
          <span style="color: white; margin-left: 20px">视觉算子管理系统</span>


          <div style="flex: 1; display: flex; align-items: center; justify-content: flex-end" >
            <el-dropdown>
              下拉菜单
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>

        <el-main style="padding: 10px">

          <el-card style="height: 40px; margin-bottom: 6px;">

          </el-card>

          <el-card >
            <router-view></router-view>
          </el-card>

        </el-main>

      </el-container>
    </el-container>
  </div>

</template>


<script src="./js/index.js">

</script>


<style scoped>
.el-menu--inline .el-menu-item{
  background-color: #000c17 !important;
}

.el-menu-item:hover, .el-submenu__title:hover{
  color: #fff !important;
}

.el-submenu__title:hover i{
  color: #fff !important;
}

.el-menu-item.is-active{
  background-color: #40a9ff !important;
  border-radius: 5px !important;
  margin: 5px !important;
  color: white;
}

.el-menu-item{
  height: 50px !important;
  line-height: 50px !important;
  margin: 5px !important;
}

.el-submenu__title{
  height: 50px !important;
  line-height: 50px !important;
}

.el-aside{
  box-shadow: 5px 0 6px rgba(0, 21, 41, .35);
}
.el-header{
  box-shadow: 5px 0 6px rgba(0, 21, 41, .35);
  display: flex;
  align-items: center;
}
</style>