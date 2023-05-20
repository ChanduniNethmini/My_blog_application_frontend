import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'

export default function Profile() {
  const [mypics, setPics] = useState([])
  const {state, dispatch} = useContext(UserContext)
  useEffect(()=>{
    fetch('http://localhost:5000/mypost', {
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      setPics(result.mypost)
    })
  },[])
  return (
    <div style={{maxWidth:'550px', margin:'0px auto'}}>
     <hr/>
    <div className='row'>
      <div className='col'>
      <div style={{display:'flex', 
      justifyContent:"space-around", 
      margin:'18px 0px',
      padding: '20px',
  textAlign:'center'
      }}>
        <div>
          <img style={{width:'160px', height:'160px', borderRadius:'80px', marginRight:'50%'}}
          src={state?state.pic:"loading"}/>
        </div>
      </div>
      </div>
    <div className='col'>
    <h4>{state?state.name:"loading"}</h4>
        <div style={{display:'flex',  justifyContent:"space-between", width:'108%',  padding: '20px',
  textAlign:'center'}}>
          <h6>{mypics?mypics.length:"0"} posts</h6>
          <h6>{state.followers?state.followers.length:"0"} followers</h6>
          <h6>{state.following?state.following.length:"0"} followings</h6>

        </div>
      </div>
    </div>
    <hr/>
    <div className='gallery'>
      {
        mypics.map(item=>{
          return(
          
          <><img key={item._id} className='item' src={item.photo} alt={item.title} /><p>{item.title}</p></> 
          )
        })
      }
    </div>
    </div>
      
    
  )
}