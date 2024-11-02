<template>

  <div class="header" style="display:flex; justify-content: space-between">
    <el-input v-model="searchStr" placeholder="输入查询内容" style="width: 200px"></el-input>
    <el-button type="primary" @click="handleAdd">添加算子</el-button>
  </div>

  <el-table :data="filterOperatorData" style="width: 100%"
            :default-sort="{ prop: 'formatUpdateTime', order: 'descending' }">
    <el-table-column type="index" label="序号" width="60"/>
    <el-table-column prop="uuid" label="算子ID" width="100"/>
    <el-table-column prop="name" label="算子名称" width="100"/>
    <el-table-column prop="groupName" label="算子分类" width="100"/>
    <el-table-column prop="description" label="算子描述" width="100"/>
    <el-table-column prop="status" label="算子状态"
                     :filters="[
                         { text: '未审核', value: '未审核' },
                         { text: '已发布', value: '已发布' },
                         { text: '已驳回', value: '已驳回'}
                      ]"
                     :filter-method="filterStatus"
                     filter-placement="bottom-end"

                     width="100"/>
    <el-table-column prop="softwareVersion" label="算子版本号" width="100"/>
    <el-table-column prop="ownerName" label="所属人" width="100"/>
    <el-table-column prop="formatUpdateTime" label="更新时间" width="180" sortable/>
    <el-table-column label="操作" width="300">
      <template #default="scope">

        <el-button text size="small" @click="handleExamine(scope.$index, scope.row)">
          审核
        </el-button>

        <el-button text size="small" @click="handleUpdate(scope.$index, scope.row)">
          更新
        </el-button>
        <el-button
            text
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
        >
          删除
        </el-button>
        <el-button
            text
            size="small"
            type="warning"
            @click="showDetail(scope.$index, scope.row)"
        >
          详情
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


  <el-dialog style="padding: 30px" v-model="operatorDialogVisible" title="添加算子" width="500">
    <el-form :model="operatorForm" ref="operatorFormRef">
      <el-form-item prop="name" required label="算子名称" :label-width="operatorFormLabelWidth">
        <el-input :disabled="operatorFormIsEditing" v-model="operatorForm.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="uuid" required label="算子ID" :label-width="operatorFormLabelWidth">
        <el-input :disabled="operatorFormIsEditing" v-model="operatorForm.uuid" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="description" required label="算子描述" :label-width="operatorFormLabelWidth">
        <el-input v-model="operatorForm.description" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="softwareVersion" required label="软件大版本" :label-width="operatorFormLabelWidth">
        <el-input v-model="operatorForm.softwareVersion" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="ddlPath" label="DDL路径" :label-width="operatorFormLabelWidth">
        <el-input v-model="operatorForm.dllPath" autocomplete="off"/>
      </el-form-item>

      <el-form-item prop="groupId" required label="算子类别" :label-width="operatorFormLabelWidth">
        <el-select v-model="operatorForm.groupId" placeholder="选择类别">

          <el-option v-for="group in operatorGroup" :label="group.name" :value="group.id"/>

        </el-select>
      </el-form-item>

      <el-form-item prop="dllPath" label="DDL文件" :label-width="operatorFormLabelWidth">
        <el-input disabled placeholder="请上传算子DDL文件" autocomplete="off"/>
        <el-upload
            v-model:file-list="operatorForm.dllFileList"
            ref="dllUploadRef"
            action="localhost:8081/common/upload"
            limit="1"
            :auto-upload="false"
            :on-exceed="handleExceedDll"
            accept=".dll"
        >
          <el-button type="primary">选择文件</el-button>
        </el-upload>


      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="operatorDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="operatorFormConfirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog style="padding: 30px" v-model="operatorMiniDialogVisible" title="添加算子" width="500">
    <el-form ref="operatorMiniFormRef">
      <el-form-item required label="新算子" :label-width="operatorFormLabelWidth">
        <el-input disabled placeholder="选择JSON文件" autocomplete="off"/>
        <el-upload
            v-model:file-list="jsonFileForm.fileList"
            ref="jsonUploadRef"
            action="localhost:8081/common/upload"
            limit="1"
            :auto-upload="false"

            :on-exceed="handleExceed"
            :on-change="onChange"
            accept=".json"
        >
          <el-button type="primary">选择文件</el-button>

          <template #tip>
            <div class="el-upload__tip">
              仅支持扩展名:.json文件
            </div>
          </template>
        </el-upload>
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="operatorMiniDialogVisible = false">取消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="uploadJson">
          上传文件
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>


<script>
import axiosInstance from "@/js/axios.js"
import {ElMessage, ElMessageBox, genFileId} from "element-plus";


