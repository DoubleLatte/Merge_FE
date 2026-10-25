# 백엔드 요청 사항

프론트엔드(`Merge_FE`)는 BE를 수정하지 않는 전제로 개발했고, 없는 기능은 목업으로 처리했다. 아래는 목업을 실제 API로 바꾸거나 제약을 풀기 위해 필요한 항목이다. 기준: `CheonanOn_BE` 브랜치 `refactor/domain-structure`.

## 1. 비로그인 홈을 위한 공개 접근 (우선순위 높음)

`app/domains/events/routes.py`에서 다음이 JWT를 요구한다.

- `GET /api/events/sidos`: `@jwt_required()`. 지역별 섹션의 시도 선택지를 비로그인이 못 받는다.
- `GET /api/events`: `SEARCH_PARAMS`(q, title, venue, tag, category_id, sido_code, is_free, start_date, end_date) 중 공백이 아닌 값이 하나라도 있으면 `verify_jwt_in_request()`를 호출한다.
  - 지역별 섹션(`sido_code`), 무료 행사(`is_free`), 이번 주말(`start_date`/`end_date`), 태그 기획전(`tag`), 카테고리 칩(`category_id`)이 비로그인 홈에서 막힌다.

요청: `/sidos`를 공개로 전환하고, 목록 조회의 필터(`category_id`, `sido_code`, `is_free`, `start_date`, `end_date`, `tag`)는 비로그인도 허용한다. 자유 텍스트 검색(`q`, `title`, `venue`)만 JWT를 유지해도 된다. 행사 상세(`GET /api/events/:id`)는 "누르면 로그인 유도" 정책에 맞으므로 그대로 둔다.

현재 FE 동작: 비로그인 홈은 공개 API(`categories`, `monthly-top`, 검색 파라미터 없는 `sort=dateAsc`/`latest` 목록)만 사용한다.

## 2. 찜(북마크) API

현재 FE는 `src/api/bookmarks.ts`에서 localStorage(사용자별)로 목업한다. 필요 화면: 카드 하트, C2, B3 캘린더, E1/E2.

제안:
- `GET /api/bookmarks` -> 행사 카드 배열(페이지네이션 선택)
- `POST /api/bookmarks` `{event_id}` -> 201 (중복이면 409 또는 멱등 200)
- `DELETE /api/bookmarks/:event_id`
- 카드/상세 응답에 `is_bookmarked`(로그인 시) 포함하면 목록마다 별도 조회가 필요 없다.

## 3. 리뷰 작성자 정보 및 사진 업로드

`Review`에는 `{id, user_id, event_id, rating, content, created_at, updated_at}`만 있어 작성자를 표시할 수 없다.

- 리뷰 응답에 `author: {id, nickname, profile_image}` 추가 (행사 상세의 `reviews[]`, `GET /api/reviews/event/:id`, `/reviews/my` 모두)
- 리뷰 사진: 업로드 API(multipart 또는 presigned URL)와 리뷰의 `images: string[]` 필드

## 4. 프로필 수정 API

현재 `src/api/users.ts`가 닉네임/프로필 이미지를 localStorage에 덮어써 목업한다 (E5~E7).

- `PUT /api/users/me` `{nickname?, profile_image?}` -> 갱신된 사용자
- 프로필 이미지 업로드 방식(위 3번의 업로드와 공용 권장)
- 닉네임 중복/길이 정책과 에러 코드

## 5. 카드 응답 필드 보강

카드(`{id,title,category_id,category,sido_code,sido,start_date,end_date,venue_name,thumbnail_url,price,is_free}`)에는 평점, 리뷰 수, 조회수가 없다.

- `average_rating`, `review_count`를 목록/월간 인기 카드에 추가
- `view_count`(또는 인기 정렬 근거 값) 추가. 현재 `monthly-top`만 `monthly_views`를 준다.
- 상세의 `GET /api/reviews/event/:id/rating` 응답에 `event_id` 포함 여부를 명시해 주면 좋다.

