<template>
  <div class="header" style="display:flex; justify-content: space-between">
    <el-input v-model="searchStr" placeholder="输入查询内容" style="width: 200px"></el-input>
    <el-button type="primary" @click="handleAdd">添加角色</el-button>
  </div>

  <el-table :data="filterRoleData" style="width: 100%"
            :default-sort="{ prop: 'formatCreateTime', order: 'descending' }">
    <el-table-column type="index" label="序号" width="60"/>
    <el-table-column prop="role" label="角色名称" width="100"/>
    <el-table-column prop="createUser" label="创建人" width="100"/>
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

  <el-dialog style="padding: 30px" v-model="roleDialogVisible" title="添加角色" width="500">
    <el-form :model="roleForm" ref="roleFormRef">
      <el-form-item prop="role" required label="角色名称" :label-width="roleFormLabelWidth">
        <el-input :disabled="roleFormIsEditing" v-model="roleForm.role" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="permissionIds" required label="功能权限" :label-width="roleFormLabelWidth">
        <el-tree-select
            v-model="roleForm.permissionIds"
            :data="permissionData"
            multiple
            :render-after-expand="false"
            show-checkbox
            style="width: 240px"
        />
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="roleFormConfirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import axiosInstance from "@/js/axios.js";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  data() {
    return {
      roleData: [],
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页显式的条目
      total: 0,  // 数据总数

      searchStr: "", // 表格过滤字符串


      roleDialogVisible: false,

      roleForm: {
        id: "", // 仅在更新用户信息时使用
        role: "",
        createUser: "",
        permissionIds:[] // 用户实际选择的权限列表
      },

      permissionData:[], // 所有权限列表


      roleFormLabelWidth: '120px',


      roleFormIsEditing: false, // 用于判断userForm是否处于编辑状态，目前只有编辑和添加两种状态

    };
  },
  computed: {
    filterRoleData() {
      return this.roleData.filter(
          (item) =>
              !this.searchStr ||
              item.role.toLowerCase().includes(this.searchStr.toLowerCase()) ||
              item.createUser.toLowerCase().includes(this.searchStr.toLowerCase())
      )
    }
  },
  mounted() {
    this.initTableData();
    this.initAndFormatPermission();
  },
  methods: {
    initTableData() {
      axiosInstance.get("/role/page?currentPage=1&pageSize=10", {}).then((resp) => {
        let data = resp.data;
        this.roleData = data.data
        this.total = data.size;
      })
    },
    initAndFormatPermission(){
      axiosInstance.get("/role/permission")
          .then((resp)=>{
            let data = resp.data;
            let permissionArray = data.data;

            let key = []; // 权限类别名
            let formData = {};
            permissionArray.forEach((permission)=>{
              if (!formData[permission.groupName]){
                formData[permission.groupName] = [];
                key.push(permission.groupName);
              }
              let child = { "value": permission.id, "label": permission.name};
              formData[permission.groupName].push(child);

            });

            key.forEach((k)=>{
              this.permissionData.push({"label": k, "children": formData[k]})
            });

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

    roleFormConfirm() {
      if (this.roleFormIsEditing) {
        this.roleEditDialogConfirm()
      } else {
        this.roleAddDialogConfirm();
      }
    },

    // 数据总数发生变化，重新请求后端
    handleDelete(index, row) {

      ElMessageBox.confirm(
          '是否对当前选中的角色进行删除操作？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
          }
      )
          .then(() => {
            axiosInstance.delete("/role/delete/" + row.id)
                .then((resp) => {
                  let data = resp.data;
                  if (data.success) {
                    ElMessage({
                      message: data.msg,
                      type: 'success',
                    })
                    this.initTableData();
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
      this.roleDialogVisible = true;
      this.roleFormIsEditing = false;
      // 防止第一次访问userFormRef时还未初始化
      if (this.$refs.roleFormRef !== undefined) {
        this.$refs.roleFormRef.resetFields();
      }
    },

    roleEditDialogConfirm() {

      this.$refs.roleFormRef.validate((valid) => {
        if (valid) {
          this.roleDialogVisible = false;

          // todo
          axiosInstance
              .post("/role/updatePermission", this.roleForm)
              .then((resp) => {
                let data = resp.data
                if (data.success) {
                  ElMessage({
                    message: data.msg,
                    type: 'success',
                  })
                  this.initTableData();
                }
              })

        } else {
          return false;
        }
      })
    },

    roleAddDialogConfirm() {

      this.$refs.roleFormRef.validate((valid) => {
        if (valid) {
          this.roleDialogVisible = false;
          axiosInstance
              .post("/role/add", this.roleForm)
              .then((resp) => {
                let data = resp.data
                if (data.success) {
                  ElMessage({
                    message: data.msg,
                    type: 'success',
                  })
                  this.initTableData();
                }
              })

        } else {
          return false;
        }
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

</style>