require('./index.scss')

new view({
  el: '#list',
  template: require('./index.html'),
  data: {
    list: []
  },
  events: {
    'click #add' (e) {
      var name = document.getElementById('name').value;
      var des = document.getElementById('des').value;
      if (name && des) {
        this.addList({
          "name": name,
          "des": des
        });
      }
    },
    'click #upload' (e) {
      var files = document.getElementById('files').files;
      var formData = new FormData();
      for (var i = 0; i < files.length; i++) {
        formData.append(i, files[i]);
      }
      this.uploadFiles(formData);
    }
  },
  methods: {
    getList() {
      $.ajax({
        type: "GET",
        url: "//localhost:8888/",
        success: (res) => {
          if (res) {
            this.list = res;
            this.$repaint();
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    },
    addList(data) {
      $.ajax({
        type: "GET",
        url: "//localhost:8888/add",
        data,
        success: (res) => {
          if (res.code == 0) {
            this.getList();
          } else {
            alert(res.message)
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    },
    uploadFiles(data) {
      $.ajax({
        url: '//localhost:8888/upload',
        type: 'POST',
        dataType: 'json',
        data,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: (res) => {
          alert(res.message);
          if(res.code == 0){
            this.getList();
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  },
  mounted() {
    this.getList();
  }
})