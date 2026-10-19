// Four-locale copy for /hobocode/. Korean is the review language; English is canonical.
const base = {
 "ko": {
  "lang": "ko",
  "prefix": "/ko",
  "title": "호보코드 | iPhone용 장소 메모 앱",
  "description": "장소마다 기억할 내용을 메모와 사진, 나만의 표식으로 남겨보세요. 호보코드는 주차 위치부터 다시 찾을 공간까지 기록하는 iPhone용 장소 메모 앱입니다. App Store 출시 준비 중.",
  "skip": "본문으로",
  "about": "사용 방법",
  "soon": "App Store 준비 중",
  "eyebrow": "장소에 남겨두는 메모",
  "hero": "여기 오면<br>기억하려고 했는데,<br><em>또 까먹었다.</em>",
  "intro": "호보코드는 메모와 사진, 나만의 표식을 장소에 남기는<br>iPhone용 장소 메모 앱입니다.",
  "explore": "사용 방법 보기",
  "end": "다음에 기억할 일,<br>지금 적어두세요.",
  "endBody": "iPhone용 호보코드를 준비하고 있어요.<br>출시 전이라 화면은 달라질 수 있어요.",
  "privacy": "개인정보 처리방침",
  "support": "지원"
 },
 "en": {
  "lang": "en",
  "prefix": "",
  "title": "Hobocode | Location Notes for iPhone",
  "description": "Keep notes, photos, and personal markers for places you want to remember. Hobocode is a location notes app for iPhone. App Store release coming soon.",
  "skip": "Skip to content",
  "about": "How it works",
  "soon": "Coming to the App Store",
  "eyebrow": "Keep the tips you learned the hard way.",
  "hero": "Figure it out once.<br><em>Use it next time.</em>",
  "intro": "Keep notes, photos, and personal markers for places.<br>Hobocode is a location notes app for iPhone.",
  "explore": "See a small note earn its keep",
  "end": "Before another lap<br>around the block.",
  "endBody": "Hobocode for iPhone is on the way.<br>Development screens may change before release.",
  "privacy": "Privacy",
  "support": "Support"
 },
 "ja": {
  "lang": "ja",
  "prefix": "/ja",
  "title": "Hobocode | iPhoneの場所メモアプリ",
  "description": "覚えておきたい場所に、メモや写真、自分だけのマークを。HobocodeはiPhone向けの場所メモアプリです。App Storeでの公開に向けて準備中。",
  "skip": "本文へ",
  "about": "使い方",
  "soon": "App Store 公開準備中",
  "eyebrow": "迷って見つけたコツを、自分のものに。",
  "hero": "一度わかったこと、<br><em>次は役立てよう。</em>",
  "intro": "場所にメモや写真、自分だけのマークを。<br>HobocodeはiPhone向けの場所メモアプリです。",
  "explore": "ひと言が役立つ、そのときへ",
  "end": "もう一周する前に、<br>ひと言残しておこう。",
  "endBody": "iPhone 向けホボコードを準備中です。<br>開発中の画面は公開前に変わる場合があります。",
  "privacy": "プライバシー",
  "support": "サポート"
 },
 "zh-hans": {
  "lang": "zh-Hans",
  "prefix": "/zh-hans",
  "title": "Hobocode | iPhone 地点笔记应用",
  "description": "为想记住的地点保存笔记、照片和专属标记。Hobocode 是一款 iPhone 地点笔记应用，正在准备上架 App Store。",
  "skip": "跳到正文",
  "about": "使用方式",
  "soon": "App Store 上线准备中",
  "eyebrow": "把绕过的弯路，变成自己的小窍门。",
  "hero": "好不容易弄明白，<br><em>下次就派上用场。</em>",
  "intro": "为地点保存笔记、照片和专属标记。<br>Hobocode 是一款 iPhone 地点笔记应用。",
  "explore": "看看一句话怎么派上用场",
  "end": "再绕一圈之前，<br>先留一句吧。",
  "endBody": "iPhone 版 Hobocode 正在准备中。<br>开发画面可能在发布前调整。",
  "privacy": "隐私政策",
  "support": "支持"
 }
};
const extra = {
 "ko": {
  "replay": "다시 보기",
  "heroMemo": {
   "place": "카페 온유",
   "dist": "→ 9m",
   "body": "드립백은 산미 적은 걸로.<br>다음엔 원두도 물어보기.",
   "date": "Oct 15"
  },
  "heroAlt": "철길을 지나 벽돌 벽에 분필로 그린 ⊗ 표식에 다가가는 짧은 영상",
  "wallTitle": "장소마다 메모를 남겨요.",
  "wallBody": "주차장 입구나 다음에 주문할 메뉴처럼, 다음에 여기 오면 필요한 걸 적어두세요.",
  "wallLabel": "장소 메모 예시",
  "pause": "움직임 멈추기",
  "play": "다시 움직이기",
  "memos": [
   [
    "parking",
    "주차장",
    "→ 9m",
    "입구는 건물 뒤쪽.<br>지하 2층이 덜 붐벼요.",
    "Oct 3"
   ],
   [
    "spoon-fork",
    "한길전골",
    "→ 40m",
    "둘이 오면 전골 소짜 + 볶음밥 하나.",
    "Aug 15"
   ],
   [
    "cup",
    "소담카페",
    "→ 12m",
    "라테는 덜 달게.<br>다음엔 창가 쪽에 앉기.",
    "Oct 14"
   ],
   [
    "toilet",
    "백화점",
    "→ 25m",
    "화장실은 에스컬레이터 뒤쪽이 덜 붐벼요.",
    "Sep 28"
   ],
   [
    "calendar",
    "문화센터",
    "→ 60m",
    "수요일 수업은 3층 302호.",
    "Sep 9"
   ],
   [
    "tree",
    "산책길",
    "→ 120m",
    "돌아올 때는 강변으로.",
    "Oct 1"
   ]
  ],
  "arriveTitle": "다시 근처에 오면<br>알려드려요.",
  "steps": [
   [
    "장소 알림을 켜면",
    "메모한 장소마다 알림 반경을 정해요. 50m부터 500m까지 고를 수 있어요."
   ],
   [
    "그 근처에 다시 오면",
    "내 위치가 알림 반경 안에 들어왔는지 확인해요."
   ],
   [
    "남겨둔 메모를 알려드려요",
    "알림을 누르고 앱에서 메모를 확인해요."
   ]
  ],
  "conditions": "위치·알림 권한이 필요해요. 앱을 쓰지 않을 때도 알림을 받으려면 위치 접근을 “항상”으로 설정하세요. 아래 예시는 기본 설정처럼 메모 본문을 숨긴 알림이에요.",
  "place": "한길전골",
  "notifAlt": "호보코드가 가상 도착 조건에서 보낸 한국어 iOS 알림. 메모 본문은 기본 설정대로 숨겨져 있어요.",
  "screensTitle": "앱에서는 이렇게 보여요.",
  "screensBody": "한국어 앱의 실제 화면이에요. 현재 앱은 한국어와 영어를 지원해요.",
  "screens": [
   [
    "home",
    "홈",
    "지금 있는 곳 근처에 남긴 메모를 먼저 보여줘요.",
    "호보코드 홈 화면. 장소명 앞 표식과 합성 카페 메모가 있는 흰 페인트 카드, 아래에 실제 네이버 지도가 있습니다."
   ],
   [
    "map",
    "지도",
    "메모한 장소를 지도에서 찾아봐요.",
    "호보코드 지도 화면. 서울시청 주변 지도에 메모한 장소 표식과 현재 위치가 보입니다."
   ],
   [
    "alert",
    "장소 알림",
    "장소마다 알림을 켜고 반경을 정해요.",
    "호보코드 장소 설정 화면. 합성 카페의 도착 알림은 꺼져 있고 반경 100m가 선택되어 있습니다."
   ],
   [
    "editor",
    "메모",
    "장소와 지도를 확인하며 메모를 읽고 고쳐요.",
    "호보코드 메모 화면. 합성 카페의 장소 카드와 지도, 메모 본문, 아래 도구 줄이 보입니다."
   ],
   [
    "mark",
    "나만의 표식",
    "메모에 어울리는 표식을 골라요.",
    "호보코드 메모 표식 선택창. 본문 아래에 분필 모양 표식 목록이 펼쳐져 있습니다."
   ],
   [
    "onboarding",
    "처음 시작할 때",
    "장소에 메모를 남기는 방법을 소개해요.",
    "호보코드 실제 첫 실행 화면. 벽의 분필 표식과 예시 메모, 다음 버튼이 보입니다."
   ]
  ],
  "disclosure": "2026년 10월 19일 개발 빌드에서 촬영했어요. 장소·메모·위치는 검증용 가상 예시이며 출시 전에 화면이 바뀔 수 있어요. 이 웹페이지에서는 지도나 알림 기능을 쓸 수 없어요.",
  "mediaLocale": "ko",
  "studio": "제작사 아로이도",
  "products": "아로이도 제품",
  "walkthrough": "한국어 앱 둘러보기",
  "notificationCaption": "앱이 보낸 한국어 알림 예시 · 가상 도착 조건으로 촬영"
 },
 "en": {
  "replay": "Replay",
  "heroMemo": {
   "place": "Café Onyu",
   "dist": "→ 9m",
   "body": "Get the low-acid drip bags.<br>Ask about the beans next time.",
   "date": "Oct 15"
  },
  "heroAlt": "Short video passing a railway and stopping at a chalk ⊗ mark on a brick wall",
  "wallTitle": "Leave a note for each place.",
  "wallBody": "The parking entrance, what to order next time. Write down what you’ll need when you’re back.",
  "wallLabel": "Example place notes",
  "pause": "Pause motion",
  "play": "Resume motion",
  "memos": [
   [
    "parking",
    "Parking",
    "→ 9m",
    "Entrance is behind the building.<br>B2 is less busy.",
    "Oct 3"
   ],
   [
    "spoon-fork",
    "Hangil Jeongol",
    "→ 40m",
    "For two: small hot pot + one fried rice.",
    "Aug 15"
   ],
   [
    "cup",
    "Café Sodam",
    "→ 12m",
    "Latte, less sweet.<br>Sit by the window next time.",
    "Oct 14"
   ],
   [
    "toilet",
    "Department store",
    "→ 25m",
    "Restrooms behind the escalator are quieter.",
    "Sep 28"
   ],
   [
    "calendar",
    "Community center",
    "→ 60m",
    "Wednesday class: 3rd floor, room 302.",
    "Sep 9"
   ],
   [
    "tree",
    "Walking route",
    "→ 120m",
    "Take the riverside on the way back.",
    "Oct 1"
   ]
  ],
  "arriveTitle": "Back again?<br>Your note says hello.",
  "steps": [
   [
    "Turn on a place alert",
    "Set an alert radius for each saved place, from 50 m to 500 m."
   ],
   [
    "Come near it again",
    "Hobocode checks whether you’re inside that radius."
   ],
   [
    "See your note",
    "Open the app from the notification to read your notes."
   ]
  ],
  "conditions": "Location and notification permissions are required. Set location access to “Always” for alerts while the app is not in use. The example below hides note text, as the default setting does.",
  "place": "Hangil Jeongol",
  "notifAlt": "English iOS notification sent by Hobocode under synthetic arrival conditions. Note text is hidden by default.",
  "screensTitle": "What it looks like in the app.",
  "screensBody": "Actual screens in English. The app currently supports Korean and English.",
  "screens": [
   [
    "home",
    "Home",
    "Shows the notes you left near where you are now.",
    "English Hobocode home with a synthetic Demo Cafe note and Apple Maps."
   ],
   [
    "map",
    "Map",
    "Find your saved places on the map.",
    "English Hobocode map with synthetic saved places near Seoul City Hall."
   ],
   [
    "alert",
    "Place alert",
    "Turn on alerts and pick a radius for each place.",
    "English place settings: Demo Cafe arrival alerts off and a 330 ft radius."
   ],
   [
    "editor",
    "Notes",
    "Read and edit a note alongside its place and map.",
    "English note editor with a synthetic Demo Cafe note and place map."
   ],
   [
    "mark",
    "Your own mark",
    "Choose a mark that fits your note.",
    "English note sign picker with sixteen chalk symbols."
   ],
   [
    "onboarding",
    "Getting started",
    "An introduction to leaving notes at places.",
    "English first-run screen with an example note and Next button."
   ]
  ],
  "disclosure": "Captured on October 19, 2026 from a development build. Notes, places and locations are synthetic examples. Screens may change before release. Map and notification features do not work on this website.",
  "mediaLocale": "en",
  "studio": "Made by Aroido",
  "products": "Aroido products",
  "walkthrough": "Explore the app in English",
  "notificationCaption": "English notification sent by the app · synthetic arrival conditions"
 },
 "ja": {
  "replay": "もう一度見る",
  "heroMemo": {
   "place": "カフェ・オンユ",
   "dist": "→ 9m",
   "body": "ドリップバッグは酸味少なめ。<br>次は豆のことも聞く。",
   "date": "Oct 15"
  },
  "heroAlt": "線路を通り過ぎ、レンガの壁にチョークで描かれた⊗の印に近づく短い動画",
  "wallTitle": "場所ごとにメモを残す。",
  "wallBody": "駐車場の入口や、次に頼むメニューのように。次にここへ来たとき必要なことを書いておきましょう。",
  "wallLabel": "場所メモの例",
  "pause": "動きを止める",
  "play": "動きを再開",
  "memos": [
   [
    "parking",
    "駐車場",
    "→ 9m",
    "入口は建物の裏側。<br>地下2階が空いてる。",
    "Oct 3"
   ],
   [
    "spoon-fork",
    "ハンギル鍋",
    "→ 40m",
    "二人なら鍋の小＋焼き飯ひとつ。",
    "Aug 15"
   ],
   [
    "cup",
    "カフェ・ソダム",
    "→ 12m",
    "ラテは甘さ控えめ。<br>次は窓際に座る。",
    "Oct 14"
   ],
   [
    "toilet",
    "デパート",
    "→ 25m",
    "エスカレーター裏のトイレが空いてる。",
    "Sep 28"
   ],
   [
    "calendar",
    "カルチャーセンター",
    "→ 60m",
    "水曜の教室は3階302号室。",
    "Sep 9"
   ],
   [
    "tree",
    "散歩道",
    "→ 120m",
    "帰りは川沿いの道へ。",
    "Oct 1"
   ]
  ],
  "arriveTitle": "また来たら、<br>メモがお出迎え。",
  "steps": [
   [
    "場所の通知をオンに",
    "メモした場所ごとに通知の範囲を50mから500mで選べます。"
   ],
   [
    "また近くに来たら",
    "現在地が通知の範囲に入ったかを確認します。"
   ],
   [
    "残したメモをお知らせ",
    "通知からアプリを開いて、メモを確認します。"
   ]
  ],
  "conditions": "位置情報と通知の許可が必要です。アプリ未使用時の通知には位置情報を「常に」に設定してください。下の例は初期設定と同じくメモ本文を隠しています。",
  "place": "ハンギル鍋",
  "notifAlt": "架空の到着条件でHobocodeが送信した英語のiOS通知。初期設定ではメモ本文は表示されません。",
  "screensTitle": "アプリではこう見えます。",
  "screensBody": "以下は英語版アプリの実際の画面です。現在の対応言語は韓国語と英語です。日本語版は未対応です。",
  "screens": [
   [
    "home",
    "ホーム",
    "いる場所の近くに残したメモを先に表示します。",
    "英語版のホーム：架空のカフェメモとApple地図。"
   ],
   [
    "map",
    "地図",
    "メモした場所を地図で探せます。",
    "英語版の地図：ソウル市庁付近の架空の保存場所。"
   ],
   [
    "alert",
    "場所の通知",
    "場所ごとに通知をオンにして範囲を決めます。",
    "英語版の場所設定：架空のカフェの到着通知はオフ、半径330フィート。"
   ],
   [
    "editor",
    "メモ",
    "場所と地図を確認しながら、メモを読んで編集します。",
    "英語版のメモ編集：架空のカフェメモと場所の地図。"
   ],
   [
    "mark",
    "自分だけの印",
    "メモに合う印を選びます。",
    "英語版のメモのマーク選択：16種類のチョークのマーク。"
   ],
   [
    "onboarding",
    "はじめに",
    "場所にメモを残す使い方を紹介します。",
    "英語版の初回画面：例のメモと次へボタン。"
   ]
  ],
  "disclosure": "2026年10月19日に開発ビルドから撮影しました。場所・メモ・位置は検証用の架空例です。公開前に画面が変わる場合があります。このサイトでは地図・通知機能は使えません。",
  "mediaLocale": "en",
  "studio": "制作元 Aroido",
  "products": "Aroidoの製品",
  "walkthrough": "英語版アプリの操作を見る",
  "notificationCaption": "アプリが送信した英語の通知例 · 架空の到着条件で撮影"
 },
 "zh-hans": {
  "replay": "重新播放",
  "heroMemo": {
   "place": "温柔咖啡",
   "dist": "→ 9m",
   "body": "挂耳选低酸的。<br>下次问问咖啡豆。",
   "date": "Oct 15"
  },
  "heroAlt": "一段短视频：经过铁路，停在砖墙上用粉笔画的⊗标记前",
  "wallTitle": "给每个地点留一句笔记。",
  "wallBody": "停车入口、下次要点的菜。把下次再来时用得上的事记下来。",
  "wallLabel": "地点笔记示例",
  "pause": "暂停动画",
  "play": "继续动画",
  "memos": [
   [
    "parking",
    "停车场",
    "→ 9m",
    "入口在建筑物后面。<br>地下二层人少。",
    "Oct 3"
   ],
   [
    "spoon-fork",
    "韩吉火锅",
    "→ 40m",
    "两个人：小份火锅＋一份炒饭。",
    "Aug 15"
   ],
   [
    "cup",
    "素淡咖啡",
    "→ 12m",
    "拿铁少糖。<br>下次坐窗边。",
    "Oct 14"
   ],
   [
    "toilet",
    "百货商店",
    "→ 25m",
    "扶梯后面的洗手间人少。",
    "Sep 28"
   ],
   [
    "calendar",
    "文化中心",
    "→ 60m",
    "周三的课在三楼302室。",
    "Sep 9"
   ],
   [
    "tree",
    "散步路线",
    "→ 120m",
    "回来时走河边。",
    "Oct 1"
   ]
  ],
  "arriveTitle": "又来了？<br>笔记来打个招呼。",
  "steps": [
   [
    "开启地点提醒",
    "为每个记过的地点设置提醒范围，可选50米到500米。"
   ],
   [
    "再次来到附近",
    "确认你的位置是否进入了提醒范围。"
   ],
   [
    "提醒你看笔记",
    "点击通知打开应用，查看笔记。"
   ]
  ],
  "conditions": "需要位置和通知权限。若要在未使用应用时收到提醒，请将位置访问设为“始终”。下方示例与默认设置一样隐藏笔记正文。",
  "place": "韩吉火锅",
  "notifAlt": "Hobocode在虚构到达条件下发送的英语iOS通知。默认隐藏笔记正文。",
  "screensTitle": "在应用里是这样的。",
  "screensBody": "以下为英语版应用的真实画面。目前应用支持韩语和英语，尚不支持简体中文。",
  "screens": [
   [
    "home",
    "首页",
    "优先显示你现在所在位置附近的笔记。",
    "英语版主页：虚构咖啡馆笔记和Apple地图。"
   ],
   [
    "map",
    "地图",
    "在地图上找到记过笔记的地点。",
    "英语版地图：首尔市政厅附近的虚构保存地点。"
   ],
   [
    "alert",
    "地点提醒",
    "为每个地点开启提醒并设置范围。",
    "英语版地点设置：虚构咖啡馆的到达提醒关闭，半径330英尺。"
   ],
   [
    "editor",
    "笔记",
    "查看地点和地图，阅读并修改笔记。",
    "英语版笔记编辑器：虚构咖啡馆笔记和地点地图。"
   ],
   [
    "mark",
    "自己的标记",
    "为笔记选择合适的标记。",
    "英语版笔记标记选择器：16种粉笔标记。"
   ],
   [
    "onboarding",
    "开始使用",
    "了解如何在地点留下笔记。",
    "英语版首次启动画面：示例笔记和下一步按钮。"
   ]
  ],
  "disclosure": "于2026年10月19日从开发版本中拍摄。地点、笔记和位置均为验证用虚构示例，发布前画面可能调整。本网站不提供地图或通知功能。",
  "mediaLocale": "en",
  "studio": "制作方 Aroido",
  "products": "Aroido 产品",
  "walkthrough": "观看英语版应用操作",
  "notificationCaption": "应用发送的英语通知示例 · 使用虚构到达条件拍摄"
 }
};
export const copy = Object.fromEntries(Object.keys(base).map(k => [k, { ...base[k], ...extra[k] }]));

