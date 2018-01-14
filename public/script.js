// console.log(Vue);
var PRICE = 9.99;
var LOAD_NUM = 5;



new Vue({
  el: '#app',
  data: {
    total: 0,
    // items: [],
    items: [
      { id: 1, title: 'Item 1', price: 10},
      { id: 2, title: 'Item 2', price: 15},
      { id: 3, title: 'Item 3', price: 20.50},
    ],
    results: [],
    cart: [],
    search: "brasil",
    lastSearch: "",
    loading: false,
    price: PRICE
  },
  computed: {
    noMoreItems: function() {
      return this.items.length === this.results.length && this.results.length > 0;
    },
  },
  methods: {

    appendItems: function() {
      console.log("append items now")
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function() {
      if (this.search.length) {
        this.items = [];
        this.loading = true;

        // axios.get('/search/'.concat(this.search)).then((res) => {
        //   console.log(res);
        //   // this.items = [];
        //   console.log(this.items)
        //   this.items = res.data;
        // this.lastSearch = this.search;
        // })
        this.$http.get('/search/'.concat(this.search)).then(function(res) {
          console.log(res);
          this.results = res.data;
          // this.items = res.data.slice(0, LOAD_NUM);
          this.appendItems();
          this.lastSearch = this.search;
          this.loading = false;
        })
      }
    },
    addItem: function(index) {
      var item = this.items[index];
      // this.total += item.price;
      this.total += this.price;
      var found = false;
      for (var i=0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          this.cart[i].qty++;
          found = true;
          break;
        }
      }
      if (!found){
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: this.price, //item.price
        });
      }
    },
    inc: function(item) {
      item.qty++;
      this.total += item.price;
    },
    dec: function(item) {
      item.qty--;
      this.total -= item.price;
      if (item.qty <= 0) {
        console.log("remove item from cart")
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  filters: {
    currency: function(price) {

      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function () {
    console.log("mounted life cycle hook triggered");
    this.onSubmit();
    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      console.log('Entered viewport')
      vueInstance.appendItems();

    })
  }
});
