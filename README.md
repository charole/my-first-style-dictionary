# my-first-style-dictionary

[Style Dictionary](https://styledictionary.com/) v5 로 디자인 토큰을 CSS 변수와 Flutter 클래스로 빌드해 보는 연습 프로젝트.
토큰은 Figma [Design Tokens](https://github.com/lukasoppermann/design-tokens) 플러그인 export 형식(`value` / `type`)을 따른다.

## 토큰

| 파일 | 내용 |
|---|---|
| `tokens/core.json` | 기본 토큰 — 컬러 팔레트(neutral·blue·red·green·amber, 흰색·검정 투명도), 간격, 라운드, 폰트·굵기·글자 크기 |
| `tokens/semantic.json` | 시맨틱 토큰 — 텍스트·배경·보더·액션·상태 색, 컨트롤 크기, 본문·제목 타이포. `{core.…}` 참조 |

값은 연습용 샘플이다. 색·간격·라운드·글자 크기는 [Tailwind CSS](https://tailwindcss.com/) v3 기본 스케일(MIT License) 값을,
폰트는 [Inter](https://rsms.me/inter/) 를 쓴다.

## 빌드

```bash
nvm use        # .nvmrc (Node 22)
pnpm install
pnpm build:custom
```

설정은 `src/config/customConfig.js`. 결과물은 `build/` 에 생성된다.

| 플랫폼 | 출력 |
|---|---|
| CSS | `build/css/_variables.css` |
| Flutter | `build/flutter/variables.dart` |

### 커스텀 CSS 포맷 (`customCssFormat`)

- 다른 토큰을 참조하는 값은 풀어 쓰지 않고 `var(--…)` 로 출력해 참조 관계를 유지한다.
  예: `{core.color.neutral.900}` → `var(--core-color-neutral-900)`
- 변수 이름은 Style Dictionary 가 변환한 참조 토큰의 `name` 을 그대로 쓴다.
- 폰트 굵기 이름은 CSS 값으로 매핑한다 (`Regular` → `normal`, `SemiBold` → `600`, `Bold` → `bold`). 매핑은 `src/constants.js`.
