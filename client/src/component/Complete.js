import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import noImage from './../Assets/img/noImage.png'
import profileImage from './../Assets/img/profileImage.png'
import redArrow from './../Assets/img/arrow_red.png'
function AllComplete(props) {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios('/get_complete_by_user?userId=' + localStorage.getItem('userId'));
            setData(result.data);
        };
        fetchData();
    }, []);
    return (

        <div className="completedOrderList">
            <ul className="completedOrders" >
                {data.length === 0 ?(
                    <p>No completed Orders</p>
                ):(
                    <div>
                    {data.map((item, idx) => {
                                if(item.image == null){
                                    return (<li className="completedOrder" key={idx}>
                                                    
                                                <div className='prodImage'>
                                                    <img alt='do not exist' src={noImage} />
                                                </div>
                                                <div className='completedDetail'>
                                                    <div className='completedTitle'>
                                                        <p className="completedStatus">Status:{item.status}</p>
                                                        {item.role === 'buyer' ? (
                                                            <p className="completedRoleBuyer">{item.role}</p>
                                                        ):(
                                                            <p className="completedRoleSeller">{item.role}</p>
                                                        )}
                                                    </div>
                                                    <div className='completedContent'>
                                                    {item.role === 'buyer' ? (
                                                        <React.Fragment>
                                                            <div className="buyer"> 
                                                                <img alt='trade' src={profileImage}/><p>You trade with {item.user.username}</p>
                                                            </div>
                                                            <div className="completedMoreDetail">
                                                                <div className="buyerInfo">
                                                                    <p className="roleProd">{item.wish}</p>
                                                                    <p className="roleAmt">Amount:{item.wish_amt}</p>
                                                                </div>
                                                                <img alt='red arrow' className="redarrow" src={redArrow}/>
                                                                <div className="sellerInfo">
                                                                    <p className="roleProd">Item Name:{item.prod}</p>
                                                                    <p className="roleAmt">Amount:{item.amt}</p>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>   
                                                        ) : (
                                                            <React.Fragment>
                                                            <div className="buyer"> 
                                                                <img alt='profile' src={profileImage}/><p>{item.reserved_by_user.username} trade with you</p>
                                                            </div>
                                                            <div className="completedMoreDetail">
                                                                <div className="sellerInfo">
                                                                    <p className="roleProd">{item.wish}</p>
                                                                    <p className="roleAmt">Amount:{item.wish_amt}</p>
                                                                </div>
                                                                <img alt="trade" className="redarrow" src={redArrow}/>
                                                                <div className="sellerInfo">
                                                                    <p className="roleProd">Item Name:{item.prod}</p>
                                                                    <p className="roleAmt">Amount:{item.amt}</p>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>   
                                                        )}
                                                        
                                                    </div>
                                                
                                                </div>
                                            
                                            
                                        </li>
                                    )
                                }else{
                                    return (<li className="order">
                                        <div className='prodImage'>
                                            <img alt='else' src={noImage} />
                                        </div>
                                        <div className='orderDetail'>
                                            <img alt='elsething' className='profileImage' src={profileImage}/>
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

export default withRouter(AllComplete);