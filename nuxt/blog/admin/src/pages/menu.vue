<template>
  <Table border :columns="columns7" :data="data6"></Table>
</template>
<script>
export default {
  data() {
    return {
      columns7: [
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
                      this.edit(params.index);
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
                      this.remove(params.index);
                    }
                  }
                },
                "Delete"
              )
            ]);
          }
        }
      ],
      data6: [
        {
          name: "HOME",
          pv: 18,
          uv: 20
        }
      ]
    };
  },
  methods: {
    edit(index) {},
    remove(index) {}
  }
};
</script>