export default {
  data() {
    return {
      operatorData: [],
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页显式的条目
      total: 0,  // 数据总数

      searchStr: "", // 表格过滤字符串

      operatorGroup: [],  // 从后台获取的算子组信息

      operatorDialogVisible: false,

      operatorMiniDialogVisible: false,

      jsonFileForm: {
        fileList: [],
      },

      btnLoading: false,


      operatorForm: {
        id: "", // 仅在更新用户信息时使用
        name: "",
        uuid: "", // 仅在重置密码时使用
        groupId: "",
        groupName: "",
        description: "",
        dllPath: "",
        jsonPath:"",
        softwareVersion: "",
        ownerId: "",
        ownerName: "",
        dllFileList:[],
      },


      operatorFormLabelWidth: '100px',

      operatorFormIsEditing: false, // 用于判断operatorForm是否处于编辑状态，目前只有编辑和添加两种状态

    };
  },
  computed: {
    filterOperatorData() {
      return this.operatorData.filter(
          (item) =>
              !this.searchStr ||
              item.name.toLowerCase().includes(this.searchStr.toLowerCase()) ||
              item.ownerName.toLowerCase().includes(this.searchStr.toLowerCase()) ||
              item.groupName.toLowerCase().includes(this.searchStr.toLowerCase())
      )
    }
  },
  mounted() {
    this.initTableData();
    this.initOperatorGroupData();
  },
  methods: {
    initTableData() {
      axiosInstance.get("/operator/page?currentPage=1&pageSize=10", {}).then((resp) => {
        let data = resp.data;
        this.operatorData = data.data
        this.total = data.size;
      })
    },

    initOperatorGroupData() {
      axiosInstance.get("/operator/listGroupName")
          .then((resp) => {
            let data = resp.data;
            this.operatorGroup = data.data
          })
    },

    filterStatus(value, row, column) {
      return row.status === value;
    },

    onChange(file, fileList) {
      this.btnLoading = true;

      const reader = new FileReader();
      let that = this;
      reader.onload = function (e) {
        // e.target.result 包含了文件的内容
        let jsonContent = JSON.parse(e.target.result)

        if (jsonContent["name"]) {
          console.log(jsonContent["name"])
          that.operatorForm.name = jsonContent["name"];
        }
        if (jsonContent["superName"]) {
          console.log(jsonContent["superName"])
          that.operatorForm.groupName = jsonContent["superName"];
          let group = that.operatorGroup.find(group => group["name"] === jsonContent["superName"]);
          that.operatorForm.groupId = group["id"];
        }

        if (jsonContent["dllPath"]) {
          that.operatorForm.dllPath = jsonContent["dllPath"];
        }
        that.operatorForm.dllFileList = [];

        that.btnLoading = false;
        ElMessage({
          type: "info",
          message: "JSON解析成功"
        });
      };
      reader.readAsText(file.raw)

    },


    // 只能上传一个文件
    handleExceed(files, uploadFiles) {
      this.$refs.jsonUploadRef.clearFiles()
      let file = files[0]
      file.uid = genFileId()
      this.$refs.jsonUploadRef.handleStart(file)
    },

    handleExceedDll(files){
      this.$refs.dllUploadRef.clearFiles();
      let file = files[0]
      file.uid = genFileId()
      this.$refs.dllUploadRef.handleStart(file)
    },


    handleUpdate(index, row) {

      this.operatorDialogVisible = true;
      this.operatorFormIsEditing = true;


      this.operatorForm.id = row.id;
      this.operatorForm.name = row.name;
      this.operatorForm.email = row.email;
      this.operatorForm.department = row.department;
      this.operatorForm.company = row.company;
      this.operatorForm.phone = row.phone;
      this.operatorForm.roleId = row.roleId;


      // this.operatorFormIsEditing = false;
    },


    uploadDLL() {



    },

    uploadJson() {

      if (this.jsonFileForm.fileList.length === 0) {
        ElMessage({
          type: "info",
          message: "请选择JSON文件"
        })
        return;
      }

      //
      let formData = new FormData();
      formData.append("file", this.jsonFileForm.fileList[0].raw);
      axiosInstance.post("/common/upload", formData)
          .then((resp) => {
            let data = resp.data;
            if (data.success) {
              this.operatorForm.jsonPath = data.msg;

              ElMessage({
                type:"success",
                message:"JSON文件上传服务器成功"
              });
            }
          })

      this.operatorMiniDialogVisible = false;
      this.operatorDialogVisible = true;
    },

    handleExamine(index, row) {
    },

    operatorFormConfirm() {
      if (this.operatorFormIsEditing) {
        this.operatorEditDialogConfirm()
      } else {
        this.operatorAddDialogConfirm();
      }
    },

    // 数据总数发生变化，重新请求后端
    handleDelete(index, row) {

      ElMessageBox.confirm(
          '是否删除【' + row.name + "】",
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
          }
      )
          .then(() => {
            axiosInstance.get("/operator/delete/" + row.id)
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
      this.operatorMiniDialogVisible = true;
      this.operatorFormIsEditing = false;
      // 防止第一次访问operatorFormRef时还未初始化
      if (this.$refs.operatorFormRef !== undefined) {
        this.$refs.operatorFormRef.resetFields();
      }
      this.jsonFileForm.fileList = [];
    },


    operatorEditDialogConfirm() {

      this.$refs.operatorFormRef.validate((valid) => {
        if (valid) {
          this.operatorDialogVisible = false;

          axiosInstance
              .post("/operator/update", this.operatorForm)
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

    operatorAddDialogConfirm() {

      if (this.operatorForm.dllFileList.length === 0){
        ElMessage({
          type: "info",
          message: "请选择DLL文件"
        })
        return;
      }


      this.$refs.operatorFormRef.validate((valid) => {
        if (valid) {
          this.operatorDialogVisible = false;
          //
          if (sessionStorage.getItem("userInfo")) {
            this.operatorForm.ownerId = JSON.parse(sessionStorage.getItem("userInfo")).id+"";
          } else {
            this.operatorForm.ownerId = 1;
          }

          axiosInstance
              .post("/operator/add", this.operatorForm)
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

          let formData = new FormData();
          formData.append("file", this.operatorForm.dllFileList[0].raw);
          axiosInstance.post("/common/upload", formData)
              .then((resp) => {
                let data = resp.data;
                if (data.success) {
                  ElMessage({
                    type:"success",
                    message:"DLL文件上传服务器成功"
                  });
                }
              })

          this.operatorDialogVisible = false;

        } else {
          return false;
        }
      })

    },

    showDetail(index, row) {

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