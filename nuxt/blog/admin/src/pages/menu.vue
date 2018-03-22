<template>
  <div>
    <div class="oprate">
      <Button type="info" class="add-btn" @click="add">Add</Button>
    </div>
    <Table 
      border 
      :columns="columns" 
      :data="datas">
    </Table>
    <Modal
      v-model="modalShow"
      :title="formData.id?'menu edit':'menu add'"
      :loading="true"
      :mask-closable="false"
      :closable="false"
      @on-ok="ok">
      <Input v-model="value" placeholder="Enter menu name..." />
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      modalShow: false,
      formData: {},
      columns: [
        {
          title: "NAME",
          key: "name"
        },
        {
          title: "PV",
          key: "pv"
        },
        {
          title: "UV",
          key: "uv"
        },
        {
          title: "Action",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.edit(params.row);
                    }
                  }
                },
                "Edit"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                },
                "Delete"
              )
            ]);
          }
        }
      ],
      datas: [
        {
          id: 1,
          name: "HOME",
          pv: 18,
          uv: 20
        }
      ]
    };
  },
  methods: {
    add() {
      this.formData.id = 0;
      this.modalShow = true;
    },
    edit(row) {
      this.formData.id = row.id;
      this.modalShow = true;
    },
    remove(row) {
      this.formData.id = row.id;
      this.$Modal.confirm({
        title: 'menu delete',
        content: '<p>warning! this menu will be delete</p>',
        onOk: () => {
          this.$Message.info('Clicked ok');
        }
      });
    },
    ok() {
      setTimeout(() => {
        this.modalShow = false;
      }, 2000);
    }
  }
};
</script>
<style lang="scss" scoped>
.oprate{
  height: 40px;
  line-height: 40px;
}
.add-btn{
  float: right;
}
</style>
