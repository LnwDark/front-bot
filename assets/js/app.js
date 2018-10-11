let app = new Vue({
  el: "#app",
  data() {
    return {
      title: "ลงทะเบียน",
      userId: "",
      profile: [],
      checkNotify: false,
      send: false,
      tel: "",
      LoadPage: false,
      name: [],
      CitizenID: true,
      PhoneValidate: true,
      CodeValidate: true,
      notFound: false,
      input: {
        cardId: null,
        codeStudent: null,
        phone: null
      },
      dataNotyfy: [],
      URL_SERVER: ""
    };
  },
  created() {
    // let vm = this;
    // let URL = vm.URL_SERVER + `/api/v1/get-notify/` + vm.userId;
    // axios
    //   .get(URL)
    //   .then(function (response) {
    //     vm.dataNotyfy.push(...response.data);
    //     if (response.status === 200) vm.LoadPage = true;
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  },
  computed: {
    checkClassBtn() {
      if (
        !this.checkAll ||
        !this.CitizenID ||
        !this.CodeValidate ||
        !this.PhoneValidate
      ) {
        return "btn-outline-success";
      } else {
        return "";
      }
    },
    checkAll() {
      if (this.input.cardId && this.input.cardId && this.input.phone) {
        return true;
      } else {
        return false;
      }
    },
    checkBtn() {
      if (this.tel.length < 10) {
        return "btn-outline-success";
      } else {
        return "btn-success";
      }
    }
  },
  methods: {
    reload() {
      location.reload();
    },
    loadLiff() {
      let vm = this;
      window.onload = function (e) {
        liff.init(function (data) {
          vm.initializeApp(data);
        });
      };
    },
    initializeApp: function (data) {
      let vm = this;
      //vm.name.push(data);
      if (data.context.userId != undefined) {
        vm.userId = data.context.userId;
      } else {
        // location.reload();
      }
      // console.log(userId);
    },
    sendNumber() {
      let URL = `${this.URL_SERVER}/api/v1/phone`;
      let that = this;
      that.send = true;
      axios
        .post(URL, {
          mobile: that.tel,
          user_id: that.userId
        })
        .then(function (response) {
          if (response.status == 200) {
            liff.closeWindow();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validateThaiCitizenID(id) {
      console.log(id);
      let that = this;
      if (id.length != 13 || id.charAt(0).match(/[09]/))
        return (that.CitizenID = false);
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(id.charAt(i)) * (13 - i);
      }
      if ((11 - (sum % 11)) % 10 != parseInt(id.charAt(12))) {
        return (that.CitizenID = false);
      }
      return (that.CitizenID = true);
    },
    codeStudent(inputCode) {
      let that = this;
      if (inputCode == "") {
        return (that.CodeValidate = false);
      } else {
        return (that.CodeValidate = true);
      }
    },
    phonenumber(inputPhone) {
      let phoneno = /^\d{10}$/;
      let that = this;
      if (inputPhone.match(phoneno) && inputPhone.length === 10) {
        that.PhoneValidate = true;
        console.log(1, inputPhone);
      } else {
        that.PhoneValidate = false;
        console.log(2);
      }
    },
    savePost: function () {
      let URL = `${this.URL_SERVER}/api/v1/register`;
      let that = this;
      axios
        .post(URL, {
          data: that.input,
          userId: that.userId
        })
        .then(function (response) {
          console.log(response);
          if (response.status == 200) {
            if (response.data.status === "ok") {
              liff.closeWindow();
              that.notFound = false;
            } else {
              that.notFound = true;
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    turnON(item) {
      console.log(item.status)
     // item.status = true;
      if (item.status) {
        let URL =this.URL_SERVER + `/api/v1/update/` + item.id + "/" + item.status;
        axios.get(URL).then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      }else{
        let URL =this.URL_SERVER + `/api/v1/update/` + item.id + "/" + !item.status;
        axios.get(URL).then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      }

    },
    turnOff(item) {
      item.status = false;
      let URL =
        this.URL_SERVER + `/api/v1/update/` + item.id + "/" + item.status;
      console.log(URL);
      axios
        .get(URL)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    initializeNotify: function (data) {
      let vm = this;
      vm.userId = data.context.userId;
      let URL = vm.URL_SERVER + `/api/v1/get-notify/` + vm.userId;
      axios
        .get(URL)
        .then(function (response) {
          vm.dataNotyfy.push(...response.data);
          //if(response.status ===200) vm.LoadPage=true;
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
      vm.name.push(data.context);
    }

  }
});

window.onload = function (e) {
  liff.init(function (data) {
    app.initializeApp(data);
    app.initializeNotify(data)
  });
};