<template>
  <div class="layout">
    <Layout>
      <Header>
        <div class="layout-logo"></div>
        <div class="layout-out">
          <Button type="warning">OUT</Button>
        </div>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu :active-name="activeName" theme="light" width="auto" @on-select="changeMenu">
            <MenuItem name="index">
              <Icon type="home"></Icon>
              <span>首页</span>
            </MenuItem>
            <MenuItem name="menu">
              <Icon type="android-menu"></Icon>
              <span>菜单维护</span>
            </MenuItem>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>{{activeName}}</BreadcrumbItem>
          </Breadcrumb>
          <Content :style="{padding: '15px', minHeight: '280px', background: '#fff'}">
            <router-view/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  methods:{
    changeMenu(name){
      this.$router.push({name:name});
    }
  },
  computed: {
    activeName(){
      return this.$route.name
    }
  }
};
</script>
<style scoped>
.layout,
.ivu-layout {
  height: 100%;
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-out {
  float: right;
}
</style>