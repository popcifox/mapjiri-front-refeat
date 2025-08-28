import React, {useEffect,useRef,useState} from 'react'
import {loadKakao} from '@/lib/loadKakao'

export default function MapBox({height=520,onReady}){
  const boxRef=useRef(null)
  const [state,setState]=useState('loading') // loading | ready | error
  const [err,setErr]=useState('')
  const init=()=>{
    try{
      if(!window.kakao?.maps||!boxRef.current) return
      const kakao=window.kakao
      const map=new kakao.maps.Map(boxRef.current,{
        center:new kakao.maps.LatLng(36.3504,127.3845),level:3
      })
      setState('ready'); onReady?.(map,kakao)
    }catch(e){ setErr(e?.message||'init error'); setState('error') }
  }
  useEffect(()=>{
    let live=true
    loadKakao(6000).then(()=>{ if(live) init() })
      .catch(e=>{ if(!live) return; setErr(e?.message||'load failed'); setState('error') })
    return ()=>{ live=false }
  },[])
  return (
    <div style={{position:'relative'}}>
      <div ref={boxRef} id="map" style={{width:520,height,background:'#eaeaea',border:'1px solid #ddd',borderRadius:4}}/>
      {state!=='ready'&&(
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:8,background:'rgba(255,255,255,.7)',borderRadius:4}}>
          {state==='loading'&&<div>지도를 불러오는 중…</div>}
          {state==='error'&&(<>
            <div style={{fontWeight:600}}>지도를 불러오지 못했습니다</div>
            <div style={{fontSize:12,color:'#666'}}>{err}</div>
            <button onClick={()=>{setState('loading');setErr('');loadKakao(6000).then(init).catch(e=>{setErr(e?.message||'load failed');setState('error')})}}
              style={{marginTop:6,padding:'8px 12px',border:'1px solid #007bff',background:'#007bff',color:'#fff',borderRadius:6,cursor:'pointer'}}>
              다시 시도
            </button>
          </>)}
        </div>
      )}
    </div>
  )
}
