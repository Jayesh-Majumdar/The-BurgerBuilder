import React,{Component} from 'react';

import Aux from '../../hoc/AUXILLARY/Auxillary';

import Burger from '../../components/Burger/Burger';

import BuildControls from '../../components/Burger/BuildControls/BuildControl';

import Modal from '../../components/UI/Modal/Modal';

import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';

import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
  salad:0.5,
  bacon:0.7,
  cheese:0.4,
  meat:1.3
}

class BurgerBuilder extends Component{

  state ={
    ingredients:null /*{
      salad:0,
      bacon:0,
      cheese:0,
      meat:0
      }*/,
      totalPrice:4,
      purchasable:false,
      purchasing:false,
      loading:false,
      error:false
    }
    componentDidMount (){
      console.log(this.props);
      axios.get('https://react-my-burger-80b03.firebaseio.com/ingredients.json')
      .then(response=>{
        this.setState({ingredients:response.data});
      })
      .catch(error=>{
        this.setState({error:true});
      });
    }
    updatePurchaseState(ingredients){

      const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((sum,el) => {
        return sum+el;
      },0);
      this.setState({purchasable:sum > 0});

    }

    addIngredientHandler = (type) => {
      const oldCount = this.state.ingredients[type];
      const updatedCount=oldCount + 1;
      const updatedIngredients = {
        ...this.state.ingredients
      };
      updatedIngredients[type] = updatedCount;
      const priceAddition = INGREDIENT_PRICES[type];
      const oldPrice = this.state.totalPrice;
      const newPrice = oldPrice + priceAddition;
      this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
      this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler =(type) => {
      const oldCount = this.state.ingredients[type];
      if (oldCount <= 0){
        return;
      }
      const updatedCount=oldCount - 1;
      const updatedIngredients = {
        ...this.state.ingredients
      };
      updatedIngredients[type] = updatedCount;
      const priceDeduction = INGREDIENT_PRICES[type];
      const oldPrice = this.state.totalPrice;
      const newPrice = oldPrice - priceDeduction;
      this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
      this.updatePurchaseState(updatedIngredients);

    }
    purchasehandler = (event) => {
      this.setState({purchasing:true});
    }

    purchaseCancelHandler =() => {
      this.setState({purchasing:false});
    }
    purchaseContinueHandler = () => {

      /*this.setState({loading: true});
      //alert('Proceed to Payment');
      const order ={
        ingredients:this.state.ingredients,
        price: this.state.totalPrice,
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
      })
      .catch(function (error) {
        this.setState({loading:false,purchasing:false});
      }.bind(this))
      .then(function () {
        // always executed
      });
      */
      const queryParams =[];
      for(let i in this.state.ingredients){
        queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
      }
      queryParams.push('price=' + this.state.totalPrice);
      const queryString = queryParams.join('&');
      this.props.history.push({
        pathname:'/checkout',
        search:'?'+ queryString
      });
    }


    render (){
      const disabledInfo={
        ...this.state.ingredients
      };
      for(let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <= 0
      }

      let orderSummary = null;



      let burger = this.state.error ? <p>Ingredient can't be Loaded</p>:<Spinner />

      if (this.state.ingredients){
        burger = (
            <Aux>
          <Burger ingredients={this.state.ingredients} />

            <BuildControls
              ingredientAdded={this.addIngredientHandler}
              ingredientRemoved={this.removeIngredientHandler}
              disabled={disabledInfo}
              purchasable={this.state.purchasable}
              ordered={this.purchasehandler}
              price={this.state.totalPrice}/>
          </Aux>
        );
        orderSummary=<OrderSummary
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchasecanceled={this.purchaseCancelHandler}
          purchasecontinue={this.purchaseContinueHandler}>
        </OrderSummary>;
      }
      if (this.state.loading){
        orderSummary = <Spinner />
      }

      return (
        <Aux>
          <Modal show={this.state.purchasing}  modalclosed={this.purchaseCancelHandler}>
            {orderSummary}
          </Modal>
          {burger}
        </Aux>
      );
    }
  }

  export default withErrorHandler(BurgerBuilder, axios);
