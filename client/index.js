Vue.component('modal-vue', {
    data () {
        return {
            username: '',
            password: ''
        }
    },
    template: 
    `
    <div class="modal" tabindex="-1" role="dialog" id="modal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
           username:
            <input v-model="username" placeholder="username">
            <br>
            password:  
            <input v-model="password" placeholder="password">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="register(username, password)">create account</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    `,
    methods: {
        register ( username, password ) {
            let userObj = {
                username,
                password
            }
            console.log(userObj)
            axios.post('http://localhost:3000/users/register', userObj )
            .then(( result => {
                swal('success', 'succesfully registered your account', 'success')
            }))
            .catch((err => {
                swal('oops', 'oopss something went wrong', 'warning')
            }))
        }
    }
})


Vue.component('item-vue', {
    props: ['item'],
    template: 
    `
    <div class="card w-100">
      <img class="card-img-top" src="https://images.pexels.com/photos/485294/pexels-photo-485294.jpeg?auto=compress&cs=tinysrgb&h=350" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">{{item.name}}</h5>
        <ul class="card-text">
          <li>
           price: {{item.price}}
          </li>
          <li>
           stock: {{item.stock}}
          </li>
          <li>
           tags: {{item.tags}}
          </li>
        </ul>
      </div>
    </div>
    `
})


Vue.component('navbar-vue',{
    data () {
        return {
            username: '',
            password:'',
            query:''
        }
    },
    template: 
    `<nav class="navbar navbar-light bg-light justify-content-between">
      <a class="navbar-brand" @click="refresh">Richardson</a>
      <form class="form-inline">
        <input class="form-control mr-sm-2" v-model="username" placeholder="username" aria-label="username">
        <input class="form-control mr-sm-2" v-model="password" placeholder="password" aria-label="password">
        <button class="btn btn-outline-primary my-2 my-sm-0" @click.prevent="login(username, password)" type="submit">Login</button> ||
        <button class="btn btn-outline-primary my-2 my-sm-0" @click.prevent="register" data-toggle="modal" data-target="#modal">Register</button> || 
        <div class="g-signin2" data-onsuccess="onSignIn"></div>
      </form>
      <form class="form-inline">
        <input class="form-control mr-sm-2" type="search" v-model="query" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success my-2 my-sm-0" @click.prevent="$emit('sort', query)" type="submit">Search</button>
      </form>
      <form class="form-inline">
        <button @click.prevent="logout" class="btn btn-outline-primary my-2 my-sm-0">Logout</button>
      </form>
    </nav>
    `,
    methods: {
        login ( username, password ) {
            let credentials = {
                username,
                password
            }
            axios.post('http://localhost:3000/users/signin', credentials)
            .then((result => {
                let token = result.data.token;
                localStorage.setItem('token', token)
                swal('success', 'succesfully logged in', 'success')
                app.logged = true;
            }))
            .catch((err => {
                console.log(err)
                swal('ooops', 'something went wrong', 'warning')
            }))
        },
        logout () {
            localStorage.clear();
            app.logged = false;
            swal('logged-out', 'you are now logged out', 'info')
        },
        refresh () {
            window.location.reload()
        },
        register () {
        }
    }
})

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    let credentials = {
        username: profile.getName(),
        password: profile.getId()
    }

    axios.post('http://localhost:3000/users/register', credentials)
    .then((result => {
        axios.post('http://localhost:3000/users/signin', credentials)
            .then((result => {
                let token = result.data.token;
                localStorage.setItem('token', token)
                swal('success', 'succesfully logged in', 'success')
                app.logged = true;
            }))
            .catch((err => {
                console.log(err)
                swal('ooops', 'something went wrong', 'warning')
            }))
    }))
    .catch((err => {
        axios.post('http://localhost:3000/users/signin', credentials)
            .then((result => {
                let token = result.data.token;
                localStorage.setItem('token', token)
                swal('success', 'succesfully logged in', 'success')
                app.logged = true;
            }))
            .catch((err => {
                console.log(err)
                swal('ooops', 'something went wrong', 'warning')
            }))
    }))
  }

Vue.component('form-vue', {
    data () {
        return {
            name: '',
            price: '',
            stock:'',
            tags:''
        }
    },
    template: 
    `
    <form>
      <div class="form-group">
        <label for="name">name</label>
        <input v-model="name" type="text" class="form-control" id="name" aria-describedby="emailHelp" placeholder="Enter email">
      </div>
      <div class="form-group">
        <label for="price">price</label>
        <input v-model="price" type="number" class="form-control" id="price" placeholder="price">
      </div>
      <div class="form-group">
        <label for="stock">stock</label>
        <input v-model="stock" type="number" class="form-control" id="stock" placeholder="stock">
      </div>
      <div class="form-group">
        <label for="tags">tags</label>
        <input v-model="tags" type="text" class="form-control" id="tags" placeholder="tags">
      </div>
        <button type="submit" @click.prevent="create(name, price, stock, tags)" class="btn btn-primary">Submit</button>
    </form>
    `,
    methods: {
        create ( name, price, stock, tags) {
            let itemObj = {
                name,
                price,
                stock,
                tags
            }
            let token = localStorage.getItem('token')
            axios.post('http://localhost:3000/item', itemObj, { headers: { token }})
            .then((result => {
                console.log(result.data);
                swal('sucess', 'successfully posted item','success')
                setTimeout(()=>{
                    window.location.reload();
                }, 2000)
            }))
            .catch((err => {
                console.log(err);
                swal('ooops', 'something went wrong', 'warning')
            }))
        }
    }
})


var app = new Vue({
    el: '#app',
    data: {
      message: 'WELLCOME TO POST ITEM',
      logged: false,
      items: '',
      price: ''
    },
    mounted () {
        let token = localStorage.getItem('token');
        if (token) {
            this.logged = true
        }
        axios.get('http://localhost:3000/item')
        .then((result => {
            this.items = result.data
            console.log(this.items)
        }))
        .catch((err => {
            swal('weird', 'cannot get item for some reason', 'warning')
        }))
    },
    methods: {
        sort (input) {
            let reg = new RegExp(input, 'i')
            let newArr = []
            for( let z = 0; z < this.items.length; z ++ ) {
                let item = this.items[z].name
                let tags = this.items[z].tags
                if ( reg.test(item) == true ) {
                    newArr.push(this.items[z])
                } else if ( reg.test(tags) == true){
                    newArr.push(this.items[z])
                }
            }
            swal('sorted', `sorted items bassed on ${input} for tags and names, click "Richardson" on the navbar to do another search`, 'success')
            this.items = newArr
        },
        priceSort ( price ) {
            // alert(price)
            let newArr = []
            for( let z = 0; z < this.items.length; z ++ ) {
                let item = this.items[z].price
                if( item <= price) {
                    newArr.push(this.items[z])
                }
            }
            swal('sorted', `sorted items bassed on ${price} for price, click "Richardson" on the navbar to do another search`, 'success')
            this.items = newArr
        }
    }
   }
)
   