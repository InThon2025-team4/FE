markdown name=README.md
# KU-Git – 고려대학교 정보대학 프로젝트 매칭 플랫폼

> **“정보대생이라면 누구나, 부담 없이 프로젝트를 만들고 팀에 합류할 수 있도록.”**  
> KU-Git은 고려대학교 정보대학 학생들을 위한 **실전 프로젝트 매칭 플랫폼**입니다.

---

## 1. 프로젝트 배경

정보대학 커리큘럼은 이론·아카데믹 중심으로 설계되어 있어, 학생들이 학기 중에 **실제 협업 프로젝트를 경험할 기회가 제한적**입니다.  
그 결과,

- 어떤 수준의 프로젝트부터 시작해야 할지,
- 팀원을 어디서 어떻게 구해야 할지,
- 내 실력에 맞는 팀이 어디인지,

를 고민하다가 **시작조차 못 하거나, 개인 공부에만 머무르는 경우**가 많습니다.

**KU-Git**은 이 교육의 빈틈(**Educational Gap**)을 채우기 위해 만들어졌습니다.

> 정보대 학생이라면 누구나  
> **부담 없이 프로젝트를 만들고, 팀에 지원하고, 경험을 쌓을 수 있는 매칭 플랫폼**입니다.

---

## 2. 핵심 가치

플랫폼 설계 전반은 다음 두 가지 가치를 중심으로 이루어져 있습니다.

1. **실력 기반의 공정한 매칭**
2. **개발 중심이지만 학습·탐구형 프로젝트도 수용하는 유연한 구조**

### 2.1 실력 기반의 공정한 매칭

백엔드는 사용자 온보딩 단계에서 **기술 스택(TechStack)**, **희망 포지션(Position)**, **실력 등급(Proficiency)** 정보를 수집하고,  
각 프로젝트에는 **최소/최대 수용 실력 범위**와 **포지션별 모집 인원/현재 인원**이 정의됩니다.

- `OnboardDto` (`src/auth/dto/onboard.dto.ts`)
  - 사용자의 기술 스택, 희망 포지션, 실력 등급(`Proficiency`) 등을 저장
- `CreateProjectDto` (`src/project/dto/create-project.dto.ts`)
  - 프로젝트의 **모집 기간**, **프로젝트 기간**, **GitHub Repo URL**,  
    포지션별 인원 제한(`limitFE`, `limitBE`, `limitMobile`, `limitAI`, `limitPM`) 설정
- `ProjectResponseDto` (`src/project/dto/project-response.dto.ts`)
  - 프로젝트의 `minProficiency`, `maxProficiency`, 포지션별 현재 인원/제한 인원, `isOpen`, `isOpenForUser`, `userBlockReason` 등 매칭 관련 정보를 포함
- `checkUserApplicability` (`src/project/project.service.ts`)
  - 지원자가 특정 프로젝트에 **지원 가능한지 여부**와,  
    불가능하다면 그 이유(`reasons`)를 계산하여 반환

이를 통해 단순히 “지원하기” 버튼만 제공하는 것이 아니라,

- **현재 시간 기준으로 모집이 열려 있는지**
- **나의 실력(Proficiency)이 프로젝트 요구 범위에 맞는지**
- **내 포지션에 자리가 남아 있는지**

등을 종합적으로 판단해서 **공정한 매칭 여부**를 결정합니다.

### 2.2 개발 중심 · 학습·탐구형을 모두 포용하는 구조

프로젝트는 기본적으로 **소프트웨어 개발 프로젝트**를 중심에 두고 설계되어 있습니다.

- 포지션: BACKEND, FRONTEND, MOBILE, AI, PM 등
- 기술 스택: Node.js, 등 다양한 백엔드/프론트엔드 스택
- GitHub Repo URL로 실제 코드 베이스 연동 가능

동시에, 난이도(`Difficulty`), 기간, 모집 인원, 포지션 구성을 유연하게 설정할 수 있어,

- 가볍게 시작하는 **학습 목적 스터디/토이 프로젝트**
- 심화된 **연구 탐구형 프로젝트**
- 채용/포트폴리오를 노린 **실전형 팀 프로젝트**

