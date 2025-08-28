import React, {useState} from 'react'
import MapBox from './MapBox'

export default function SearchPage(){
  const [places,setPlaces]=useState([{place_name:'예시 가게',address_name:'주소',phone:'000-0000'}])
  const hasToken=!!localStorage.getItem('accessToken')

  return (
    <main style={{padding:16}}>
      <header style={{position:'relative',background:'#333',color:'#fff',padding:'10px 20px',borderRadius:6}}>
        <h1 style={{margin:0}}>음식점 검색 서비스</h1>
        <button className="login-button" style={{position:'absolute',top:10,right:20}}
          onClick={()=>{ if(hasToken){localStorage.clear(); alert('로그아웃'); location.reload()} else {location.href='/login'} }}>
          {hasToken?'로그아웃':'로그인'}
        </button>
      </header>

      <section id="map-results" style={{display:'flex',gap:8,alignItems:'flex-start',marginTop:16,justifyContent:'center'}}>
        <aside style={{width:200,background:'#fff',padding:10,border:'1px solid #ddd',borderRadius:8,height:520,overflow:'auto'}}>
          <h2 style={{textAlign:'center'}}>실시간 키워드 랭킹</h2>
          <ul style={{listStyle:'none',margin:0,padding:0}}><li>예시 키워드</li></ul>
        </aside>

        <MapBox height={520} onReady={(map,kakao)=>{console.log('map ready',map,kakao)}}/>

        <div id="menu_wrap" style={{width:250,background:'#fff',padding:10,border:'1px solid #ddd',borderRadius:8}}>
          <ul style={{listStyle:'none',padding:0,margin:0}}>
            {places.map((p,i)=>(
              <li key={i} style={{display:'flex',gap:10,padding:10,borderBottom:'1px solid #ddd',cursor:'pointer'}}>
                <span style={{width:24,height:24,borderRadius:'50%',background:'#007bff',color:'#fff',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700}}>{i+1}</span>
                <div style={{flex:1}}>
                  <h5 style={{margin:0,fontSize:16}}>{p.place_name}</h5>
                  <span style={{display:'block',fontSize:12,color:'#555'}}>{p.address_name}</span>
                  <span style={{display:'block',fontSize:12,color:'#555'}}>{p.phone||'전화번호 없음'}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

/*
import { useEffect, useMemo, useRef, useState } from 'react'
import Tabs from './Tabs'
import { API_BASE_URL } from '../lib/api'

const accessToken = () => localStorage.getItem('accessToken')

export default function SearchPage() {
  // 탭
  const [tab, setTab] = useState('keyword') // 'keyword' | 'nearby' | 'filter'

  // 공통 상태
  const [guList, setGuList] = useState([])
  const [dongList, setDongList] = useState([])
  const [selectedGu, setSelectedGu] = useState('')
  const [selectedDong, setSelectedDong] = useState('')

  const [menuTypes, setMenuTypes] = useState([])
  const [menuNames1, setMenuNames1] = useState([]) // 탭1 서브카테고리
  const [menuNames2, setMenuNames2] = useState([]) // 탭3 서브카테고리
  const [foodType1, setFoodType1] = useState('')
  const [foodName1, setFoodName1] = useState('')
  const [foodType2, setFoodType2] = useState('')
  const [foodName2, setFoodName2] = useState('')

  // 즐겨찾기
  const [favPlaces, setFavPlaces] = useState([])
  const [favMenus, setFavMenus] = useState([])

  // 랭킹
  const [rankings, setRankings] = useState([])

  // Kakao Map refs
  const mapRef = useRef(null)
  const listRef = useRef(null)
  const paginationRef = useRef(null)
  const mapObjRef = useRef({ map: null, ps: null, infowindow: null, markers: [] })

  // 결과 상태
  const [placesResult, setPlacesResult] = useState([])      // 탭1
  const [nearbyPlaces, setNearbyPlaces] = useState([])      // 탭2
  const [filteredPlaces, setFilteredPlaces] = useState([])  // 탭3

  // 페이지네이션 상태
  const [pageTab1, setPageTab1] = useState(1)
  const [pageNearby, setPageNearby] = useState(1)
  const [pageFilter, setPageFilter] = useState(1)
  const perPage = 7
  const maxPages = 5

  // 현재 위치
  const [coord, setCoord] = useState(null) // {lat,lng}

  // Kakao 지도 초기화
  useEffect(() => {
    if (!window.kakao || !mapRef.current) return
    const { kakao } = window
    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(36.3504, 127.3845),
      level: 3,
    })
    const ps = new kakao.maps.services.Places()
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 })
    mapObjRef.current = { map, ps, infowindow, markers: [] }
  }, [])

  // 공통 데이터 로드 (구/메뉴 타입/즐겨찾기/랭킹)
  useEffect(() => {
    // 구
    fetch(`${API_BASE_URL}/api/v1/locations/gu`, {
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + (accessToken()||'') }
    }).then(r => r.json()).then(d => setGuList(d?.data ?? [])).catch(()=>{})
    // 메뉴 타입
    fetch(`${API_BASE_URL}/api/v1/menu/type`, {
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + (accessToken()||'') }
    }).then(r => r.json()).then(d => setMenuTypes(d?.data ?? [])).catch(()=>{})
    // 즐겨찾기
    loadFavPlaces()
    loadFavMenus()
    // 랭킹 주기적 로드
    const loadRanking = () => {
      fetch(`${API_BASE_URL}/api/v1/search/rankings`, {
        headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + (accessToken()||'') }
      }).then(r => r.json()).then(d => setRankings(d?.data ?? [])).catch(()=>{})
    }
    loadRanking()
    const t = setInterval(loadRanking, 10000)
    return () => clearInterval(t)
  }, [])

  // 구 선택 시 동 목록
  useEffect(() => {
    if (!selectedGu) { setDongList([]); setSelectedDong(''); return }
    fetch(`${API_BASE_URL}/api/v1/locations/dong?gu=${encodeURIComponent(selectedGu)}`, {
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + (accessToken()||'') }
    }).then(r => r.json()).then(d => setDongList(d?.data ?? [])).catch(()=>{})
  }, [selectedGu])

  // 메뉴 타입 선택 시 서브카테고리
  useEffect(() => {
    if (!foodType1) { setMenuNames1([]); setFoodName1(''); return }
    fetch(`${API_BASE_URL}/api/v1/menu/name?menuType=${encodeURIComponent(foodType1)}`, {
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + (accessToken()||'') }
    }).then(r => r.json()).then(d => setMenuNames1(d?.data ?? [])).catch(()=>{})
  }, [foodType1])

  useEffect(() => {
    if (!foodType2) { setMenuNames2([]); setFoodName2(''); return }
    fetch(`${API_BASE_URL}/api/v1/menu/name?menuType=${encodeURIComponent(foodType2)}`, {
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + (accessToken()||'') }
    }).then(r => r.json()).then(d => setMenuNames2(d?.data ?? [])).catch(()=>{})
  }, [foodType2])

  // 즐겨찾기 로더
  const loadFavPlaces = () => {
    fetch(`${API_BASE_URL}/api/v1/star/place`, {
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + (accessToken()||'') }
    }).then(r => r.json()).then(d => setFavPlaces(d?.data ?? [])).catch(()=>{})
  }
  const loadFavMenus = () => {
    fetch(`${API_BASE_URL}/api/v1/star/menu`, {
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + (accessToken()||'') }
    }).then(r => r.json()).then(d => setFavMenus(d?.data ?? [])).catch(()=>{})
  }

  // Kakao 마커 유틸
  const clearMarkers = () => {
    mapObjRef.current.markers.forEach(m => m.setMap(null))
    mapObjRef.current.markers = []
  }
  const addMarker = (position, idx) => {
    const { kakao } = window
    const marker = new kakao.maps.Marker({
      position,
      map: mapObjRef.current.map,
      label: {
        text: String(idx + 1),
        color: "#fff",
        fontSize: "12px",
        fontWeight: "bold"
      }
    })
    mapObjRef.current.markers.push(marker)
    return marker
  }
  const renderList = (data, page, setPage) => {
    if (!listRef.current || !paginationRef.current) return
    const list = listRef.current
    const pag = paginationRef.current
    list.innerHTML = ''
    pag.innerHTML = ''
    clearMarkers()
    const { kakao } = window
    const bounds = new kakao.maps.LatLngBounds()
    const start = (page - 1) * perPage
    const current = data.slice(start, start + perPage)

    current.forEach((place, i) => {
      const idx = start + i
      const position = new kakao.maps.LatLng(place.y, place.x)
      const marker = addMarker(position, idx)
      bounds.extend(position)

      const li = document.createElement('li')
      li.className = 'item'
      li.innerHTML = `
        <span class="markerbg marker_${idx+1}">${idx+1}</span>
        <div class="info">
          <h5 class="restaurant-name">${place.place_name}</h5>
          <span>${place.road_address_name || place.address_name || '주소 정보 없음'}</span>
          <span class="tel">${place.phone || '전화번호 없음'}</span>
        </div>
      `
      const nameEl = li.querySelector('.restaurant-name')
      nameEl.addEventListener('click', () => {
        const restaurantName = place.place_name
        const restaurantAddress = place.road_address_name || place.address_name || '주소 정보 없음'
        window.open(`/review?name=${encodeURIComponent(restaurantName)}&address=${encodeURIComponent(restaurantAddress)}`, '_blank')
      })

      // 호버 이벤트
      const { infowindow } = mapObjRef.current
      kakao.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.setContent(`<div style="padding:5px;font-size:12px;">${place.place_name}</div>`)
        infowindow.open(mapObjRef.current.map, marker)
      })
      kakao.maps.event.addListener(marker, 'mouseout', function() { infowindow.close() })
      li.onmouseover = () => {
        infowindow.setContent(`<div style="padding:5px;font-size:12px;">${place.place_name}</div>`)
        infowindow.open(mapObjRef.current.map, marker)
      }
      li.onmouseout = () => infowindow.close()

      list.appendChild(li)
    })
    if (current.length) mapObjRef.current.map.setBounds(bounds)

    // pagination
    const totalPages = Math.min(Math.ceil(data.length / perPage), maxPages)
    for (let i=1;i<=totalPages;i++) {
      const a = document.createElement('a')
      a.href = '#'
      a.innerText = String(i)
      a.className = (i===page) ? 'on' : ''
      a.onclick = (e) => { e.preventDefault(); setPage(i) }
      pag.appendChild(a)
    }
  }

  // 탭1: 키워드 검색
  useEffect(() => { renderList(placesResult, pageTab1, setPageTab1) }, [placesResult, pageTab1])
  const onSearchKeyword = () => {
    const kw = `${selectedGu} ${selectedDong} ${foodName1}`.trim()
    if (!kw) return alert('검색 조건을 선택해주세요!')
    mapObjRef.current.ps.keywordSearch(kw, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlacesResult(data); setPageTab1(1)
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.')
      } else {
        alert('검색 중 오류가 발생했습니다.')
      }
    })
  }

  // 탭2: 내 주변
  useEffect(() => { renderList(nearbyPlaces, pageNearby, setPageNearby) }, [nearbyPlaces, pageNearby])
  const onGetNearby = () => {
    if (!navigator.geolocation) return alert('이 브라우저에서는 Geolocation을 지원하지 않습니다.')
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      fetch(`${API_BASE_URL}/api/v1/search/nearby?longitude=${encodeURIComponent(lng)}&latitude=${encodeURIComponent(lat)}`, {
        headers: { 'Content-Type':'application/json', 'Authorization':'Bearer ' + (accessToken()||'') }
      }).then(r => r.json()).then(d => {
        const arr = d?.data?.restaurantLists ?? []
        if (!arr.length) return alert('주변 음식점 검색 결과가 없습니다.')
        setNearbyPlaces(arr.map(p => ({
          place_name: p.restaurantName,
          address_name: p.address,
          road_address_name: p.roadAddressName,
          phone: p.phoneNumber,
          x: p.longitude,
          y: p.latitude,
        })))
        setPageNearby(1)
      }).catch(()=> alert('서버 요청 중 오류가 발생했습니다.'))
    }, err => alert('현재 위치를 가져오는데 실패하였습니다.\n오류: ' + err.message))
  }

  // 탭3: 위치 + 음식
  useEffect(() => { renderList(filteredPlaces, pageFilter, setPageFilter) }, [filteredPlaces, pageFilter])
  const onGetLocation = () => {
    if (!navigator.geolocation) return alert('이 브라우저에서는 Geolocation을 지원하지 않습니다.')
    navigator.geolocation.getCurrentPosition(pos => {
      setCoord({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    }, err => alert('현재 위치를 가져오는데 실패하였습니다.\n오류: ' + err.message))
  }
  const onSearchFilter = () => {
    if (!coord) return alert('먼저 현재 위치를 가져오세요!')
    const foodKeyword = (foodName2||'').trim()
    if (!foodKeyword) return alert('음식 검색 조건을 선택해주세요!')
    fetch(`${API_BASE_URL}/api/v1/search/nearby?longitude=${coord.lng}&latitude=${coord.lat}&keyword=${encodeURIComponent(foodKeyword)}`, {
      headers: { 'Content-Type':'application/json', 'Authorization':'Bearer ' + (accessToken()||'') }
    }).then(r => r.json()).then(d => {
      const arr = d?.data?.restaurantLists ?? []
      if (!arr.length) return alert('검색 결과가 없습니다.')
      setFilteredPlaces(arr.map(p => ({
        place_name: p.restaurantName,
        address_name: p.address,
        road_address_name: p.roadAddressName,
        phone: p.phoneNumber,
        x: p.longitude,
        y: p.latitude,
      })))
      setPageFilter(1)
    }).catch(()=> alert('서버 요청 중 오류가 발생했습니다.'))
  }

  // 즐겨찾기 추가/삭제/선택
  const addRegionFavorite = () => {
    if (!selectedDong) return alert('지역을 선택해주세요.')
    fetch(`${API_BASE_URL}/api/v1/star/place`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer ' + (accessToken()||'') },
      body: JSON.stringify({ dong: selectedDong })
    }).then(r => { if(!r.ok) throw 0; return r.json() })
      .then(()=>{ alert('지역 즐겨찾기 추가 성공'); loadFavPlaces() })
      .catch(()=> alert('즐겨찾기 추가 실패'))
  }
  const addFoodFavorite1 = () => {
    if (!foodName1) return alert('음식을 선택해주세요.')
    fetch(`${API_BASE_URL}/api/v1/star/menu`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer ' + (accessToken()||'') },
      body: JSON.stringify({ menuKeyword: foodName1 })
    }).then(r => { if(!r.ok) throw 0; return r.json() })
      .then(()=>{ alert('음식 즐겨찾기 추가 성공'); loadFavMenus() })
      .catch(()=> alert('즐겨찾기 추가 실패'))
  }
  const addFoodFavorite2 = () => {
    if (!foodName2) return alert('검색 조건을 선택해주세요!')
    fetch(`${API_BASE_URL}/api/v1/star/menu`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer ' + (accessToken()||'') },
      body: JSON.stringify({ menuKeyword: foodName2 })
    }).then(r => { if(!r.ok) throw 0; return r.json() })
      .then(()=>{ alert('즐겨찾기 추가 성공'); loadFavMenus() })
      .catch(()=> alert('즐겨찾기 추가 실패'))
  }
  const removeFavorite = (keyword, type) => {
    const url = type==='place'
      ? `${API_BASE_URL}/api/v1/star/place?placeKeyword=${encodeURIComponent(keyword)}`
      : `${API_BASE_URL}/api/v1/star/menu?menuKeyword=${encodeURIComponent(keyword)}`
    fetch(url, { method:'DELETE', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer ' + (accessToken()||'') } })
      .then(r => { if(!r.ok) throw 0; return r.json() })
      .then(()=>{ alert('즐겨찾기 삭제 성공'); type==='place'?loadFavPlaces():loadFavMenus() })
      .catch(()=> alert('즐겨찾기 삭제 실패'))
  }
  const selectFavorite = (keyword, type) => {
    if (type==='place') {
      fetch(`${API_BASE_URL}/api/v1/locations/find-gu?dong=${encodeURIComponent(keyword)}`, {
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer ' + (accessToken()||'') }
      }).then(r=>r.json()).then(d=>{
        if (d?.data) {
          setSelectedGu(d.data)
          setTimeout(()=> setSelectedDong(keyword), 80)
        } else {
          alert('해당 동에 맞는 구 정보를 찾을 수 없습니다.')
        }
      })
    } else {
      fetch(`${API_BASE_URL}/api/v1/menu/find-type?menuName=${encodeURIComponent(keyword)}`, {
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer ' + (accessToken()||'') }
      }).then(r=>r.json()).then(d=>{
        if (d?.data) {
          if (tab==='filter') {
            setFoodType2(d.data); setTimeout(()=> setFoodName2(keyword), 80)
          } else {
            setFoodType1(d.data); setTimeout(()=> setFoodName1(keyword), 80)
          }
        } else {
          alert('해당 메뉴에 맞는 음식 타입을 찾을 수 없습니다.')
        }
      })
    }
  }

  // UI 파트들
  const Favorites = ({ placeListId, menuListId }) => (
    <div className="favorites-wrapper">
      <section className="favorites-accordion">
        <div className="accordion-header" onClick={e=>{
          const next = e.currentTarget.nextElementSibling
          next.style.display = (next.style.display==='block'?'none':'block')
        }}>즐겨찾기</div>
        <div className="accordion-content">
          <div className="favorites-container">
            <div className="favorites-section">
              <h3>장소 즐겨찾기</h3>
              <ul id={placeListId} className="favorites-list">
                {favPlaces.map(k => (
                  <li key={k}>
                    <span onClick={()=>selectFavorite(k,'place')}>{k}</span>
                    <button type="button" className="fav-star" onClick={()=>removeFavorite(k,'place')}>★</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="divider" />
            <div className="favorites-section">
              <h3>메뉴 즐겨찾기</h3>
              <ul id={menuListId} className="favorites-list">
                {favMenus.map(k => (
                  <li key={k}>
                    <span onClick={()=>selectFavorite(k,'menu')}>{k}</span>
                    <button type="button" className="fav-star" onClick={()=>removeFavorite(k,'menu')}>★</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  return (
    <section>
      <header>
        <h1>음식점 검색 서비스</h1>
        <nav>
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { key:'keyword', label:'키워드 검색' },
              { key:'nearby',  label:'주변 전체 음식점' },
              { key:'filter',  label:'위치+음식 검색' },
            ]}
          />
        </nav>
      </header>

      <section id="search-options">
        // { 탭1 }
        {tab==='keyword' && (
          <div id="tab-keyword" className="tab-content active">
            <div className="search-form">
              <form className="search-group" onSubmit={(e)=>{e.preventDefault(); onSearchKeyword()}}>
                <label>구:</label>
                <select value={selectedGu} onChange={e=>setSelectedGu(e.target.value)}>
                  <option value="">선택하세요</option>
                  {guList.map(g=> <option key={g} value={g}>{g}</option>)}
                </select>
                <label>동:</label>
                <select value={selectedDong} onChange={e=>setSelectedDong(e.target.value)}>
                  <option value="">선택하세요</option>
                  {dongList.map(d=> <option key={d} value={d}>{d}</option>)}
                </select>
                <button type="button" id="addRegionFavorite" className="favorite-btn" onClick={addRegionFavorite}>★</button>

                <label>음식 카테고리:</label>
                <select value={foodType1} onChange={e=>setFoodType1(e.target.value)}>
                  <option value="">선택하세요</option>
                  {menuTypes.map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
                <label>음식:</label>
                <select value={foodName1} onChange={e=>setFoodName1(e.target.value)}>
                  <option value="">선택하세요</option>
                  {menuNames1.map(n=> <option key={n} value={n}>{n}</option>)}
                </select>
                <button type="button" id="addFoodFavorite" className="favorite-btn" onClick={addFoodFavorite1}>★</button>
                <button type="submit">검색</button>
              </form>
            </div>
            <Favorites placeListId="favoritesPlaceList" menuListId="favoritesMenuList" />
          </div>
        )}

        //{ 탭2 }
        {tab==='nearby' && (
          <div id="tab-nearby" className="tab-content active">
            <button id="getLocation" onClick={onGetNearby}>내 현재 위치로 주변 음식점 검색</button>
          </div>
        )}

         //{ 탭3 }
        {tab==='filter' && (
          <div id="tab-filter" className="tab-content active">
            <div className="search-container">
              <button id="getLocationForFilter" onClick={onGetLocation}>내 현재 위치 가져오기</button>
              <div className="search-area">
                <form className="search-group" onSubmit={(e)=>{e.preventDefault(); onSearchFilter()}}>
                  <label>음식 카테고리:</label>
                  <select value={foodType2} onChange={e=>setFoodType2(e.target.value)}>
                    <option value="">선택하세요</option>
                    {menuTypes.map(t=> <option key={t} value={t}>{t}</option>)}
                  </select>
                  <label>음식:</label>
                  <select value={foodName2} onChange={e=>setFoodName2(e.target.value)}>
                    <option value="">선택하세요</option>
                    {menuNames2.map(n=> <option key={n} value={n}>{n}</option>)}
                  </select>
                  <button type="button" id="addFavoriteForFilter" className="favorite-btn" onClick={addFoodFavorite2}>★</button>
                  <button type="submit">검색</button>
                </form>
              </div>
            </div>
            <Favorites placeListId="favoritesPlaceList2" menuListId="favoritesMenuList2" />
          </div>
        )}
      </section>

      <section id="map-results" style={{marginTop: 20}}>
    //    { 랭킹 }
        <div id="ranking">
          <h2>실시간 키워드 랭킹</h2>
          <ul id="rankingList">
            {rankings.map(item => (
              <li key={item.ranking} onClick={()=>selectFavorite(item.keyword, 'menu')}>
                <span className={`ranking-badge ${item.ranking===1?'gold':item.ranking===2?'silver':item.ranking===3?'bronze':''}`}>{item.ranking}</span>
                <span className="ranking-keyword">{item.keyword}</span>
              </li>
            ))}
          </ul>
        </div>

        //{ 지도 }
        <div id="map" ref={mapRef} />

        //{ 결과 리스트 }
        <div id="menu_wrap">
          <ul id="placesList" ref={listRef}></ul>
          <div id="pagination" ref={paginationRef}></div>
        </div>
      </section>
    </section>
  )
}

*/