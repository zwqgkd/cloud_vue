<template>


  <div class="header" style="display:flex; justify-content: space-between">
    <el-input v-model="searchStr" placeholder="输入查询内容" style="width: 200px"></el-input>
    <el-button type="primary" @click="handleAdd">添加用户</el-button>
  </div>

  <el-table :data="filterUserData" style="width: 100%" :default-sort="{ prop: 'formatCreateTime', order: 'descending' }">
    <el-table-column type="index" label="序号" width="60"/>
    <el-table-column prop="company" label="所属公司" width="100"/>
    <el-table-column prop="department" label="所属部门" width="100"/>
    <el-table-column prop="name" label="姓名" width="100"/>
    <el-table-column prop="role" label="角色" width="100"/>
    <el-table-column prop="email" label="邮箱号" width="180"/>
    <el-table-column prop="phone" label="手机号" width="180"/>
    <el-table-column prop="formatCreateTime" label="创建时间" width="180" sortable/>
    <el-table-column prop="formatUpdateTime" label="修改时间" width="180"/>
    <el-table-column label="操作" width="250">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
          编辑
        </el-button>
        <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
        >
          删除
        </el-button>
        <el-button
            size="small"
            type="warning"
            @click="resetPassword(scope.$index, scope.row)"
        >
          重置密码
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div style="margin-top: 6px;">

    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />


  </div>


  <el-dialog style="padding: 30px" v-model="userDialogVisible" :title="userFormIsEditing?'编辑用户':'添加用户'" width="500">
    <el-form :model="userForm" ref="userFormRef">
      <el-form-item prop="name" required label="姓名" :label-width="userFormLabelWidth">
        <el-input :disabled="userFormIsEditing" v-model="userForm.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="email" required label="邮箱" :label-width="userFormLabelWidth">
        <el-input :disabled="userFormIsEditing" v-model="userForm.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="company" required label="公司" :label-width="userFormLabelWidth">
        <el-input v-model="userForm.company" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="department" required label="部门" :label-width="userFormLabelWidth">
        <el-input v-model="userForm.department" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="phone" label="手机号" :label-width="userFormLabelWidth">
        <el-input v-model="userForm.phone" autocomplete="off"/>
      </el-form-item>

      <el-form-item prop="roleId" required label="角色" :label-width="userFormLabelWidth">
        <el-select v-model="userForm.roleId" placeholder="选择角色">
          <el-option label="超级管理员" :value="1"/>
          <el-option label="管理员" :value="2"/>
          <el-option label="普通用户" :value="3"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="userFormConfirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>


</template>


<script>
import axiosInstance from "@/js/axios.js"
import {ElMessage, ElMessageBox} from "element-plus";


export default {
  data() {
    return {
      userData: [],
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页显式的条目
      total: 0,  // 数据总数

      searchStr: "", // 表格过滤字符串


      userDialogVisible: false,

      userForm: {
        id: "", // 仅在更新用户信息时使用
        name: "",
        password: "", // 仅在重置密码时使用
        email: "",
        company: "",
        department: "",
        phone: "",
        roleId: "",
      },

      userFormLabelWidth: '60px',

      userFormIsEditing: false, // 用于判断userForm是否处于编辑状态，目前只有编辑和添加两种状态

    };
  },
  computed: {
    filterUserData(){
      return this.userData.filter(
          (item) =>
              !this.searchStr ||
              item.name.toLowerCase().includes(this.searchStr.toLowerCase()) ||
              item.email.toLowerCase().includes(this.searchStr.toLowerCase()) ||
              item.company.toLowerCase().includes(this.searchStr.toLowerCase()) ||
              item.department.toLowerCase().includes(this.searchStr.toLowerCase()) ||
              item.phone.toLowerCase().includes(this.searchStr.toLowerCase())
      )
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      axiosInstance.get("/user/page?currentPage=1&pageSize=10", {}).then((resp) => {
        let data = resp.data;
        this.userData = data.data
        this.total = data.size;
      })
    },
    handleEdit(index, row) {

      this.userDialogVisible = true;
      this.userFormIsEditing = true;


      this.userForm.id = row.id;
      this.userForm.name = row.name;
      this.userForm.email = row.email;
      this.userForm.department = row.department;
      this.userForm.company = row.company;
      this.userForm.phone = row.phone;
      this.userForm.roleId = row.roleId;


      // this.userFormIsEditing = false;
    },

    userFormConfirm() {
      if (this.userFormIsEditing) {
        this.userEditDialogConfirm()
      } else {
        this.userAddDialogConfirm();
      }
    },

    // 数据总数发生变化，重新请求后端
    handleDelete(index, row) {

      ElMessageBox.confirm(
          '是否对当前选中的用户进行删除操作？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
          }
      )
          .then(() => {
            axiosInstance.get("/user/delete/" + row.id)
                .then((resp) => {
                  let data = resp.data;
                  if (data.success) {
                    ElMessage({
                      message: data.msg,
                      type: 'success',
                    })
                    this.initData();
                  }
                })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '操作取消',
            })
          })


    },

    handleAdd() {
      this.userDialogVisible = true;
      this.userFormIsEditing = false;
      // 防止第一次访问userFormRef时还未初始化
      if (this.$refs.userFormRef !== undefined) {
        this.$refs.userFormRef.resetFields();
      }
    },

    userEditDialogConfirm() {

      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          this.userDialogVisible = false;

          axiosInstance
              .post("/user/update", this.userForm)
              .then((resp) => {
                let data = resp.data
                if (data.success) {
                  ElMessage({
                    message: data.msg,
                    type: 'success',
                  })
                  this.initData();
                }
              })

        } else {
          return false;
        }
      })
    },

    userAddDialogConfirm() {

      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          this.userDialogVisible = false;
          axiosInstance
              .post("/user/add", this.userForm)
              .then((resp) => {
                let data = resp.data
                if (data.success) {
                  ElMessage({
                    message: data.msg,
                    type: 'success',
                  })
                  this.initData();
                }
              })

        } else {
          return false;
        }
      })

    },

    resetPassword(index, row) {

      ElMessageBox.confirm(
          '是否对当前选中的用户进行重置密码？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {

            axiosInstance.get("/user/resetPassword/"+row.id)
                .then((resp) => {
                  let data = resp.data;
                  if (data.success) {
                    ElMessage({
                      message: data.msg,
                      type: 'success',
                    })
                    this.initData();
                  }
                })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '操作取消',
            })
          })


    },
    handleSizeChange() {

    },
    handleCurrentChange() {

    },

  }
};


</script>

<style scoped>
/* User List */
.user-list {
  font-family: Arial, sans-serif;
  width: 80%;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table th,
table td {
  text-align: left;
  padding: 8px;
  border: 1px solid #ddd;
}

table th {
  background-color: #f2f2f2;
}

/* Header */
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Rows */
tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}

/* Cells */
td {
  vertical-align: middle;
}

/* Responsive */
@media screen and (max-width: 600px) {
  table {
    font-size: 14px;
  }
}
</style>