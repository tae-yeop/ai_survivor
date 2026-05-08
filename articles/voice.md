# AI 보이스 만들기: ElevenLabs로 레퍼런스 잡고 로컬 대체제까지 보기


## 결론 먼저

영상용 AI 보이스는 “어떤 서비스를 쓸까?”보다 “어떤 목소리를 계속 쓸 것인가?”를 먼저 정해야 한다. 내가 직접 녹음하기 부담스럽거나, 같은 톤의 내레이션을 반복해서 만들어야 한다면 AI 보이스가 도움이 된다. 다만 첫 결과물이 그럴듯하다고 바로 제작에 넣으면 나중에 톤이 흔들리고 비용도 예측하기 어려워진다.

내 기준의 작업 순서는 이렇게 잡았다.

1. 목소리 캐릭터와 말투를 글로 정의한다.
2. ElevenLabs Voice Design으로 레퍼런스 후보를 빠르게 만든다.
3. 마음에 드는 후보가 나오면 프롬프트와 평가 기준을 함께 저장한다.
4. 실제 영상 대본은 짧은 샘플로 먼저 테스트한다.
5. 장기적으로는 비용, 약관, 로컬 대체제를 따로 검토한다.

## 왜 AI 보이스를 쓰려고 했나

영상을 만들 때 음성은 생각보다 큰 병목이다. 직접 녹음하면 가장 자연스럽지만 매번 조용한 환경을 만들고, 발음을 다시 하고, 후처리까지 해야 한다. 목소리 자체가 콘텐츠의 분위기와 맞지 않을 때도 있다. 특히 공포, 다큐, 뉴스 요약, 제품 설명처럼 특정한 톤이 필요한 영상은 “내 목소리”보다 “콘텐츠에 맞는 목소리”가 더 중요할 수 있다.

그래서 AI 보이스를 단순한 TTS가 아니라 하나의 캐릭터 자산으로 보기로 했다. 한 번 괜찮은 보이스를 만들면 이후 영상에서도 같은 톤을 반복해서 쓸 수 있기 때문이다.

## 1단계: 목소리 아이덴티티부터 정한다

먼저 정해야 할 것은 모델명이 아니라 목소리의 정체성이다. 최소한 아래 항목은 글로 적어 둔다.

- 언어와 발음 기준: 예를 들어 `Native Korean`, `standard Seoul Korean pronunciation`
- 성별과 연령대: 남성/여성/중성, 20대 후반/30대 초반 등
- 품질 기준: studio quality, broadcast quality 등
- 페르소나: 다큐 내레이터, 차분한 튜터, 미스터리 진행자 등
- 감정: calm, ominous, warm, confident 같은 형용사
- 음색: low-baritone, airy, smooth, crisp articulation 등
- 속도와 전달 방식: slow pace, controlled pauses, clear emphasis 등

ElevenLabs 공식 Voice Design 문서도 언어, 성별, 연령, 품질, 페르소나, 감정, 음색, 페이싱, 전달 방식을 구체적으로 쓰는 쪽을 권장한다. 특히 “accent”를 억양 의미로 대충 쓰면 원치 않는 지역 억양으로 해석될 수 있으니, 한국어에서는 `Korean accent`보다 `Native Korean, standard Seoul Korean pronunciation, clear Korean articulation, controlled intonation`처럼 쓰는 편이 안전하다.

## 2단계: ElevenLabs에서 빠르게 후보를 만든다

현재 가장 편한 출발점은 ElevenLabs의 Voice Design이다. 완전히 새로운 목소리를 프롬프트로 만들 수 있고, 여러 후보를 비교하면서 “내 영상에 맞는 톤”을 찾기 쉽다.

내가 쓸 기본 프롬프트 템플릿은 다음과 같다.

```text
Native <Language>. <Gender>, <Age range>. <Quality level>.
Persona: <2-5 words>. Emotion: <2-3 adjectives>.
<1-2 sentences about timbre, pacing, delivery>
```

예를 들어 한국어 미스터리/호러 내레이션용이라면 이렇게 시작할 수 있다.

```text
Native Korean, standard Seoul Korean pronunciation. Male, late 20s to early 30s. Studio quality.
Persona: noir horror narrator. Emotion: calm, ominous, restrained.
A smooth low-baritone voice with a dark, velvety timbre, subtle breathiness, and crisp articulation. Speaks at a slow, deliberate pace with controlled pauses, intimate proximity, and quiet psychological tension, sounding elegant, cold, and unsettling without becoming theatrical or monstrous.
```

여기서 중요한 것은 “한 번에 정답을 맞히는 것”이 아니다. 후보를 만들고, 마음에 드는 이유와 마음에 안 드는 이유를 같이 적는다. 예를 들면 “저음은 좋지만 발음이 뭉개진다”, “공포 느낌은 좋은데 너무 연극적이다”, “속도가 느려서 쇼츠에는 답답하다”처럼 평가를 남긴다.

