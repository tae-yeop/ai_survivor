# Windows에서 yt-dlp 설치하고 첫 영상 내려받기


## 결론 먼저

이 글은 Windows에서 `yt-dlp`를 처음 쓰기 위한 설치 메모다. 목표는 세 가지다.

1. `yt-dlp`를 설치한다.
2. `ffmpeg`와 `ffprobe`가 같이 잡히는지 확인한다.
3. 내가 권리를 가진 영상이나 다운로드가 허용된 자료를 한 번 내려받아 본다.

`yt-dlp`는 강력하지만, 유료 콘텐츠나 접근 제한 영상, 서비스가 다운로드를 막아 둔 영상을 우회하기 위한 도구로 쓰면 안 된다. 이 글의 전제는 내가 만든 영상, 내가 업로드한 파일, 라이선스상 다운로드가 허용된 자료만 받는 것이다.

## 0. 먼저 확인할 것

PowerShell을 열고 아래 세 가지를 확인한다.

```powershell
winget --version
python --version
ffmpeg -version
```

- `winget`이 있으면 설치가 제일 쉽다.
- `python`은 필수는 아니지만 pip 설치나 다른 도구와 같이 쓸 때 도움이 된다.
- `ffmpeg`가 없으면 영상+오디오 병합이나 mp3 추출에서 막힐 수 있다.

`yt-dlp` 공식 README도 Windows에서는 standalone `yt-dlp.exe`를 추천하고, 별도 영상/오디오 병합과 후처리에는 `ffmpeg`와 `ffprobe`가 필요하다고 설명한다.

## 1. 가장 쉬운 설치: winget으로 설치

Windows 10/11에서 `winget`이 된다면 우선 이 방법으로 설치한다.

```powershell
winget install yt-dlp
```

설치 후 새 PowerShell을 열고 확인한다.

```powershell
yt-dlp --version
yt-dlp --help
```

업데이트는 아래처럼 한다.

```powershell
winget upgrade yt-dlp
```

만약 `yt-dlp` 명령을 찾지 못한다면 PowerShell을 완전히 닫았다가 다시 열어 본다. 그래도 안 되면 PATH가 갱신되지 않았거나 설치 위치가 잡히지 않은 것이다. 이 경우 아래의 portable 설치 방식이 더 확실하다.

## 2. 확실한 방법: portable 폴더에 직접 설치

나는 작업용 도구를 한 폴더에 모아두는 편이 관리하기 쉽다. 예를 들어 `C:\Tools\yt-dlp`를 만든다.

```powershell
New-Item -ItemType Directory -Force C:\Tools\yt-dlp
cd C:\Tools\yt-dlp
```

공식 release의 Windows 실행 파일을 내려받는다.

```powershell
Invoke-WebRequest `
  -Uri "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe" `
  -OutFile "C:\Tools\yt-dlp\yt-dlp.exe"
```

바로 실행해 본다.

```powershell
C:\Tools\yt-dlp\yt-dlp.exe --version
```

매번 전체 경로를 치기 싫다면 사용자 PATH에 추가한다.

```powershell
[Environment]::SetEnvironmentVariable(
  "Path",
  [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Tools\yt-dlp",
  "User"
)
```

그 다음 PowerShell을 새로 열고 확인한다.

```powershell
yt-dlp --version
```

portable 방식으로 설치했다면 같은 폴더에 `yt-dlp.conf`를 둘 수 있어서 설정을 관리하기 편하다.

## 3. ffmpeg 설치 확인

`yt-dlp`만 있어도 단일 파일 다운로드는 되는 경우가 있지만, YouTube처럼 영상과 오디오가 분리된 포맷을 받을 때는 `ffmpeg`가 필요하다. 먼저 현재 잡히는지 확인한다.

```powershell
ffmpeg -version
ffprobe -version
```

둘 중 하나라도 안 잡히면 `ffmpeg`를 설치해야 한다. 방법은 여러 가지지만, 나는 둘 중 하나를 쓴다.

### 방법 A: winget으로 설치

```powershell
winget search ffmpeg
winget install ffmpeg
```

설치 후 PowerShell을 새로 열고 다시 확인한다.

```powershell
ffmpeg -version
ffprobe -version
```

### 방법 B: yt-dlp 폴더에 같이 둔다

PATH가 자주 꼬이면 `ffmpeg.exe`와 `ffprobe.exe`를 `yt-dlp.exe`와 같은 폴더에 두는 방식이 제일 단순하다.

```text
C:\Tools\yt-dlp\
  yt-dlp.exe
  ffmpeg.exe
  ffprobe.exe
```

이렇게 두면 `yt-dlp`가 같은 폴더의 `ffmpeg`를 찾기 쉽다. 공개 글에서는 특정 비공식 배포 파일을 고정하기보다, 공식 FFmpeg 또는 yt-dlp가 안내하는 FFmpeg builds를 확인해서 받는 쪽으로 남겨 둔다.