까지 모두 수용할 수 있는 구조를 갖추고 있습니다.

---

## 3. 전체 아키텍처

이 프로젝트는 **Next.js+TypeScript 프론트엔드(FE)**와  
**NestJS+Prisma 백엔드(BE)**로 구성된 풀스택 애플리케이션입니다.

### 3.1 Frontend – `InThon2025-team4/FE`

- **주요 기술**
  - TypeScript (≈ 84%)
  - Next.js / React
  - Axios 기반 API 클라이언트
- **역할**
  - 프로젝트 대시보드 UI
  - 프로젝트 생성/수정 폼
  - 프로젝트 상세 페이지 및 지원 모달
  - 마이페이지(내 프로젝트 / 내가 지원한 프로젝트) 뷰

#### 주요 화면 및 기능

- `/app/dashboard`
  - `DashboardView.tsx`  
  - `GET /project/dashboard`를 호출해 **내가 만든 프로젝트, 내가 속한 프로젝트, 내가 지원한 프로젝트**를 한 번에 보여주는 허브 화면

- `/app/newProject`
  - `NewProjectView` (`src/app/newProject/newProject.tsx`)
  - 프로젝트 생성 폼
    - 제목, 설명, 시작일, 마감일, 예상 기간 등 필수 정보 입력
    - 포지션별(FE/BE/AI/Mobile) 모집 인원 설정
    - 폼 제출 시 백엔드 `CreateProjectDto` 형식에 맞게 payload 변환:
      ```ts
      const payload = {
        name: formData.title,
        description: formData.description,
        difficulty: 'INTERMEDIATE', // TODO: 난이도 선택 UI 추가
        recruitmentStartDate: new Date().toISOString(),
        recruitmentEndDate: new Date(formData.deadline).toISOString(),
        projectStartDate: new Date(formData.startDate).toISOString(),
        projectEndDate: ...,
        githubRepoUrl: '',
        limitFE: recruitmentCounts.FE,
        limitBE: recruitmentCounts.BE,
        limitAI: recruitmentCounts.AI,
        limitMobile: recruitmentCounts.Mobile,
      };
      ```

- `/app/viewProject/[id]`
  - 프로젝트 상세 페이지 (`ViewProject` 컴포넌트)
  - `GET /project/{id}` 응답을 기반으로
    - 모집 기간(시작 예정, 모집 마감)
    - 포지션별 인원 (`positions.frontend / backend / ai / mobile`)
    - 예상 기간, 난이도 등 표시
  - 지원 모달(`ApplyModal`)과 연계해 `POST /project/{id}/apply` 호출

- 공통 API 레이어
  - `src/lib/api/projects.ts`
  - `API_IMPLEMENTATION_SUMMARY.md`에 명세된 **13개 프로젝트 관련 엔드포인트**를 TypeScript로 래핑
    - `getDashboardProjects`, `getOwnedProjects`, `getMemberProjects`
    - `getAllProjects`, `getProjectById`
    - `createProject`, `updateProject`, `deleteProject`
    - `applyToProject`, `getMyApplications`, `getProjectApplications` 등
  - 공통 기능
    - 인증 토큰 관리 (`getAuthToken`, `setAuthorizationHeader`, `clearAuthorizationHeader`)
    - Axios 기반 에러 핸들링 (`axios.isAxiosError`)
    - 응답 타입 정의 (`Project`, `Application`, `CreateProjectData`, `UpdateProjectData`, …)
    - `.env`에서 `NEXT_PUBLIC_SERVER_EXCHANGE_URL`로 서버 URL 설정

프론트엔드는 **타입 안정성**을 최대화한 API 클라이언트와 UI를 통해,  
사용자가 프로젝트 생성 → 상세 조회 → 지원까지의 흐름을 끊김 없이 경험할 수 있도록 구성되어 있습니다.

### 3.2 Backend – `InThon2025-team4/BE`

- **주요 기술**
  - NestJS
  - TypeScript
  - Prisma ORM
  - Swagger (`/docs`에서 API 문서 제공)
- **역할**
  - 프로젝트/지원/대시보드 비즈니스 로직
  - 사용자 온보딩 및 실력·포지션·스택 정보 관리
  - 매칭 조건 검증 및 실력 기반 필터링
  - Docker 기반 배포 환경 제공

