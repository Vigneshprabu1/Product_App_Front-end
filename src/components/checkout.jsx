import React, { Component } from 'react';
import axios from 'axios';
import './checkout.css'
import StripeCheckout from 'react-stripe-checkout';


const PAYMENT_SERVER_URL = '3RD_PARTY_SERVER';
const CURRENCY = 'USD';

class CheckOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedout: false,
            username: '',
            show: false,
            show1: false,
            newaddress: false,
            userdata: JSON.parse(localStorage.getItem("user")),
            delivery_address: "",
            listData: [],
            listData2: {
                "cust_id": 0,
                "product_name": "",
                "product_image": "",
                "product_category": "",
                "shop_category": "",
                "rating": 0,
                "size": 0,
                "price": 0,
                "quantity": 0,
                "brand_name": 0,
                "discount": 0,
                "tax": 0,
                "shop_name": "",
                "product_id": 0,
                "review": "",
                "total": 0,
                "order_status": "proceed",
                "provider_mobile_number": 0,
                "customer_mobile_number": 0,
                "delivery_address": "",
                "provider_id": 0,
                "payment_option": "",
                "customer_email": "",
                "invoice_number": "",
                "delivered_on": "45 minutes",

            },
            listData1: {},
            combine: [],
            payment: "nothing",
            total: "",
            invoice_number: "",
            delivered_on: "45 mins",
            image:""
        }
        
        this.state.listData = JSON.parse(localStorage.getItem("final"));
        this.state.listData1 = JSON.parse(localStorage.getItem("provider"));
      if(this.state.userdata){    
        this.state.delivery_address=this.state.userdata.address;
      }
      
        var product=Object.assign(this.state.listData1,{quantity:this.state.listData[0].quantity});
        this.state.image =this.state.listData[0].product_image;
        this.state.title =this.state.listData[0].product_name;
        this.setState({image:this.state.image});
        this.setState({title:this.state.title});
        
        this.setState({listData1:this.state.listData1})
        this.setState({listData:this.state.listData})
        console.log(this.state.listData[0])
        // console.log(this.state.listData2);
        
        this.addrtoggle = this.addrtoggle.bind(this);
        this.changeaddr = this.changeaddr.bind(this);
        if (this.state.listData !== undefined) {
            this.state.total = this.state.listData[0].quantity * this.state.listData1.price[this.state.listData1.indexOf];
            console.log(this.state.total)
            this.setState({ total: this.state.total })
           console.log(this.state.listData[0].provider_id);
            
        }
    }
    componentDidMount() {
        if (this.state.userdata != undefined) {
            axios.get("http://node-api-011.herokuapp.com/orders/" + this.state.userdata.uid).then(response => {
                console.log(response.data)
                this.setState({ listData: response.data });
            });
        }
    }

    login() {
        this.props.history.push('/login');
        this.setState({ show: true });
        this.setState({ show1: false });
    }
    signup() {
        this.props.history.push('/signup');
        this.setState({ show1: true });
        this.setState({ show: false });
    }
    addrtoggle() {
        this.setState({ newaddress: true });
    }
    changeaddr() {
        var address = this.state.delivery_address;
        this.setState({ newaddress: false });
        alert("Delivery Address Changed")
    }
    async confirmorder() {
        
        this.state.listData2.cust_id = this.state.listData[0].cust_id;
        this.state.listData2.product_name = this.state.listData[0].product_name;
        this.state.listData2.product_image = this.state.listData[0].product_image;
        this.state.listData2.product_category = this.state.listData[0].product_category;
        this.state.listData2.rating = this.state.listData[0].rating;
        this.state.listData2.shop_category = this.state.listData[0].shop_category;
        this.state.listData2.size = this.state.listData[0].size;
        this.state.listData2.price = this.state.listData[0].price;
        this.state.listData2.quantity = this.state.listData[0].quantity;
        this.state.listData2.brand_name = this.state.listData[0].brand_name;
        this.state.listData2.discount = this.state.listData[0].discount;
        this.state.listData2.tax = this.state.listData[0].tax;
        this.state.listData2.shop_name = this.state.listData[0].shop_name;
        this.state.listData2.product_id = this.state.listData[0].product_id;
        this.state.listData2.review = this.state.listData[0].review;
        this.state.listData2.total = this.state.listData[0].total;
        this.state.listData2.provider_mobile_number = this.state.listData[0].provider_mobile_number;
        this.state.listData2.customer_mobile_number = this.state.listData[0].customer_mobile_number;
        this.state.listData2.delivery_address = this.state.delivery_address;
        this.state.listData2.provider_id = this.state.listData[0].provider_id;
        this.state.listData2.payment_option = this.state.payment;
        this.state.listData2.customer_email = this.state.listData[0].customer_email;
        this.state.listData2.invoice_number = Date.now();


        this.state.invoice_number = Date.now();
        console.log(this.state.invoice_number);
        // var product = Object.assign(this.state.combine, { payment_option: this.state.payment,invoice_number:this.state.invoice_number,delivered_on:this.state.delivered_on });
        // var product1=Object.assign(this.state.listData,this.state.combine)
        console.log(this.product1);
        console.log(this.state.listData[0].product_id)
        console.log(this.state.listData1)
        console.log(this.state.listData2)
        axios.put("http://localhost:3001/provider/" + this.state.listData1.provider_id, this.state.listData1).then(response => {
            console.log(response);
        }).catch(error => console.log(error)
        )
        axios.post("http://localhost:3001/orders", this.state.listData2).then(response => {
            console.log(response);
        }).catch(error => console.log(error)
        )
        axios.get('http://api.msg91.com/api/sendhttp.php?country=91&sender=MSGIND&route=4&mobiles=' + this.state.listData2.customer_mobile_number + '&authkey=243177AyunGcNGL5bc6ed47&message=' + this.state.userdata.name + ' has purchased. Total amount is ' + this.state.listData2.total, { headers: { 'crossDomain': true, } });
    
    
    }


    onToken = (token) => {
        axios.post(PAYMENT_SERVER_URL,
            {
                description: "hiii",
                source: token.id & token,
                currency: CURRENCY,
                amount: ""
            })
            .then(200)
            .catch(400);
    }
    render() {
        console.log(this.state.listData);
        const onSuccess = (payment) => {
            // Congratulation, it came here means everything's fine!
            console.log("The payment was succeeded!", payment);
            this.confirmorder();
            console.log(this.confirmorder);

            // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
        }

        const onCancel = (data) => {
            // User pressed "cancel" or close Paypal's popup!
            console.log('The payment was cancelled!', data);
            // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
        }

        const onError = (err) => {
            // The main Paypal's script cannot be loaded or somethings block the loading of that script!
            console.log("Error!", err);
            // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
            // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
        }

        let env = 'sandbox'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state
        // let total = 1; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
        // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/

        const client = {
            sandbox: 'AZOydPphjOEGhm-gS8iPiBdESForP9ExEeUsUXQkOg4Y_TM97VH9ZKUrpUbkt_ePXbmCEm1wVC1-2vHm',
            production: 'YOUR-PRODUCTION-APP-ID',
        }


        return (
            <div>
                <div className="page-head_agile_info_w3l" style={{ backgroundColor: "#6c757d" }}>
                    <div className="container" >
                        <h3>Checkout <span>Page </span></h3>

                        <div className="services-breadcrumb">
                            <div className="agile_inner_breadcrumb">

                                <ul className="w3_short">
                                    <li><a href="/">Home</a><i>|</i></li>
                                    <li>Checkout Page </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
                {this.state.userdata != undefined ? (
                    <div id="manoj">
                        <section className="container py-4" >
                            <div className="row">
                                <div className="col-sm-6 col-md-12 col-lg-10 col-xs-12">
                                    <ul id="tabsJustified" className="nav nav-tabs">
                                        <li className="nav-item"><a href="" data-target="#myprof" data-toggle="tab" className="nav-link small text-uppercase active">My Profile</a></li>
                                        <li className="nav-item"><a href="" data-target="#orders" data-toggle="tab" className="nav-link small text-uppercase ">Orders</a></li>
                                        <li className="nav-item"><a href="" data-target="#fav" data-toggle="tab" className="nav-link small text-uppercase ">Address</a></li>
                                        <li className="nav-item"><a href="" data-target="#addr" data-toggle="tab" className="nav-link small text-uppercase ">Payment</a></li>
                                    </ul>
                                    <br />

                                    <div id="tabsJustifiedContent" className="tab-content">
                                        <div id="myprof" className="tab-pane fade active show">
                                            {this.state.userdata == undefined ? (

                                                <div className="list-group">
                                                    <div className="btn-group" role="group" aria-label="Basic example" >
                                                        <button type="button" className="btn btn-secondary" onClick={() => this.login()}>Login</button>
                                                        <button type="button" className="btn btn-secondary" onClick={() => this.signup()}>Sign up</button>

                                                    </div>
                                                </div>
                                            ) : (
                                                    <div>


                                                        <p><strong>welcome,</strong>{this.state.userdata.name}</p>



                                                    </div>
                                                )}


                                        </div>

                                        <div id="orders" className="tab-pane fade ">
                                            <div className="row pb-2">
                                                <div className="col-md-7">

                                                    {/* <p> <strong> Orders</strong></p>
                                                   

                                                        <p>₹{this.state.listData1.price[this.state.listData1.indexOf]}</p>

                                                        <p>₹{this.state.total}</p>
                                                  */}
                                                    <div className="container">
                                                        <table id="cart" className="table table-hover table-condensed">
                                                            <thead>
                                                                <tr>
                                                                    <th style={{width:"50%"}}>Product</th>
                                                                    <th style={{width:"10%"}}>Price</th>
                                                                    <th style={{width:"8%"}}>Quantity</th>
                                                                    <th style={{width:"22%"}} className="text-center">Subtotal</th>
                                                                    <th style={{width:"10%"}}></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td data-th="Product">
                                                                        <div className="row">
                                                                            <div className="col-sm-2 hidden-xs"><img src={this.state.image} alt="..." className="img-responsive" /></div>
                                                                            <div className="col-sm-10">
                                                                                <h4 className="nomargin">{this.state.title}</h4>
                                                                                <p>Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.</p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td data-th="Price"> ₹{this.state.listData1.price[this.state.listData1.indexOf]}</td>
                                                                    <td data-th="Quantity">
                                                                        <input type="number" className="form-control text-center" value={this.state.listData1.quantity} />
                                                                        {/* <p>{this.state.listData.quantity}</p> */}
                                                                    </td>
                                                                    <td data-th="Subtotal" className="text-center"> ₹{this.state.listData1.price[this.state.listData1.indexOf]*this.state.listData1.quantity}</td>
                                                                    <td className="actions" data-th="">
                                                                        <button className="btn btn-info btn-sm"><i className="fa fa-refresh"></i></button>
                                                                        <button className="btn btn-danger btn-sm"><i className="fa fa-trash-o"></i></button>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                            <tfoot>
                                                                <tr className="visible-xs">
                                                                    <td className="text-center"><strong>Total ₹{this.state.listData1.price[this.state.listData1.indexOf]}</strong></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><a href="#" className="btn btn-warning"><i className="fa fa-angle-left"></i> Continue Shopping</a></td>
                                                                    <td colSpan="2" className="hidden-xs"></td>
                                                                    <td className="hidden-xs text-center"><strong>Total ₹{this.state.total}</strong></td>
                                                                    {/* <td><a href="#" className="btn btn-success btn-block">Checkout <i className="fa fa-angle-right"></i></a></td> */}
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>


                                        <div id="fav" className="tab-pane fade">
                                            <div className="list-group">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <label><b>Your address</b></label>
                                                        <p>{this.state.delivery_address}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <button onClick={() => this.addrtoggle()} className="btn btn-outline-primary">Add new address</button><br /><br />
                                                        {this.state.newaddress ? (
                                                            <div>
                                                                <textarea placeholder="write something..." required onChange={event => this.setState({ delivery_address: event.target.value })} />
                                                                <input type="submit" onClick={() => this.changeaddr()} className="btn btn-outline-secondary" />
                                                            </div>
                                                        ) : []}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div id="addr" className="tab-pane fade">
                                            {/* <div className="btn-group" data-toggle="buttons">

                                                <label className="btn btn-success active">
                                                    <input type="radio" name="options" id="option2" autocomplete="off" chacked  onChange={() => this.setState({ payment: "cod" })} />
                                                        <span className="glyphicon glyphicon-ok"></span>
                                                        COD
			                                            </label>

                                                    <label className="btn btn-primary">
                                                        <input type="radio" name="options" id="option1" autocomplete="off" onChange={() => this.setState({ payment: "online" })}/>
                                                            <span className="glyphicon glyphicon-ok"></span>
                                                            Online
		                                                	</label>
                                                            </div> */}
                                            <div className="custom-control custom-radio">
                                                <input type="radio" className="custom-control-input" id="defaultGroupExample1" name="groupOfDefaultRadios" onChange={() => this.setState({ payment: "cod" })} />
                                                <label className="btn btn-primary" htmlFor="defaultGroupExample1">COD</label>
                                            </div><br />
                                            <div className="custom-control custom-radio">
                                                <input type="radio" className="custom-control-input" id="defaultGroupExample2" name="groupOfDefaultRadios" onChange={() => this.setState({ payment: "online" })} />
                                                <label className="btn btn-primary" htmlFor="defaultGroupExample2">Online</label>
                                            </div>
                                            {this.state.payment === "cod" ? (
                                                <div style={{ alignItems: "center" }}>

                                                    <br /><button className="btn btn-success" onClick={() => this.confirmorder()}>BuyNow</button>
                                                </div>
                                            ) : []}
                                            {this.state.payment === "online" ? (
                                                <StripeCheckout
                                                    token={this.onToken}
                                                    stripeKey="pk_test_7Yx1hK8cWQh1flMaqeAiQTcv"
                                                    name="SmartShopping"
                                                    description="Shopping Product Application"
                                                    image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRtpO609q3ZGjn8kwk1_IW1rfk1EDwkumw0eo-YV8Q5mqsNoD-xQ"
                                                    panelLabel="Donate"
                                                    amount={3900} // cents
                                                    currency="INR"
                                                    locale="auto"
                                                    zipCode={true}
                                                    billingAddress={true}
                                                ><br />
                                                    <button className="btn btn-success"><i className="fab fa-cc-stripe"></i>Pay With Card</button>
                                                </StripeCheckout>
                                                // <span>
                                                //     <PaypalExpressBtn env={env} client={client} currency={currency} total={this.state.total} onError={onError} onSuccess={onSuccess} onCancel={onCancel} />
                                                // </span>
                                            ) : []}



                                        </div>
                                    </div>

                                </div>

                            </div>
                        </section>
                    </div>
                ) : (
                        alert("pls sign in first")
                    )}
            </div>
        );
    }
}
export default CheckOut;