## 4. 첫 다운로드 전에 포맷 목록부터 보기

URL을 바로 받기 전에 먼저 포맷을 확인한다.

```powershell
yt-dlp -F "<영상 URL>"
```

여기서 봐야 할 것은 `format id`, 확장자, 해상도, 오디오 포함 여부다. 포맷 id는 영상마다 달라질 수 있으므로 `96` 같은 숫자를 정답처럼 외우면 안 된다.

## 5. 기본 다운로드 명령어

대부분의 경우에는 최고 품질의 영상과 오디오를 받고 mp4로 병합하는 식으로 시작한다.

```powershell
yt-dlp `
  -f "bv*+ba/b" `
  --merge-output-format mp4 `
  --fragment-retries 10 `
  --retries 3 `
  --retry-sleep fragment:exp=1:20 `
  -o "downloads/%(upload_date)s-%(title).120B.%(ext)s" `
  "<영상 URL>"
```

옵션 의미는 이렇다.

- `-f "bv*+ba/b"`: 가능한 경우 best video와 best audio를 합치고, 안 되면 best 단일 포맷을 받는다.
- `--merge-output-format mp4`: 병합 결과를 mp4로 맞춘다.
- `--fragment-retries 10`: HLS/DASH 조각 다운로드 실패 시 조각별 재시도 횟수다.
- `--retries 3`: 일반 다운로드 재시도 횟수다.
- `--retry-sleep fragment:exp=1:20`: 조각 재시도 사이에 점진적으로 쉰다.
- `-o`: 저장 파일명을 일정하게 만든다.

`downloads` 폴더가 없다면 먼저 만든다.

```powershell
New-Item -ItemType Directory -Force downloads
```

## 6. 특정 format id를 바로 받을 때

포맷 목록에서 원하는 id를 확인했다면 아래처럼 받을 수 있다.

```powershell
yt-dlp -f 96 --fragment-retries 10 --retries 3 "<영상 URL>"
```

이 방식은 빠르지만 포맷 id가 영상마다 달라질 수 있다. 그래서 항상 `yt-dlp -F`로 먼저 확인한다.

## 7. 업데이트 방법

portable 실행 파일을 직접 받은 경우에는 아래 명령으로 업데이트할 수 있다.

```powershell
yt-dlp -U
```

winget으로 설치했다면 winget 업데이트를 우선한다.

```powershell
winget upgrade yt-dlp
```

공식 README 기준으로 release binary는 `yt-dlp -U` 업데이트가 가능하고, pip로 설치한 경우에는 처음 설치에 사용한 pip 명령을 다시 실행하는 방식이다.

## 8. 자주 나는 문제

### `yt-dlp`를 찾을 수 없다고 나옴

새 PowerShell을 열어 본다. 그래도 안 되면 아래처럼 전체 경로로 실행한다.

```powershell
C:\Tools\yt-dlp\yt-dlp.exe --version
```

전체 경로는 되는데 `yt-dlp`만 안 되면 PATH 문제다.

### `ffmpeg`나 `ffprobe`를 찾을 수 없다고 나옴

아래 명령이 되는지 확인한다.

```powershell
ffmpeg -version
ffprobe -version
```

안 되면 PATH에 없거나 설치가 안 된 것이다. 가장 단순한 해결은 `yt-dlp.exe`와 같은 폴더에 `ffmpeg.exe`, `ffprobe.exe`를 두는 것이다.

### 다운로드가 중간에 자꾸 끊김

네트워크가 불안정하거나 조각 다운로드가 실패하는 경우가 있다. 이때는 재시도 옵션을 늘린다.

```powershell
yt-dlp --fragment-retries 20 --retries 10 "<영상 URL>"
```

### 브라우저에서 본 blob URL을 받을 수 없음

브라우저 개발자 도구에서 보이는 `blob:` 주소는 브라우저 내부의 임시 참조에 가깝다. 그 문자열을 그대로 넣는다고 안정적으로 다운로드되는 것이 아니다. 공개적으로 허용된 원본 URL, 공유 링크, 또는 서비스가 제공하는 다운로드 버튼을 사용한다.

## 9. 내가 쓰는 최소 루틴

1. 다운로드 권한이 있는 URL인지 확인한다.
2. `yt-dlp --version`으로 설치를 확인한다.
3. `ffmpeg -version`, `ffprobe -version`을 확인한다.
4. `yt-dlp -F "<영상 URL>"`로 포맷을 본다.
5. 짧은 테스트 다운로드를 먼저 한다.
6. 결과 파일의 영상/오디오 싱크를 확인한다.
7. 문제가 없으면 같은 명령을 스크립트로 저장한다.

## 참고 링크

- [yt-dlp Installation Wiki](https://github.com/yt-dlp/yt-dlp/wiki/Installation)
- [yt-dlp GitHub README](https://github.com/yt-dlp/yt-dlp)
- [yt-dlp FFmpeg Builds](https://github.com/yt-dlp/FFmpeg-Builds)
