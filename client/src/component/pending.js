import React,{useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import noImage from './../Assets/img/noImage.png'
import profileImage from './../Assets/img/profileImage.png'
import redArrow from './../Assets/img/arrow_red.png'
function AllPending(props) {

    const [data , setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          const result = await axios('/get_pending_by_user?userId='+localStorage.getItem('userId'));

          setData(result.data);
        };
        fetchData();
      }, []);
    

    const handledecline = async (item) => {
        try {
            await axios.put('/set_order_open?orderId='+item._id)
            window.location.reload();
        } catch (e) {
            alert('error: ' + e);
        }
    }

    const handleaccept = async (item) => {
        try {
            await axios.put('/set_order_complete?orderId='+item._id)
            window.location.reload();
        } catch (e) {
            alert('error: ' + e);
        }
    }
    return(
       
        <div className="pendingOrderList">
           
           <ul className="pendingOrders" >
               {data.length ===0?(
                   <p>No pending order</p>
               ):(
                   <div>
{data.map((item, idx) => {
               if(item.img === null){
                  return (<li className="pendingOrder" key={idx}>
                         
                              <div className='prodImage'>
                                  <img src={noImage} alt='no image'/>
                              </div>
                              <div className='pendingDetail'>
                                 <div className='pendingTitle'>
                                <p className="pendingStatus">Status:{item.status}</p>
                                    {item.role === 'buyer' ? (
                                        <p className="pendingRoleBuyer">{item.role}</p>
                                    ):(
                                        <p className="pendingRoleSeller">{item.role}</p>
                                    )}
                                 </div>
                                 <div className='pendingContent'>
                                 {item.role === 'buyer' ? (
                                     <React.Fragment>
                                        <div className="buyerInfo">
                                            <p className="roleTitle">Buyer</p>
                                            <div className="buyerDetail"> 
                                                <img src={profileImage}/><p>{item.reserved_by_user.username}</p>
                                            </div>
                                            <p className="roleEmail">{item.reserved_by_user.email}</p>
                                            <p className="roleProd">Item Name:{item.wish}</p>
                                            <p className="roleAmt">Amount:{item.wish_amt}</p>
                                        </div>
                                        <img className="redarrow" src={redArrow} alt='arrow'/>
                                        <div className="sellerInfo">
                                            <p className="roleTitle">Seller</p>
                                            <div className="sellerDetail"> 
                                                <img src={profileImage}/><p>{item.user.username}</p>
                                            </div>
                                            <p className="roleEmail">{item.user.email}</p>
                                            <p className="roleProd">Item Name:{item.prod}</p>
                                            <p className="roleAmt">Amount:{item.amt}</p>
                                        </div>
                                     </React.Fragment>
                                         
                                    ) : (
                                     <React.Fragment>
                                        <div className="sellerInfo">
                                            <p className="roleTitle">Seller</p>
                                            <div className="sellerDetail"> 
                                                <img src={profileImage}/><p>{item.user.username}</p>
                                            </div>
                                            <p className="roleEmail">{item.user.email}</p>
                                            <p className="roleProd">Item Name:{item.prod}</p>
                                            <p className="roleAmt">Amount:{item.amt}</p>
                                        </div>
                                        <img className="redarrow" src={redArrow}/>
                                        <div className="buyerInfo">
                                            <p className="roleTitle">Buyer</p>
                                            <div className="buyerDetail"> 
                                                <img src={profileImage}/><p>{item.reserved_by_user.username}</p>
                                            </div>
                                            <p className="roleEmail">{item.reserved_by_user.email}</p>
                                            <p className="roleProd">Item Name:{item.wish}</p>
                                            <p className="roleAmt">Amount:{item.wish_amt}</p>
                                        </div>
                                     </React.Fragment>
                                    )}
                                    
                                 </div>
                                 <div className='pendingResult'>
                                 {item.role == 'buyer' ? (
                                     <div className='waiting'>Waiting for Seller</div>
                                 ):(
                                    <React.Fragment>
                                       <button className="cancelBtn" onClick={e => handledecline(item)}>Cancel</button>
                                        <button className="acceptBtn" onClick={e => handleaccept(item)}>Accept</button>
                                    </React.Fragment>
                                 )}
                                 </div>
                              </div>
                         
                          
                      </li>
                  )
               }else{
                  return (<li className="order">
                      <div className='prodImage'>
                          <img src={noImage} />
                      </div>
                      <div className='orderDetail'>
                          <img className='profileImage' src={profileImage}/>
                          <p>{item.user.username}</p>
                          <p>An hour ago</p>
                          <p>{item.prod}</p>
                          </div>
                      </li>
                  )
               }
               
           })}
                   </div>
               )}
           
           </ul>
        </div>

  )

}

export default withRouter(AllPending);