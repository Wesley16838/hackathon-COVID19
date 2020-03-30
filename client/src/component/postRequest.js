import React,{useState} from 'react';
import { withRouter } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';

function PostRequest() {
    const { handleSubmit, register,errors } = useForm();
    const [dummy] = useState(false);
    const onSubmit = async values => {
        let userID = localStorage.getItem('userId')

        var result = await axios.post('/add_order',{
            userId: userID,
            prod: values.product,
            amt: values.prodAmount,
            wish:values.wishProduct,
            wish_amt:values.wishAmount,
            description:values.description
          })
        //   reset() 
        window.location.reload(!dummy);
    };
    
  return (
 
             <form className='requestForm' onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
            <label htmlFor='description' className='reqDescription'></label>
            <textarea  
            placeholder='What&apos;s your request' 
            autoComplete='off' 
            name="description" 
            ref={register({
                required: 'Required',
                pattern: {
                    message: "invalid product name"
                }
                })}
            >

            </textarea>
        </div>
        <div className='extraContent'>
            <div className='reqProdGroup'>
                <div className="form-group">
                    <label htmlFor='product' >Product:</label>
                    <input
                        name="product"
                        ref={register({
                        required: 'Required',
                        pattern: {
                            message: "invalid product name"
                        }
                        })}
                    />
                    {errors.product && errors.product.message}
                </div>
                
                <div className="form-group">
                    <label htmlFor='prodAmount' >Amount:</label>
                    <input
                        type='number'
                        name="prodAmount"
                        ref={register({
                        min: {
                            value: 1,
                            message: 'Should be larger than 0'
                            },
                        required: 'Required'
                    
                        })}
                    />
                    {errors.prodAmount && errors.prodAmount.message}
                </div>
            </div> 
            <div className='wishProdGroup'>
                <div className="form-group">
                    <label htmlFor='wishProduct' >Wish Product:</label>
                    <input
                        type='text'
                        name="wishProduct"
                        ref={register({
                        required: 'Required',
                        pattern: {
                            message: "invalid product name"
                        }
                        })}
                    />
                    {errors.wishProduct && errors.wishProduct.message}
                </div>
                
                <div className="form-group">
                    <label htmlFor='wishAmount' >Amount:</label>
                    <input
                        name="wishAmount"
                        type='number'
                        ref={register({
                        min: {
                            value: 1,
                            message: 'Should be larger than 0'
                            },
                        required: 'Required',
                        
                        })}
                    />
                    {errors.wishAmount && errors.wishAmount.message}
                </div>
            </div> 
    
          
        </div>
        <button className='basicBtn' type="submit">Submit</button>
        </form>
 
  );
  
}
export default withRouter(PostRequest);

