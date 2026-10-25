# 백엔드 요청 사항

프론트엔드(`Merge_FE`)는 BE를 수정하지 않는 전제로 개발했고, 없는 기능은 목업으로 처리했다. 아래는 목업을 실제 API로 바꾸거나 제약을 풀기 위해 필요한 항목이다. 기준: `CheonanOn_BE` 브랜치 `refactor/domain-structure`.

## 0. 화면 정책 (프론트 기준)

- 홈(`/`)과 로그인 화면만 로그아웃 상태로 볼 수 있다. 그 밖의 모든 페이지(행사 목록·검색·상세·지도·캘린더·마이페이지)는 로그인해야 들어가며, 로그아웃 상태에서 누르면 로그인 유도 모달이 뜬다.
- 따라서 `/sidos`와 목록 필터를 로그인 전용으로 둬도 된다. 홈의 지역 칩은 프론트에 고정된 16개 시·도 목록을 쓰고, 홈 데이터는 필터 없는 목록(`page`/`size`/`sort`만)을 모든 페이지에 걸쳐 받아서(최대 500건) 화면에서 분류한다. 백엔드 변경이 필요 없다.

## 1. 찜(북마크) API

현재 FE는 `src/api/bookmarks.ts`에서 localStorage(사용자별)로 목업한다. 이 브라우저에서만 보이며 다른 기기나 서버에는 저장되지 않는다. 필요 화면: 카드 하트, 찜 완료 알림, 캘린더, 내 찜.

- `GET /api/bookmarks` -> 행사 카드 배열
- `POST /api/bookmarks` `{event_id}` -> 201 (중복이면 409 또는 멱등 200)
- `DELETE /api/bookmarks/:event_id`
- 카드/상세 응답에 `is_bookmarked`를 넣으면 목록마다 별도 조회가 필요 없다.

## 2. 리뷰에 작성자 정보와 사진

JWT에는 "요청한 사람 본인"의 id만 들어 있어서 다른 사람이 쓴 리뷰의 작성자 이름과 사진은 알 수 없다. 서버가 리뷰 응답에 넣어 줘야 한다.

- 리뷰 객체에 `author: {id, nickname, profile_image}` 추가 (행사 상세의 `reviews[]`, `GET /api/reviews/event/:id`, `GET /api/reviews/my` 모두)
- 리뷰 사진: 업로드 API와 리뷰의 `images: string[]` 필드 (현재 FE는 사진 추가 버튼을 비활성화해 둠)

## 3. 프로필 수정 API

현재 `src/api/users.ts`가 닉네임/프로필 이미지를 localStorage에 저장하는 목업이다 (이 브라우저에서만 바뀌어 보임).

- `PUT /api/users/me` `{nickname?, profile_image?}` -> 갱신된 사용자
- 프로필 이미지 업로드 방식(리뷰 사진 업로드와 공용 권장)
- 닉네임 길이/중복 정책과 에러 코드 (FE는 2~10자로 검사 중)

## 4. 행사 카드 응답 보강

디자인의 카드에는 별점과 리뷰 수, 조회수가 표시된다(예: ★ 4.7 (128) · 조회 1.2만). 현재 카드 응답(`GET /api/events`, `monthly-top`)에는 이 값이 없어서 해당 줄을 그리지 않고 있다.

- `average_rating`, `review_count`, `view_count`를 카드에 추가 (상세에는 이미 평점과 리뷰 수가 있음)
- `latitude`, `longitude`를 카드에 추가: 지도 화면은 여러 행사의 위치가 한 번에 필요한데 카드에 좌표가 없어 `venue_name`을 카카오 장소 검색으로 바꾸고 있다. 부정확하거나 못 찾는 경우가 있다. (행사 상세에는 이미 좌표가 있어 상세 화면 미니맵은 그 값을 쓴다.)
- `image_url`(원본 이미지) 또는 더 큰 썸네일: 현재 카드의 `thumbnail_url`은 약 300x200이라 카드와 히어로 배너에서 흐리게 보인다.
- 지도용 조회: 최대 `size`(100) 안내 또는 좌표 포함 전체 조회 방법 (현재 지도는 시작일순 30개만 조회)
- (선택) 카드에 `tags: string[]`을 넣으면 홈의 "태그로 찾는 기획전"에 해당 태그 행사 사진을 쓸 수 있다.

## 5. `GET /api/reviews/my`에 행사 정보 포함

"내가 쓴 리뷰" 화면에는 행사 제목과 썸네일이 필요한데, 현재 응답에는 `event_id`만 있어서 리뷰마다 `GET /api/events/:id`를 한 번씩 더 호출한다(리뷰가 10개면 요청 11번).

- 리뷰마다 `event: {id, title, thumbnail_url, end_date}`를 포함

## 6. 약관 동의 저장

신규 가입자(`is_new_user`)에게 약관 화면을 보여주지만 동의 여부를 저장하는 API가 없다.

- `POST /api/users/me/consents` `{terms, privacy, marketing?}` 및 조회 방법

## 7. 배포용 CORS

개발 중에는 Vite 프록시(`/api` -> 백엔드)로 우회한다. 배포 시 둘 중 하나가 필요하다.

- FE와 API를 같은 도메인에서 리버스 프록시로 서빙(권장, 백엔드 변경 없음), 또는
- 백엔드에 `flask-cors` 등으로 FE 오리진 허용: `Authorization`, `Content-Type` 헤더와 `GET,POST,PUT,DELETE,OPTIONS` 메서드, preflight 응답 포함. 쿠키를 쓰지 않으므로 credentials는 불필요.

## 8. 길찾기 API (백엔드 개발 중)

`src/api/directions.ts`의 `getDirections({fromLat,fromLng,toLat,toLng})`가 목업이다. 응답 형식이 확정되면 `DirectionsResult`(`src/api/types.ts`) 매핑만 바꾼다. 자동차·도보도 지원하는지 알려 주면 해당 탭을 활성화한다.

## 참고: 개발 환경 설정

- 카카오 Redirect URI는 프론트 `.env`의 `VITE_KAKAO_REDIRECT_URI`, 백엔드 `.env`의 `KAKAO_REDIRECT_URI`, 카카오 콘솔 등록 값 세 곳이 정확히 같아야 한다(개발: `http://localhost:5173/auth/kakao/callback`). 백엔드는 프론트가 보낸 `code`를 자기 설정의 URI로 교환한다.
- 카드의 `sido`는 짧은 이름("충남", "서울")으로 내려오는 것을 확인했다. 프론트는 전체 이름도 함께 처리한다.
