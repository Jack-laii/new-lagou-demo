<template>
  <div class="resource-list">
    <!-- 使用 Card 组件 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 使用 Form 组件：行内表单 -->
        <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline"
          ref="form"
          :disabled="isLoading"
        >
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name" placeholder="资源名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url" placeholder="资源路径" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="资源分类" clearable>
              <!-- 遍历资源分类资源列表 -->
              <el-option
                v-for="item in resourceCategories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="onReset"
            >重置</el-button>
            <el-button
              type="primary"
              @click="onSubmit"
            >查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 使用 Table 组件 -->
      <el-table
        :data="resources"
        style="width: 100%; margin-bottom: 20px;"
        v-loading="isLoading"
      >
        <el-table-column
          type="index"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <!-- 使用过滤器，需要结合作用域插槽获取数据 -->
        <el-table-column
          label="添加时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 20, 30]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getResourcePages, getResourceCategories } from '@/services/resource'

export default {
  name: 'ResourceList',
  data () {
    return {
      // 存储资源列表数据
      resources: [],
      form: {
        // 当前页号
        current: 1,
        // 每页显示条数
        size: 10,
        // 资源分类ID
        categoryId: '',
        // 资源名称
        name: '',
        // 资源路径
        url: ''
      },
      // 数据总条数
      totalCount: 0,
      // 村塾资源分类信息
      resourceCategories: [],
      isLoading: false
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    // 重置筛选功能
    onReset () {
      this.$refs.form.resetFields()
    },
    // 提交筛选功能
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    // 加载资源分类
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    // 每页显示条数改变时触发
    handleSizeChange (val) {
      this.form.size = val
      // 当前页还原
      this.form.current = 1
      this.loadResources()
    },
    // 页号改变时触发
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResources()
    },
    // 加载数据
    async loadResources () {
      // 开启数据加载动态效果
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
        // 关闭数据加载动态效果
        this.isLoading = false
      }
    },
    handleEdit () {

    },
    handleDelete () {

    }
  },
  filters: {
    // 日期过滤器
    dateFormat (date) {
      date = new Date(date)
      return `
        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  }
}
</script>

<style lang="scss" scoped></style>
