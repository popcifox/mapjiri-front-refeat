# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 🍜 Mapjiri Frontend (React + Vite)

React 기반 음식점 검색 및 리뷰 서비스 프론트엔드입니다.  
Spring Boot 백엔드(`mapjiri-server`)와 연동하여 회원가입, 로그인, 음식점 검색, 즐겨찾기, 리뷰 열람 기능을 제공합니다.

---

## 🚀 주요 기능

- 🔑 **회원가입 / 로그인**
  - 이메일 인증 후 회원가입
  - JWT 기반 로그인 및 토큰 로컬스토리지 저장
- 🍴 **음식점 검색**
  - 지역(구/동) + 음식 카테고리 검색
  - 현재 위치 기반 음식점 검색
  - 위치 + 음식 필터 검색
- ⭐ **즐겨찾기**
  - 장소/음식 즐겨찾기 추가 및 삭제
  - 즐겨찾기 리스트 UI 제공
- 🗺 **지도/검색 UI**
  - Kakao Maps API 연동
  - 음식점 마커 표시 및 검색 결과 리스트 출력
- 📝 **리뷰 시스템**
  - 음식점별 리뷰 목록 조회
  - 이미지, 별점, 작성일자 표시
- 📊 **실시간 랭킹**
  - 인기 검색 키워드 랭킹 확인 가능

---

## 🛠 기술 스택

### Frontend
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router v6](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- Vanilla CSS (스타일 커스터마이징)

### Backend
- [Spring Boot](https://spring.io/projects/spring-boot) (별도 레포지토리)
- PostgreSQL
- JWT 인증

---

## 📂 프로젝트 구조

```bash
mapjiri-front-refeat/
├── public/             # 정적 리소스
├── src/
│   ├── components/     # 공통 컴포넌트
│   ├── lib/            # axios api.js 등 라이브러리
│   ├── pages/          # 페이지 컴포넌트 (Login, Register, Search, Review 등)
│   ├── router/         # React Router 경로 정의
│   ├── styles/         # 전역/페이지 CSS
│   ├── App.jsx
│   └── main.jsx
└── package.json