## 6. 약관 동의(A7) 저장

`is_new_user`일 때 약관 화면을 보여주지만 동의 여부를 저장하는 API가 없다.

- `POST /api/users/me/consents` `{terms, privacy, marketing?}` 및 `GET`으로 조회, 또는 `users` 응답에 `consented_at`
- 미동의 사용자의 접근 제한 정책(필요 시)

## 7. 배포용 CORS

개발 중에는 Vite 프록시(`/api` -> `127.0.0.1:5000`)로 우회한다. 배포 시 둘 중 하나가 필요하다.

- FE와 API를 같은 도메인에서 리버스 프록시로 서빙(권장, BE 변경 없음), 또는
- BE에 `flask-cors` 등으로 FE 오리진 허용: `Authorization`, `Content-Type` 헤더와 `GET,POST,PUT,DELETE,OPTIONS` 메서드, preflight 응답 포함. 쿠키를 쓰지 않으므로 credentials는 불필요.

## 8. 카카오 Redirect URI 정렬

- FE `VITE_KAKAO_REDIRECT_URI`, BE `.env`의 `KAKAO_REDIRECT_URI`, 카카오 콘솔 등록 값이 **정확히 같아야** 한다 (토큰 교환 시 `redirect_uri` 불일치는 `KAKAO_TOKEN_REQUEST_FAILED` 401로 나온다).
- 개발: `http://localhost:5173/auth/kakao/callback`. 배포 도메인 값도 콘솔에 추가 등록이 필요하다.
- `POST /api/auth/kakao`는 `{code}`만 받으므로 BE가 서버 설정의 redirect URI를 사용한다. 환경별(개발/배포)로 다르게 쓰려면 BE 설정 분리가 필요하다.

## 9. 길찾기 API (참고)

`src/api/directions.ts`의 `getDirections({fromLat,fromLng,toLat,toLng})`가 목업이다. BE 응답 형식이 확정되면 `DirectionsResult`(`src/api/types.ts`) 매핑만 바꾼다.

## 10. 기타 확인 요청

- 인증 에러 코드 정리: 만료(`AUTH_TOKEN_EXPIRED`)에서만 FE가 자동 갱신하고, `AUTH_TOKEN_INVALID`/`AUTH_TOKEN_REVOKED`는 즉시 로그아웃 처리한다.
- 목록 응답이 빈 경우에도 `events: []`와 `total_count: 0`을 유지하는지 확인.
- 알 수 없는 쿼리 파라미터나 중복 파라미터가 400이 되는 동작은 FE가 파라미터를 정리해서 보내는 것으로 대응한다.

## 11. 화면 구현 중 추가로 확인된 요청

- **목록 카드에 좌표 추가 (지도, 중요)**: `GET /api/events` 카드에 `latitude`/`longitude`가 없어 지도가 카카오 장소 검색으로 `venue_name`을 변환 중이다(`src/pages/map/geocode.ts`). 부정확하거나 못 찾는 경우가 있다. 좌표가 오면 해당 파일을 삭제한다.
- **지도용 조회 크기**: 최대 `size` 안내 또는 좌표 포함 전체 조회 엔드포인트. 현재 지도는 시작일순 30개만 조회한다.
- **`GET /api/reviews/my`에 행사 정보 포함**: `event {id, title, thumbnail_url, end_date}`. 현재는 리뷰마다 `GET /api/events/:id`를 추가 호출한다(로그인 필요).
- **비로그인 홈의 100개 제한**: 공개 필터가 없어 홈이 시작일순 첫 100개를 받아 FE에서 분류한다. 100개 밖의 행사는 지역/무료/주말 섹션에서 빠질 수 있다.
- **`sido` 표기**: 카드의 `sido`가 짧은 이름("충남")인지 전체 이름인지 확정 필요. FE는 `src/pages/home/utils.ts`의 별칭 표로 둘 다 처리한다.
- **약관 동의 저장 API**: A7 화면은 UI만 있고 저장하지 않는다.
