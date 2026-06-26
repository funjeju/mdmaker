# SpecForge 데스크톱 앱 (Electron)

웹 화면(Next.js)을 그대로 감싸, **로컬 설치 감지 · 버전 표시 · API 키 로컬 금고 · .env.local 자동 주입**을 더한 데스크톱 버전입니다.

## 실행 (개발)

```bash
npm run electron:dev
```

- `next dev`(localhost:3000)를 띄운 뒤 Electron 창이 그 화면을 로드합니다.
- 이미 3000 포트를 쓰는 다른 서버가 있으면 먼저 종료하세요. (안 그러면 새 서버는 3001로 뜨는데 Electron은 3000을 봅니다.)

## 빌드 (exe 생성)

```bash
npm run electron:build
```

- 결과물은 `dist/`에 생성됩니다(Windows NSIS 인스톨러).
- 배포용 exe가 어떤 화면을 로드할지는 환경변수로 지정합니다:
  - `ELECTRON_PROD_URL` = 호스팅된 주소(예: Vercel 배포 URL). 미지정 시 localhost:3000.

## 데스크톱에서만 동작하는 기능

| 기능 | 구현 |
|---|---|
| 설치 감지 + 버전 | `electron/detect.js` — `node -v` 등 명령 우선, 없으면 설치 경로 스캔 |
| API 키 암호화 저장 | `electron/vault.js` — OS safeStorage(DPAPI) |
| .env.local 주입 | 폴더 선택 후 키를 `OPENAI_API_KEY=` 형태로 병합 기록 |
| 외부 링크 | 기본 브라우저로 열기 |

웹(브라우저)에서 열면 위 기능은 자동으로 폴백됩니다(감지 불가 표시, 키는 브라우저 localStorage, .env 주입 대신 복사 버튼).

## 감지 대상 도구 경로 튜닝

`electron/detect.js`의 `TOOLS` 객체에서 각 도구의 `commands`/`paths`를 추가·수정하면 됩니다.
클로드코드 · Codex · Antigravity는 설치 위치가 환경마다 다를 수 있어, 실제 설치 후 경로를 확인해 보강하는 것을 권장합니다.
