// Four-locale copy for /hobocode/. Korean is the review language; English is canonical.
const base = {
 "ko": {
  "lang": "ko",
  "prefix": "/ko",
  "title": "호보코드 — 다음에 기억할 내용을 장소에 남겨두세요.",
  "description": "주차장 입구, 다음에 주문할 메뉴처럼 기억할 내용을 장소에 남겨두세요. 장소 알림을 켜두면 다시 근처에 왔을 때 알려드려요.",
  "skip": "본문으로",
  "about": "사용 방법",
  "soon": "App Store 준비 중",
  "eyebrow": "장소에 남겨두는 메모",
  "hero": "여기 오면<br>기억하려고 했는데,<br><em>또 까먹었다.</em>",
  "intro": "다음에 기억할 내용을 장소에 남겨두세요.<br>장소 알림을 켜두면, 다시 근처에 왔을 때 알려드려요.",
  "explore": "사용 방법 보기",
  "end": "다음에 기억할 일,<br>지금 적어두세요.",
  "endBody": "iPhone용 호보코드를 준비하고 있어요.<br>출시 전이라 화면은 달라질 수 있어요.",
  "privacy": "개인정보 처리방침",
  "support": "지원"
 },
 "en": {
  "lang": "en",
  "prefix": "",
  "title": "Hobocode — Figure it out once. Use it next time.",
  "description": "The parking entrance. The quiet table. Save a note with a place and enable an alert for your next visit.",
  "skip": "Skip to content",
  "about": "How it works",
  "soon": "Coming to the App Store",
  "eyebrow": "Keep the tips you learned the hard way.",
  "hero": "Figure it out once.<br><em>Use it next time.</em>",
  "intro": "Parking around the back. Quiet seats inside.<br>Leave a note and turn on a place alert.<br>Get a reminder when you’re nearby again.",
  "explore": "See a small note earn its keep",
  "end": "Before another lap<br>around the block.",
  "endBody": "Hobocode for iPhone is on the way.<br>Development screens may change before release.",
  "privacy": "Privacy",
  "support": "Support"
 },
 "ja": {
  "lang": "ja",
  "prefix": "/ja",
  "title": "ホボコード — 一度わかったこと、次は役立てよう。",
  "description": "駐車場の入口も、静かな席も。場所にメモを残し、通知をオンにすると、また近くに来たときにお知らせします。",
  "skip": "本文へ",
  "about": "使い方",
  "soon": "App Store 公開準備中",
  "eyebrow": "迷って見つけたコツを、自分のものに。",
  "hero": "一度わかったこと、<br><em>次は役立てよう。</em>",
  "intro": "駐車場の入口は裏側。静かな席は奥。<br>ひと言残して、場所の通知をオンに。<br>また近くに来たら、お知らせします。",
  "explore": "ひと言が役立つ、そのときへ",
  "end": "もう一周する前に、<br>ひと言残しておこう。",
  "endBody": "iPhone 向けホボコードを準備中です。<br>開発中の画面は公開前に変わる場合があります。",
  "privacy": "プライバシー",
  "support": "サポート"
 },
 "zh-hans": {
  "lang": "zh-Hans",
  "prefix": "/zh-hans",
  "title": "Hobocode — 好不容易弄明白，下次就派上用场。",
  "description": "停车入口、安静的座位。给地点留一句笔记并开启提醒，再次来到附近时就能想起来。",
  "skip": "跳到正文",
  "about": "使用方式",
  "soon": "App Store 上线准备中",
  "eyebrow": "把绕过的弯路，变成自己的小窍门。",
  "hero": "好不容易弄明白，<br><em>下次就派上用场。</em>",
  "intro": "停车入口在后面，安静的座位在里面。<br>留一句笔记，开启地点提醒。<br>下次来到附近时，我们提醒你。",
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
    "잠금 화면 알림에서 메모 내용을 바로 볼 수 있어요."
   ]
  ],
  "conditions": "위치·알림 권한이 필요해요. 앱을 쓰지 않을 때도 알림을 받으려면 위치를 ‘항상 허용’으로 설정해 주세요.",
  "place": "한길전골",
  "sceneNote": "그림 지도 · 실제 지역이 아니에요",
  "notifAlt": "잠금 화면 알림: 근처에 저장한 메모가 있어요. 둘이 오면 전골 소짜 + 볶음밥 하나. 이 조합이 딱 좋았음. #주문팁 외 1개",
  "notifCaption": "잠금 화면 알림 · 개발 빌드의 실제 화면, 메모는 예시",
  "screensTitle": "앱에서는 이렇게 보여요.",
  "screensBody": "지금 개발 중인 앱의 실제 화면이에요.",
  "screens": [
   [
    "home",
    "홈",
    "지금 있는 곳 근처에 남긴 메모를 먼저 보여줘요.",
    "호보코드 홈 화면. 철길 마을 그림 아래 흰 페인트 메모에 소담카페 메모와 라테 사진이 있고, 아래에 지도가 있습니다."
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
    "호보코드 장소 화면. 이 장소 도착 알림이 켜져 있고 알림 반경 100m가 선택되어 있습니다."
   ]
  ],
  "disclosure": "2026년 10월 14일 개발 빌드의 실제 화면이에요. 화면 속 장소·메모·사진은 설명을 위한 예시이고, 출시 전에 화면이 바뀔 수 있어요. 이 웹페이지에서는 지도나 알림 기능을 쓸 수 없어요."
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
    "Read the note right from the Lock Screen notification."
   ]
  ],
  "conditions": "Location and notification permissions required. To get alerts when you’re not using the app, set location access to “Always”.",
  "place": "Hangil Jeongol",
  "sceneNote": "Illustrated map · not a real area",
  "notifAlt": "Lock Screen notification in Korean: there is a saved note nearby. For two, a small hot pot and one fried rice; this combo was perfect. #ordertip, and 1 more",
  "notifCaption": "Lock Screen notification · actual development build screen (Korean), example note",
  "screensTitle": "What it looks like in the app.",
  "screensBody": "Actual screens from the app in development.",
  "screens": [
   [
    "home",
    "Home",
    "Shows the notes you left near where you are now.",
    "Hobocode home screen in Korean: a white paint note for Café Sodam with a latte photo below a rail-town silhouette, and a map below."
   ],
   [
    "map",
    "Map",
    "Find your saved places on the map.",
    "Hobocode map screen in Korean: saved place marks and the current location around Seoul City Hall."
   ],
   [
    "alert",
    "Place alert",
    "Turn on alerts and pick a radius for each place.",
    "Hobocode place screen in Korean: arrival alert for this place is on and a 100 m radius is selected."
   ]
  ],
  "disclosure": "Actual screens from the October 14, 2026 development build. Places, notes and photos are examples, and screens may change before release. Map and notification features don’t work on this website."
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
    "ロック画面の通知で、メモの内容をすぐ確認できます。"
   ]
  ],
  "conditions": "位置情報と通知の許可が必要です。アプリを使っていないときも通知を受け取るには、位置情報を「常に」に設定してください。",
  "place": "ハンギル鍋",
  "sceneNote": "イラストの地図 · 実在の地域ではありません",
  "notifAlt": "韓国語のロック画面通知：近くに保存したメモがあります。二人なら鍋の小と焼き飯ひとつ、この組み合わせが最高。#注文のコツ ほか1件",
  "notifCaption": "ロック画面の通知 · 開発ビルドの実際の画面（韓国語）、メモは例",
  "screensTitle": "アプリではこう見えます。",
  "screensBody": "開発中のアプリの実際の画面です。",
  "screens": [
   [
    "home",
    "ホーム",
    "いる場所の近くに残したメモを先に表示します。",
    "韓国語のホボコードのホーム画面：線路沿いの町のシルエットの下に、ラテの写真付きのカフェのメモ、その下に地図。"
   ],
   [
    "map",
    "地図",
    "メモした場所を地図で探せます。",
    "韓国語のホボコードの地図画面：ソウル市庁周辺に、メモした場所の印と現在地。"
   ],
   [
    "alert",
    "場所の通知",
    "場所ごとに通知をオンにして範囲を決めます。",
    "韓国語のホボコードの場所画面：この場所の到着通知がオンで、通知範囲100mが選択されている。"
   ]
  ],
  "disclosure": "2026年10月14日の開発ビルドの実際の画面です。場所・メモ・写真は説明用の例で、公開前に画面が変わる場合があります。このウェブでは地図・通知機能は使えません。"
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
    "在锁屏通知里就能看到笔记内容。"
   ]
  ],
  "conditions": "需要位置和通知权限。若想在不使用应用时也收到提醒，请把位置权限设为“始终”。",
  "place": "韩吉火锅",
  "sceneNote": "插画地图 · 并非真实地区",
  "notifAlt": "韩语锁屏通知：附近有保存的笔记。两个人点小份火锅加一份炒饭，这个组合刚刚好。#点餐窍门，另有1条",
  "notifCaption": "锁屏通知 · 开发版本的真实画面（韩语），笔记为示例",
  "screensTitle": "在应用里是这样的。",
  "screensBody": "开发中应用的真实画面。",
  "screens": [
   [
    "home",
    "首页",
    "优先显示你现在所在位置附近的笔记。",
    "韩语的 Hobocode 首页：铁路小镇剪影下方的白漆笔记里有咖啡馆笔记和拿铁照片，下方是地图。"
   ],
   [
    "map",
    "地图",
    "在地图上找到记过笔记的地点。",
    "韩语的 Hobocode 地图：首尔市政厅周边显示记过笔记的地点标记和当前位置。"
   ],
   [
    "alert",
    "地点提醒",
    "为每个地点开启提醒并设置范围。",
    "韩语的 Hobocode 地点页面：此地点的到达提醒已开启，并选择了100米的提醒范围。"
   ]
  ],
  "disclosure": "画面来自2026年10月14日开发版本的真实应用。地点、笔记和照片为说明用的示例，发布前画面可能调整。本网站不提供地图或通知功能。"
 }
};
export const copy = Object.fromEntries(Object.keys(base).map(k => [k, { ...base[k], ...extra[k] }]));

