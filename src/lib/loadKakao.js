// 카카오 SDK를 동적으로 로드 (중복 삽입 방지 + 타임아웃 + 재시도)
const KAKAO_SRC='//dapi.kakao.com/v2/maps/sdk.js?appkey=__YOUR_APP_KEY__&libraries=services'
export function loadKakao(timeoutMs=6000){
  if(window.kakao?.maps) return Promise.resolve('ok')
  if(window.__kakaoLoading__) return window.__kakaoLoading__
  window.__kakaoLoading__=new Promise((resolve,reject)=>{
    const existed=document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]')
    if(existed) return wait(resolve,reject,timeoutMs)
    const s=document.createElement('script'); s.src=KAKAO_SRC; s.async=true
    s.onload=()=>wait(resolve,reject,timeoutMs)
    s.onerror=()=>reject(new Error('Kakao SDK load failed'))
    document.head.appendChild(s)
  })
  return window.__kakaoLoading__
}
function wait(resolve,reject,ms){
  const start=Date.now(); const t=setInterval(()=>{
    if(window.kakao?.maps){clearInterval(t); resolve('ok')}
    else if(Date.now()-start>ms){clearInterval(t); reject(new Error('Kakao SDK timeout'))}
  },100)
}
