# 빌드 실패 분석

## 핵심 문제 (반복 발생)
- 오류: `exportArchive exportOptionsPlist error for key "method" expected one {} but found app-store`
- 원인: Products/Applications 디렉토리가 비어있음 (SKIP_INSTALL=YES 문제)

## 최신 빌드 로그 (6a579c8d15be82dee8ec47e9)
```
** ARCHIVE SUCCEEDED **
=== Archive exit code: 0 ===
=== Archive result ===
drwxr-xr-x@ 4 builder staff 128 Jul 15 14:45 Products   ← 타임스탬프 14:45 (아카이브 완료 14:48보다 이전)
drwxr-xr-x 3 builder staff 96 Jul 15 14:45 Applications
drwxr-xr-x 3 builder staff 96 Jul 15 14:45 usr
Applications 안에 .app 파일이 있음 (이번엔 다름!)
```

## 결론
- Products/Applications 디렉토리가 존재하고 내용이 있음
- 하지만 여전히 "Unknown Distribution Error" 발생
- 이는 아카이브 자체의 코드 서명 문제일 가능성 높음
- method=app-store를 인식 못하는 것은 아카이브가 App Store 배포용으로 서명되지 않아서

## 근본 원인 재분석
Xcode 16.4에서 `method: app-store`가 `app-store-connect`로 변경됨
- Xcode 16+에서는 `method` 키 자체가 deprecated
- `distributionMethod: app-store-connect` 또는 `method` 키 제거가 필요

## 해결책
exportOptions.plist에서 method 키를 제거하거나 `app-store-connect`로 변경
