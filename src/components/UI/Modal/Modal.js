import React from 'react';

import classes from './Modal.css';

import Aux from '../../../hoc/AUXILLARY/Auxillary';

import Backdrop from '../Backdrop/Backdrop';


const modal = (props) => (
  <Aux>
  <Backdrop show={props.show} clicked={props.modalclosed}>console.log("backdrop hogya");</Backdrop>
  <div
  className={classes.Modal}
  style={{transform: props.show ? 'translateY(0)': 'translateY(-100vh)',
  opacity: props.show ? '1' : '0'
  }}>
  {props.children}
  </div>
  </Aux>
  );

  export default modal;
