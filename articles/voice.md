# AI 보이스 만들기 2026.05 최신!

영상을 만들 때 음성이 필요한 경우가 많다. 
물론 내가 직접 녹음을 하면 좋겠지만 
나의 목소리가 충분히 매력적이 않거나 부담을 느끼거나
또 일일이 모든걸 녹음하기 힘들 때 AI 힘을 빌리도록 하자.

이는 크게 두 단계로 목소리 캐릭터, 아이덴티티 결정
우선 제일 유명한거 일레븐랩스
일레븐랩스 이외에 여러 서비스가 있지만 그냥
일레븐랩스가 제일 편하고 성능적으로도 가장 안정적임

이외에도 다른 플롯폼을 써보고 정리하면 다음과 같이 소개

일레븐랩스
1) 보이스 디자인
- 이는 완전히 새로운 보이스를 만들어주는것
- 
2) 보이스 리믹스
- 방금 만든 목소리를 다시 리믹스해보도록 하자. 
- 윈도우의 경우 음성녹음기 사용해서 녹음하기



보이스 하나 레퍼런스를 잘 만들어놓으면 그걸 계속 활용한다
문제는 목소리ㄹ

두 단계가 필요함
1. 목소리 아이덴티티 만들기

- 일레븐랩스 이용하기
예전부터 그리고 현재까지도 일레븐랩스에서 

2. 로컬에서 사용하기

그런데 일레븐랩스를 계속 쓰면 비용이 나간다. 
로컬에서 쓰려면?

voiceobox를 쓰도록 한다. 일레븐랩스의 오이오를 가지고 와서
보이스클로닝에 쓰도록 하기





## 1. 일레븐 랩스 이용하기

일레븐랩스에서 지원하는 기능들을 이용하기


### Voice Design


ElevenLabs는 프롬프트에 언어, 성별, 나이, 품질, 페르소나, 감정, 음색, 페이싱, 전달 방식을 구체적으로 쓰라고 권장합니다.
(https://elevenlabs.io/docs/eleven-creative/voices/voice-design#prompting-guide)


공식 포맷 구조는 다음과 같습니다.

Native <Language>. <Gender>, <Age range>. <Quality level>. Persona... Emotion...

```
Native <Language>. <Gender>, <Age range>. <Quality level>.
Persona: <2–5 words>. Emotion: <2–3 adjectives>.
<1–2 sentences about timbre, pacing, delivery>
```


```
Native Korean, standard Seoul Korean pronunciation. Male, late 20s to early 30s. Studio quality.
Persona: noir horror narrator. Emotion: calm, ominous, restrained.
A smooth low-baritone voice with a dark, velvety timbre, subtle breathiness, and crisp articulation. Speaks at a slow, deliberate pace with controlled pauses, intimate proximity, and quiet psychological tension, sounding elegant, cold, and unsettling without becoming theatrical or monstrous.
```

중요한 건 “accent”라는 단어를 함부로 쓰지 않는 것입니다. ElevenLabs가 “accent”를 억양이나 전달 방식 의미로 쓰면 원치 않는 방언/지역 억양이 나올 수 있다고 경고합니다. 한국어에서는 Korean accent보다는 Native Korean, standard Seoul Korean pronunciation, clear Korean articulation, controlled intonation처럼 쓰는 게 좋아요.


로컬에서 돌리기



## 2.  voicebox 이용하기


### Voice cloning


완전히 새로운 형태의 목소리


여기까지 하셨다면 일레븐랩스에서 만든 보이스를 받고 이걸 다시 로컬 보이스클론해서 사용하면 안되는가?
생각 할 수 있을텐데 아쉽게도 그렇게 하면 안된다. 만약 가능했으면 일레븐랩스 파산했겠죠?


ElevenLabs 출력물을 다른 AI/ML 모델의 입력·학습 데이터로 쓰는 행위가 약관상 별도 금지되어 있습니다.

대신 
ElevenLabs에서 만든 음성을 듣고, 비슷한 속성 프롬프트를 로컬 Voice Design 모델에 직접 입력 
이걸 가능



## 3. 일레븐랩스 대체제

일레븐랩스가 쓰기 편하지만 구독료 등 비용이 들게 되는데
로컬에서 컴퓨팅 자원이 충분히 갖추어져 있다면 해볼 수 있을만한 대체제는?


- https://github.com/OpenBMB/VoxCPM
