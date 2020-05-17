import React,{Component} from 'react';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address:{
      street:'',
      postalcode:''
    },
    loading:false

  }
  orderHandler = (event) =>{
    event.preventDefault();

     this.setState({loading: true});
    //alert('Proceed to Payment');
    const order ={
      ingredients:this.props.ingredients,
      price: this.props.totalPrice,
      customer:{
        name:'test',
        address:{
          street:'Teststreet 1',
          zipCode:'41351',
          Country:'India'
        },
        email:'test@test.com'
      },
      deliveryMethod:'fastest'
    }

    axios.post('orders.json', order)
    .then(function (response) {
      this.setState({loading:false,purchasing:false});
      this.props.history.push('/');
    })
    .catch(function (error) {
      this.setState({loading:false,purchasing:false});
    }.bind(this))
    .then(function () {
      // always executed
    });
  }
  render(){
    let form =(  <form>
       <input type="text" name="name" placeholder="Name"className={classes.Input} />
       <input type="email" name="email" placeholder="Email"className={classes.Input} />
       <input type="text" name="street" placeholder="Street"className={classes.Input} />
       <input type="text" name="postal" placeholder="Postal Code"className={classes.Input} />
       <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
      </form>);
    if (this.state.loading){
      form=<Spinner />;
    }
    return (
      <div className={classes.ContactData}>
          <h4>Enter Contact Data </h4>
        {form}
      </div>
    );
  }
}
export default ContactData;