#### 주요 모듈

- `src/project/project.controller.ts`
  - `@Controller('project')`  
  - 프로젝트 관련 REST API를 정의
    - `POST /project` – 프로젝트 생성
    - `GET /project` – 전체 프로젝트 조회
    - `GET /project/dashboard` – 대시보드(내 프로젝트, 내가 속한 프로젝트, 내가 지원한 프로젝트)
    - `GET /project/{id}` – 프로젝트 상세 조회
    - `PUT /project/{id}` – 프로젝트 수정
    - `DELETE /project/{id}` – 프로젝트 삭제
    - `POST /project/{id}/apply` – 프로젝트 지원
    - `POST /project/{id}/checkApplicability` – 지원 가능 여부 검증 등

- `src/project/project.service.ts`
  - 실제 도메인 로직을 담당하는 서비스
    - `createProject`, `getAllProjects`, `getProjectById`
    - `updateProject`, `deleteProject`
    - `applyToProject`, `getMyApplications`
    - `getDashboard`, `getOwnerDashboard`
  - 프로젝트/지원 엔티티를 DTO(`ProjectResponseDto`, `ProjectDetailResponseDto`, `ApplicationResponseDto`)로 매핑
  - `calculateCurrentMembersByPosition`  
    포지션별 현재 인원 수를 계산해 응답에 포함
  - `checkUserApplicability`
    - 지원자의 포지션/실력 정보와 프로젝트의 요구사항을 비교해
      - `applicable: boolean`
      - `reasons: string[]`  
      를 반환

- `src/project/project.repository.ts`
  - Prisma를 통해 DB에 접근하는 Repository 레이어
  - `createProject`, `findProjectById`, `findAllProjects`, `findProjectsByOwnerId` 등
  - 지원(`Application`) 생성, 조회, 업데이트 기능 포함

- `src/auth/dto/onboard.dto.ts`
  - Onboarding 시 필요한 사용자 정보 정의
    - `techStacks: TechStack[]`
    - `positions: Position[]`
    - `proficiency: Proficiency`
    - 이름, 이메일, GitHub ID, 포트폴리오 정보 등

- `src/main.ts`
  - CORS 활성화
  - `ValidationPipe`로 DTO 기반 유효성 검사
  - Swagger 문서 설정 (`/docs`)

- `Dockerfile`
  - Node 20-alpine 빌드 + 런타임 단계 분리
  - `npx prisma migrate deploy && node --enable-source-maps dist/main.js`로 실행

---

## 4. 주요 도메인 모델

### 4.1 프로젝트(Project)

백엔드 DTO 기준 주요 필드:

- `id`, `name`, `description`
- `difficulty?: Difficulty`
- `recruitmentStartDate`, `recruitmentEndDate`
- `projectStartDate`, `projectEndDate`
- `githubRepoUrl?`
- 포지션별 모집 인원/현재 인원:
  - `limitFE`, `limitBE`, `limitPM`, `limitMobile`, `limitAI`
  - `currentFE`, `currentBE`, `currentPM`, `currentMobile`, `currentAI`
- 매칭 관련 정보:
  - `minProficiency`, `maxProficiency`
  - `isOpen` – 시간 기준 모집 가능 여부
  - `isOpenForUser?` – 특정 사용자 기준 매칭 가능 여부
  - `userBlockReason?` – 왜 지원할 수 없는지에 대한 이유
- 메타 데이터:
  - `ownerId`, `owner { id, name, email, profileImageUrl }`
  - `memberCount`, `applicationCount`
  - `createdAt`, `updatedAt`

### 4.2 지원(Application)

- 지원 포지션: `appliedPosition: Position[]`
- 자기소개/커버레터: `coverLetter?`
- 상태: `ApplicationStatus` (`pending`, `accepted`, `rejected` 등)

백엔드는 이 정보를 기반으로,

- 프로젝트별 지원 현황 조회
- 소유자 대시보드에서 지원자 목록 확인
- 추후 지원 승인/거절 플로우 확장

이 가능하도록 설계되어 있습니다.

### 4.3 사용자(User) 온보딩

`OnboardDto`를 통해 수집하는 정보:

