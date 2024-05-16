Vue.component('price', {
    data: function () {
        return {
            prefix: 'Rp',
            precision: 3,
        }
    },
    props: ['value'],
    template: `<span>{{this.prefix + Number.parseFloat(value).toFixed(this.precision)}}</span>`
})

Vue.component('product-list', {
    data: function () {
        return {
            style: {
                img: ['img-fluid']
            },
        }
    },
    props: ['items', 'maximum'],
    methods: {
        before: function (el) {
            el.className = 'd-none';
        },

        enter: function (el) {
            let delay = el.dataset.index * 100;
            setTimeout(() => {
                el.className = 'animate__animated animate__fadeInRight';
            }, delay);
        },

        leave: function (el) {
            let delay = el.dataset.index * 100;
            setTimeout(() => {
                el.className = 'animate__animated animate__fadeOutRight';
            }, delay);
        },
    },
    template: `
    <transition-group tag="div" @before="before" @enter="enter" @leave="leave">

                <div v-for="(item, index) in items" :key="item.id" v-if="item.price <= Number(maximum)"
                    :data-index="index">

                    <div class="row d-flex justify-content-center align-items-center 
                    d-md-flex flex-md-row py-3">


                        <div
                            class="d-flex col-6 justify-content-center align-items-center col-md-1 d-md-flex justify-md-content-center align-md-items-center">
                            <button class="btn btn-primary rounded-1" @click="$emit('add', item)">+</button>
                            <a v-bind="{href: 'https://api.whatsapp.com/send/?phone=6289650557420&text=Hai+ARshop%2C+Saya+ingin+order+'+ item.name + '%2C+mohon+dibantu&type=phone_number&app_absent=0'}"
                                style="text-decoration: none;" class="btn btn-primary rounded-1 mx-2">
                                <i class="fa-regular fa-comment-dots"></i>
                            </a>
                        </div>

                        <div
                            class="d-flex col-6 justify-content-start align-items-center col-md-5 d-md-flex justify-md-content-center align-md-items-center">
                            <img v-bind="{src:item.image, alt:item.name, class:style.img}">
                        </div>

                        <div class="col-md-6 d-flex flex-column justify-content-center align-items-start">
                            <h3 class="fw-bold">{{item.name}}</h3>
                            <p>{{item.description}}</p>
                            <h5 class="fw-bold">
                                <price :value="item.price"></price>
                            </h5>
                        </div>


                    </div>

                </div>

            </transition-group>
    `
})

var app = new Vue({

    el: '#app',

    data: {
        items: null,
        maximum: 95,
        cart: [],
        slider: true
    },

    created: function () {
        fetch('https://hplussport.com/api/products/order/price')
            .then((res) => res.json())
            .then((res) => this.items = res)
            .catch((err) => console.log(err));
    },

    methods: {
        addItems: function (items) {
            let getIndex;
            const check = this.cart.filter(function (item, index) {
                if (items.id === item.products.id) {
                    getIndex = index;
                    return true;
                } else {
                    return false;
                }
            })

            if (check.length) {
                return this.cart[getIndex].qty++;
            } else {
                return this.cart.push({
                    products: items,
                    qty: 1
                });
            }
        },

        sliderStatus: function () {
            return this.slider = !this.slider;
        },

        deleteItem: function (item) {
            let getIndex;
            let cart = this.cart;
            this.cart.filter(function (items, index) {
                if (items.products.id === item.products.id) {
                    getIndex = index;
                    if (item.qty > 1) {
                        return item.qty--;
                    } else {
                        return cart.splice(getIndex, 1);
                    }
                }
            });


        }

    },

    computed: {
        sliderState: function () {
            return this.slider ? 'd-flex justify-content-center align-items-center' : 'd-none';
        },

        totalQty: function () {
            let total = 0;
            for (const item of this.cart) {
                total += item.qty;
            }
            return total;
        },

        totalPrice: function () {
            let total = 0;
            for (const item of this.cart) {
                total += (item.qty * item.products.price);
            }
            return total;
        }
    },

})