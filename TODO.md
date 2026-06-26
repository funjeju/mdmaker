# SpecForge TODO

## 🔭 에러 추적 대시보드 (보류 — 다음에 진행)

프로젝트 자료(Vercel/Firebase/GitHub 주소·토큰)를 입력한 뒤, 추적 가능한 모든 에러를
한 화면에 총망라해서 보여주는 패널.

### 단계별 계획
1. **로컬 에러 검사 (토큰 불필요, 가성비 최고 — 여기부터)**
   - 프로젝트 폴더 선택 → `next build` / `tsc --noEmit` / `eslint` / 테스트 실행
   - 에러를 파일·라인·메시지로 파싱해 목록 표시
   - 데스크톱 앱이라 셸 접근 가능 → 웹앱은 못 하는 기능

2. **크롬 개발자모드(콘솔) 오류 추적** ⭐ 사용자 핵심 요청
   - **SpecForge(Electron) 내부**: `webContents.on('console-message')`로 콘솔 로그/에러,
     `'render-process-gone'`·`unhandledrejection`·`window.onerror`로 JS 예외,
     `did-fail-load`·webRequest로 네트워크 실패 캡처 → DevTools에 뜨는 것 그대로 패널에 표시·저장
   - **사용자 자기 웹 프로젝트**: 작은 에러 리포터 스니펫(window.onerror / console 오버라이드 /
     unhandledrejection)을 주입해 콘솔/네트워크 에러를 수집 엔드포인트로 전송 → 앱에서 조회
     (Sentry 라이트 버전)

3. **Vercel 연동**: 토큰 → 배포 실패·빌드 로그·런타임 함수 에러·배포 상태

4. **GitHub 연동**: 토큰 → 실패한 Actions/CI 런

5. **Firebase 연동**: 서비스 계정 → Functions 로그(Cloud Logging)·Crashlytics
   - 주의: "모든 에러 단일 피드"는 없어 Cloud Logging·Crashlytics를 따로 수집해야 함

### 메모
- 외부 서비스 토큰은 기존 **API 키 금고**에 저장해서 끌어쓰는 구조로 연결
- 1단계(로컬) + 2단계(콘솔 캡처)가 토큰 없이 즉시 효과 → 시작점