## 3단계: 테스트 대본은 짧게 가져간다

긴 대본으로 바로 생성하면 비용도 들고, 실패했을 때 어디가 문제인지 찾기 어렵다. 나는 10초 안팎의 테스트 문장을 먼저 쓴다.

```text
오늘은 AI로 블로그를 만들면서 실제로 막혔던 지점을 기록합니다. 설치, 에러, 비용, 그리고 검색 노출까지 직접 겪은 것만 남깁니다.
```

이 문장 하나로 확인할 수 있는 것이 많다.

- 한국어 발음이 자연스러운가?
- 문장 끝이 너무 과장되지 않는가?
- 숨소리와 pause가 영상 분위기에 맞는가?
- 같은 보이스로 여러 번 생성해도 결과가 크게 흔들리지 않는가?
- 배경음악을 깔았을 때도 알아듣기 쉬운가?

테스트 문장이 통과되면 그때 긴 대본으로 넘어간다.

## 4단계: 보이스 리믹스는 “수정 방향”을 남긴다

처음 만든 목소리가 80점이면 바로 버리지 말고 리믹스 방향을 적어 둔다.

- 더 낮게
- 더 차분하게
- 숨소리는 줄이기
- 발음은 더 또렷하게
- 공포 느낌은 유지하되 괴물처럼 들리지 않게

이렇게 수정 방향을 글로 남겨야 다음번에도 반복할 수 있다. AI 보이스는 파일 하나보다 “프롬프트 + 평가 기준 + 샘플 대본” 세트로 저장하는 것이 더 중요하다.

## 주의: 생성된 음성을 다시 학습 데이터로 쓰지 않는다

처음에는 ElevenLabs에서 만든 음성을 내려받아 로컬 보이스 클로닝 모델에 넣으면 비용을 줄일 수 있지 않을까 생각했다. 하지만 이 방식은 피하는 쪽으로 정리했다. ElevenLabs의 Prohibited Use Policy는 서비스나 출력물을 다른 AI/ML 모델 학습 입력으로 쓰는 행위를 금지한다.

그래서 안전한 흐름은 다음과 같다.

- ElevenLabs에서 만든 음성 파일을 다른 모델 학습 데이터로 넣지 않는다.
- 대신 마음에 드는 음성의 속성을 텍스트로 분석해 프롬프트로 옮긴다.
- 로컬 클로닝을 하려면 내가 권리를 가진 실제 음성 샘플을 사용한다.
- 발행 전에는 최신 약관과 사용권을 다시 확인한다.

이 글은 법률 자문이 아니라 작업 메모다. 특히 상업 영상에 쓸 계획이라면 서비스 약관, 플랜별 상업 이용 조건, 표시 의무를 따로 확인해야 한다.

## 로컬 대체제는 언제 볼까

ElevenLabs는 편하지만 계속 쓰면 비용이 누적된다. 그래서 로컬 대체제를 검토할 만한 상황은 아래와 같다.

- 영상 수가 많아져 월 사용량이 예측 가능해졌을 때
- GPU 자원이 이미 있고 설치 시간을 감수할 수 있을 때
- 같은 보이스를 장기간 유지해야 할 때
- 외부 서비스에 대본이나 음성 데이터를 올리는 것이 부담될 때

후보로는 OpenBMB의 VoxCPM 같은 프로젝트를 살펴볼 수 있다. 다만 로컬 모델은 “공짜”가 아니다. 설치 시간, GPU 메모리, 음질 튜닝, 라이선스 확인 비용이 들어간다. 초반에는 ElevenLabs로 목소리 방향을 잡고, 실제 제작량이 늘어난 뒤 로컬 전환을 검토하는 쪽이 현실적이다.

## 내 작업 체크리스트

발행 전에는 이 순서로 확인한다.

- [ ] 보이스 프롬프트를 저장했는가?
- [ ] 10초 테스트 대본으로 발음과 톤을 확인했는가?
- [ ] 같은 문장을 2~3번 생성해 일관성을 봤는가?
- [ ] 영상 BGM 위에서도 잘 들리는가?
- [ ] 사용한 서비스의 상업 이용 조건과 표시 의무를 확인했는가?
- [ ] 생성 음성을 다른 AI 모델 학습 데이터로 넣지 않는 흐름으로 정리했는가?

## 참고 링크

- [ElevenLabs Voice Design 공식 문서](https://elevenlabs.io/docs/eleven-creative/voices/voice-design)
- [ElevenLabs Prohibited Use Policy](https://elevenlabs.io/use-policy)
- [OpenBMB VoxCPM GitHub](https://github.com/OpenBMB/VoxCPM)