- `techStacks?: TechStack[]`
- `positions?: Position[]`
- `proficiency?: Proficiency = Proficiency.UNKNOWN`
- 이름, 이메일, 전화번호, GitHub ID, 프로필 이미지 URL
- 포트폴리오(JSON) 등

이는 나중에

- “나에게 열려 있는 프로젝트만 보기”
- “내 포지션과 맞는 프로젝트 추천”

같은 기능의 기반 데이터로 사용됩니다.

---

## 5. KU-Git이 만들어가는 경험

KU-Git은 단순한 공고 게시판이 아니라, **정보대 학생들의 실제 성장 여정을 설계한 플랫폼**입니다.

- **처음 프로젝트를 시작하는 학부생**도  
  → 난이도, 기간, 필요 인원을 고려해 부담 없는 수준의 프로젝트를 쉽게 만들 수 있고,
- **이미 일정 수준의 실력을 가진 학생**은  
  → 본인의 실력에 맞는 프로젝트만 필터링하여 효율적으로 팀을 찾을 수 있으며,
- **연구실/학부 연구, 실험적인 프로젝트**도  
  → 자유로운 포지션/기간/인원 설정을 통해 수용할 수 있습니다.

> “혼자 공부하는 코딩”에서  
> “함께 성장하는 개발 경험”으로 넘어가는  
> **첫 번째 관문**이 되는 것이 KU-Git의 목표입니다.

---

## 6. 로컬 실행 (개요)

> 실제 스크립트/환경 변수는 각 레포지토리의 세부 설정에 따라 달라질 수 있습니다.  
> 아래는 전반적인 흐름을 이해하기 위한 개요입니다.

### 6.1 Backend

```bash
# 의존성 설치
npm install

# Prisma 마이그레이션 및 DB 준비
npx prisma migrate dev

# 로컬 서버 실행
npm run start:dev
# 또는 Docker 사용
docker build -t ku-git-be .
docker run -p 3000:3000 ku-git-be
```

환경 변수 예시:

```env
DATABASE_URL=...
PORT=3000
```

Swagger 문서는 다음 경로에서 확인할 수 있습니다.

- `http://localhost:3000/docs`

### 6.2 Frontend

```bash
# 의존성 설치
npm install

# 환경 변수 설정
echo "NEXT_PUBLIC_SERVER_EXCHANGE_URL=http://localhost:3000" >> .env.local

# 개발 서버 실행
npm run dev
```

브라우저에서:

- `http://localhost:3000` (또는 FE가 사용하는 포트) 접속 후
  - 대시보드, 신규 프로젝트 생성, 프로젝트 상세/지원 흐름을 확인할 수 있습니다.

---

## 7. 앞으로의 확장 아이디어

`API_IMPLEMENTATION_SUMMARY.md`와 서비스 코드 상에 제안된 다음 단계들을 바탕으로, KU-Git은 다음과 같이 확장될 수 있습니다.

- **프로젝트 생성/수정 페이지 고도화**
  - 난이도 선택, 기술 스택 태그, GitHub Repo 연동 UI
- **마이 프로젝트 페이지**
  - 내가 만든 프로젝트 vs 내가 참여 중인 프로젝트 탭 구성
  - 지원자 관리(승인/거절), 상태 변경
- **추천/탐색 기능**
  - 내 온보딩 정보(포지션/스택/실력)를 기반으로 한 맞춤형 프로젝트 추천
- **학습/탐구형 프로젝트 템플릿**
  - 캡스톤/연구/스터디 등 형태에 따른 템플릿 제공

---

## 8. 기여 방법

KU-Git은 **정보대 학생들이 직접 만들어가는 플랫폼**입니다.

- 새로운 매칭 기준 제안
- 온보딩 질문/지표 개선
- UX/UI 개선
- 추천 알고리즘 고도화

등의 아이디어나 기여는 언제나 환영합니다.

1. 이슈 등록
2. 논의 후 브랜치 생성
3. PR 생성 및 리뷰
4. 배포/반영

> “정보대 학생들이 직접 설계한, 정보대 학생을 위한 프로젝트 매칭 플랫폼”  
> KU-Git에 함께 기여해주세요.
