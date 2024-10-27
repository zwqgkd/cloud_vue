<template>
  <div>
    <div class="header">
      <el-container>
        <el-header>
          <el-row>
            <el-col :span="4">
              <div class="logo">
                <span>云端资源管理系统</span>
              </div>
            </el-col>
            <el-col :span="20">
              <el-menu class="menu" mode="horizontal">
                <el-menu-item index="1" @click="returnto">
                  <span>返回流程图界面</span>
                </el-menu-item>
                <el-menu-item index="2" @click="fullScreen">
                  <span>全屏</span>
                </el-menu-item>
                <el-sub-menu index="3">
                  <template #title>
                    <span v-if="username">{{ username }}</span>
                  </template>
                  <el-menu-item index="3-1" @click="logout">
                    <i class="el-icon-switch-button"></i>
                    <span>退出</span>
                  </el-menu-item>
                </el-sub-menu>
              </el-menu>
            </el-col>
          </el-row>
        </el-header>
      </el-container>
    </div>

    <!-- <el-container class="main"> -->
    <el-tabs v-model="currentTabName" @tab-click="handleClick" style="margin:20px;">
      <el-tab-pane v-permission="'上传'" label="文件上传" name="文件上传"
        ><UploadFile
      /></el-tab-pane>
      <el-tab-pane v-permission="'下载'" label="创建license" name="创建license"
        ><CreateLicense :options="options"
      /></el-tab-pane>
      <el-tab-pane v-permission="'下载'" label="license管理" name="license管理"
        ><LicenseManage
      /></el-tab-pane>
      <el-tab-pane v-permission="'下载'" label="下载文件" name="下载文件"
        ><DownloadFile :username="username"
      /></el-tab-pane>
      <el-tab-pane v-permission="'删除'" label="用户管理" name="用户管理"
        ><UserManage
      /></el-tab-pane>
    </el-tabs>
    <!-- <el-header>
        <div class="btnDiv">
          <el-button
            v-permission="'上传'"
            type="primary"
            size="small"
            @click="showUpload"
            >文件上传</el-button
          >
          <el-button
            v-permission="'下载'"
            type="primary"
            size="small"
            @click="showlicense"
            >创建license</el-button
          >
          <el-button
            v-permission="'下载'"
            type="primary"
            size="small"
            @click="showlicenseManage"
            >license管理</el-button
          >
          <el-button
            v-permission="'下载'"
            type="primary"
            size="small"
            @click="showDownload"
            >下载文件</el-button
          >
          <el-button
            v-permission="'删除'"
            type="primary"
            size="small"
            @click="showUserManage"
            >用户管理</el-button
          >
        </div>
      </el-header> -->

    <!-- <el-main>
        <hr />
        <component
          :is="component"
          :options="options"
          :username="username"
        ></component> -->

    <!--<div class="buttons">
          <el-button v-permission="'下载'" type="primary" size="small" icon="el-icon-download" @click="openLicenseDialog"  id="dirDilaog">创建License</el-button>
          <el-button v-permission="'下载'" type="primary" size="small" icon="el-icon-download" @click="getCheckedNodes"  id="dirDilaog">下载文件</el-button>
          <el-button v-permission="'下载'" type="primary" size="small" icon="el-icon-download" @click="getCheckedNodesJson"  id="dirDilaog">下载json文件</el-button>
          <el-button v-permission="'删除'" type="primary" size="small" icon="el-icon-download" @click="getCheckedNodesDelete"  id="dirDilaog">删除文件</el-button>
          <el-button type="primary" size="small" icon="el-icon-download" @click="resetChecked">reset</el-button>
        </div>-->

    <!--<el-dialog v-model="showLicenseDialog" title="创建License" @close="resetLicenseForm">
          <el-form ref="licenseForm" :model="licenseForm" label-width="100px">
            <el-form-item >
              <el-input v-model="licenseForm.num" placeholder="请输入License的num"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getCheckedLicense">创建License</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>-->
    <!-- <div class="file-list">
            <ul>
            <li v-for="algorithm in algorithms" :key="algorithm.id">
              <el-dropdown>
                <el-button type="primary">
                  {{ algorithm.procedurename }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="downloadAlgorithm(algorithm.procedurename)">下载文件</el-dropdown-item>
                    <el-dropdown-item @click="downloadjson(algorithm.procedurename)">下载json文件</el-dropdown-item>
                    <el-dropdown-item @click="deleteFile(algorithm.id)">删除文件</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </li>
            </ul>
            
          </div>-->
    <!-- </el-main> -->
    <!-- 这是一个注释 
        <div class="m-4">
          <el-cascader v-model="value" :options="options" @change="handleChange" :show-all-levels="false">
            <template v-slot="{ node, data }">
              <span v-if="node.level !== options.length">{{ node.label }}</span>
              <el-button v-else @click="handleButtonClick(data)">{{ node.label }}</el-button>
            </template>
          </el-cascader>
        </div>-->
    <!-- </el-container> -->
    <Test/>
  </div>
</template>

<script>
import axiosInstance from "axios";
import { saveAs } from "file-saver";
import jsonData from "../json/newOperatorLib.json";
import { ref } from "vue";
import DownloadFile from "../components/DownloadFile.vue";
import CreateLicense from "../components/CreateLicense.vue";
import UploadFile from "../components/UploadFile.vue";
import UserManage from "./user/UserManage.vue";
import LicenseManage from "../components/LicenseManage.vue";
import router from "../routes/index";

const value = ref([]); //创建ref对象

const handleChange = (value) => {
  console.log(value);
};

const handleButtonClick = (data) => {
  // Handle button click event
  console.log("Button clicked:", data);
};

const treeRef = ref(null);

export default {
  //指定默认输出
  components: {
    DownloadFile,
    UploadFile,
    CreateLicense,
    LicenseManage,
    UserManage,
  },

  data() {
    //数据部分

    return {
      currentTabName: "文件上传",
      showLicenseDialog: false,
      licenseForm: {
        num: "",
      },
      value: [], // 存储级联选择器的值
      handleChange,
      handleButtonClick,
      optionsData: jsonData,
      fileAttributes: [],
      showFileAttributesDialog: false,
      lfProperties: {
        name: "",
        type: "",
        text: "",
        label: "",
      },
      properties: {
        dllPath: "",
        modelID: "",
        inPara: [
          {
            varName: "",
            varType: "",
            // Add more properties for inPara as needed
          },
        ],
        outPara: [
          {
            varName: "",
            varType: "",
            // Add more properties for outPara as needed
          },
        ],
      },
      file: null,
      algorithmType: null,
      algorithms: [],
      userRole: "",
      username: "",
      customAlgorithm: false,
      customAlgorithmType: "",
    };
  },

  computed: {
    options() {
      return this.transformOptions(this.optionsData);
    },
  },

  created() {
    this.username = JSON.parse(sessionStorage.getItem("userInfo")).username;

    this.userRole = JSON.parse(sessionStorage.getItem("userInfo")).role;

  },

  mounted() {
    axiosInstance
      .get("/algorithms")
      .then((response) => {
        this.algorithms = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },

  watch: {
    algorithmType(val) {
      if (val === "__CUSTOM__") {
        this.customAlgorithm = true;
      }
    },
  },

  methods: {
    returnto() {
      router.push("/main");
    },

    createLicense() {
      // 在这里处理创建License的逻辑，使用 this.licenseForm.num 获取输入的License的num
      // 然后可以调用相应的方法将License创建到数据库中
      // 完成后关闭对话框
      this.showLicenseDialog = false;
    },

    transformOptions(data) {
      const options = [];

      // 遍历每个分类
      for (const category in data) {
        const categoryData = {
          id: category,
          label: category,
          children: [],
        };

        // 遍历每个模型
        for (const model of data[category]) {
          const modelData = {
            id: model.lfProperties.name,
            label: model.lfProperties.text,
            children: [],
          };

          // 遍历每个参数
          for (const parameter of model.properties.models) {
            console.log(parameter.modelName);
            modelData.children.push({
              id: parameter.modelName,
              label: parameter.modelName,
            });
          }

          categoryData.children.push(modelData);
        }

        options.push(categoryData);
      }
      console.log(options);
      return options;
    },

    addInParaField() {
      this.properties.inPara.push({
        varName: "",
        varType: "",
      });
    },
    saveFileAttributes() {
      // 首先进行表单验证，确保必填字段已填写完整
      if (this.validateForm()) {
        // 执行保存逻辑，将文件属性数据提交到后端或进行其他操作
        this.fileAttributes = {
          lfProperties: this.lfProperties,
          properties: this.properties,
        };
      }
    },

    validateForm() {
      // 表单验证逻辑，检查必填字段是否填写完整
      // 可以根据需要进行具体的验证规则和错误提示
      if (
        !this.lfProperties.name ||
        !this.lfProperties.type ||
        !this.lfProperties.text ||
        !this.lfProperties.label
      ) {
        // 如果lfProperties字段有任何一个必填字段为空，则返回false表示验证失败
        console.log("lfProperties字段必填项未填写完整");
        return false;
      }

      for (const parameter of this.properties.inPara) {
        if (!parameter.varName || !parameter.varType) {
          // 如果inPara字段的任何一个必填字段为空，则返回false表示验证失败
          console.log("inPara字段必填项未填写完整");
          return false;
        }
      }

      // 所有必填字段都填写完整，返回true表示验证通过
      return true;
    },

    applyCustomAlgorithm() {
      // 判断自定义算法类型是否为空
      if (this.customAlgorithmType.trim() === "") {
        this.$message.error("自定义算法类型不能为空");
        return;
      }

      // 将 customAlgorithmType 设为 algorithmType
      this.algorithmType = this.customAlgorithmType;
      this.customAlgorithm = false;
      this.customAlgorithmType = "";
    },

    fullScreen() {},
    logout() {
      axiosInstance
        .get("/logout")
        .then((response) => {
          this.$message({
            message: "退出成功",
            type: "success",
            duration: 1500,
          });
          sessionStorage.clear();
        })
        .catch((error) => {
          console.error(error);
        });
      //sessionStorage.clear();
    },

    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    /*uploadFile() {
      localStorage.setItem('file','abc123')
      const fileData = localStorage.getItem('file');
      // 将文件数据转换为Blob对象
      const blob = new Blob([fileData], { type: 'application/octet-stream' });
      // 创建File对象，并将其赋值给this.file
      this.file = new File([blob], 'File.txt');
      const formData = new FormData();
      var algorithmType = this.algorithmType;
      formData.append('file', this.file);
      formData.append('algorithmType', algorithmType)

      // 发起文件上传请求
      axiosInstance.post('/upload', formData)
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    },*/

    uploadFile() {
      // 执行保存逻辑，将文件属性数据提交到后端或进行其他操作

      const formData = new FormData();
      var algorithmType = this.algorithmType;
      const fileAttributesString = JSON.stringify(this.fileAttributes);
      formData.append("file", this.file);
      formData.append("algorithmType", algorithmType);
      formData.append("fileAttributes", fileAttributesString);

      // 发起文件上传请求
      axiosInstance
        .post("/upload", formData)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    downloadFile() {
      var fileName = this.file.name; // 要下载的文件名
      console.log(fileName);

      // 发起文件下载请求
      axiosInstance
        .get(`/download/${fileName}`)
        .then((response) => {
          console.log(response.data);
          const blob = new Blob([response.data], { type: "text/plain" });

          // 使用 FileSaver.js 进行文件下载
          saveAs(blob, "text_file.txt");
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Helvetica Neue", sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
}

/* 头部样式 */
.header {
  height: 80px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.logo img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.menu {
  display: flex;
  justify-content: flex-end;
  height: 100%;
}

.menu .el-menu-item:nth-child(2) {
  margin-left: 20px; /* Adjust the margin as per your preference */
}

/* 主体样式 */
.main {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.btnDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.file-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.file-list li {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.file-list li:last-child {
  border-bottom: none;
}

.file-list li span {
  margin-left: 10px;
  font-weight: bold;
  color: #333;
}

.file-list li .el-icon-delete {
  margin-left: auto;
  cursor: pointer;
}

.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}

.file-upload button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.file-upload button:hover {
  background-color: #0056b3;
}

.file-download button {
  padding: 8px 16px;
  background-color: #17a2b8;
  color: #fff;
  border: none;
  cursor: pointer;
}

.file-download button:hover {
  background-color: #117a8b;
}

.disabled {
  opacity: 0.5; /* Adjust the opacity to visually indicate disabled state */
  cursor: not-allowed; /* Change cursor to not-allowed when disabled */
}
</style>
