# 🍒 REDDIEE

**REDDIEE**는 쇼핑몰과 관리자 채팅 기능을 포함한 웹 서비스 프로젝트입니다.  
Next.js(프론트엔드), Nest.js(백엔드), Socket.io, MySQL을 활용하여 구현했습니다.

-> 백엔드 : https://github.com/ounjuu/Reddiee_back

---

## 🛠 기술 스택

- **Frontend:** Next.js, TypeScript, Zustand, Tailwind CSS
- **Backend:** Nest.js, TypeORM, Socket.io
- **Database:** MySQL
- **API 통신:** Axios, REST API
- **실시간 기능:** Socket.io (채팅)
- **환경 관리:** `.env` 파일 사용, JWT 기반 인증

---

## 🔹 프로젝트 미리보기

<img width="947" height="452" alt="image" src="https://github.com/user-attachments/assets/8ffad4a5-ccb4-4842-ac80-e81f8fec10c8" />
<img width="950" height="443" alt="image" src="https://github.com/user-attachments/assets/17b016ec-4adb-43a6-abef-7580120a92d4" />
<img width="952" height="446" alt="image" src="https://github.com/user-attachments/assets/156863eb-d63a-4911-88fe-b550d451a0cc" />
<img width="956" height="435" alt="image" src="https://github.com/user-attachments/assets/0e6559ac-5923-4b52-92b8-abf68c6acb40" />
<img width="956" height="446" alt="image" src="https://github.com/user-attachments/assets/bcd015bd-0bad-494c-87cb-5e3e86ffbb13" />
<img width="945" height="444" alt="image" src="https://github.com/user-attachments/assets/143d9ad7-7790-4bf7-950d-61e620009382" />
<img width="953" height="446" alt="image" src="https://github.com/user-attachments/assets/f644779a-4903-4297-8aa5-82e464a0b9ec" />

---

## 🔹 프로젝트 주요 기능

### 쇼핑몰
- 상품 조회, 등록, 수정, 삭제
- 장바구니 기능 및 수량 변경
- 로그인/회원가입 및 JWT 인증 (Zustand)
- 관리자 전용 상품 등록 페이지

### 채팅 서비스
- 관리자와 일반 사용자 간 실시간 채팅
- Socket.io를 활용한 채팅방 생성 및 메시지 전송
- 관리자 전용 채팅방에서 여러 유저 채팅 관리
- 메시지 DB 저장 및 불러오기
- 입력창 조건부 렌더링 (관리자는 입력 불가, 안내 메시지 표시)
- 메시지 스크롤 하단 고정

### 기타
- 상태 관리: Zustand
- 쿠키 기반 로그인 유지
- 반응형 UI 지원 (Tailwind CSS)
- 에러 처리 및 유효성 검증

---

### 📝 추가 예정
- 마이페이지
- 결제 기능
