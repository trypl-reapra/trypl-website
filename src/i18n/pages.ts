/**
 * ページ本文の多言語辞書（日本語 / English / 한국어）。
 * ja を基準に型を推論し、en / ko は同じ形に揃える。
 * ※ 募集要項データ（data/internships）は日本語のまま。
 */

import { useLocale } from "@/i18n/LocaleProvider";

const ja = {
  tagline: "楽しく、遊ぶように。実践に挑戦する。",
  photoStrip: {
    eyebrow: "Community · 活動の様子",
    heading: "現場には、いつも仲間がいる。",
  },
  home: {
    tripleEyebrow: "The name · TrypL",
    tripleHeading: "名前に込めた、3つのL。",
    tryLine: "Try（挑戦）× Practice（実践）× pLay（楽しむ）",
    triple: [
      {
        key: "Learning",
        jp: "学び",
        line: "実践を通じた、本物の学び。",
        body: "知識や資格の取得ではなく、実際の現場に飛び込み、手を動かしながら「自分は何者か」「社会の中で何ができるか」を探っていく。",
      },
      {
        key: "Long-term",
        jp: "長期",
        line: "短期ではなく、長い時間軸で。",
        body: "目先の就活や報酬のためではなく、1年後・5年後・10年後というスケールで、社会と向き合い続ける。",
      },
      {
        key: "LifeMission",
        jp: "ライフミッション",
        line: "内発的動機から、人生の使命へ。",
        body: "「どう社会と関わりたいか」という内側から湧き出る動機を起点に、自分なりの貢献のかたちを深めていく。",
      },
    ],
  },
  headers: {
    about: {
      eyebrow: "About · TrypLとは",
      title: ["社会と共創する、", "その予備軍を。"],
      lead: "内発的動機を起点に、学生が社会と共創しながら学び、挑戦し、熟達していく。TrypLは、その実践機会を提供するコミュニティです。",
    },
    internships: {
      eyebrow: "Internships · 募集一覧",
      title: ["実践の、機会を。"],
      lead: "REAPRA および投資先企業での、選び抜かれたインターン。一つの現場に深く入り込むことも、半年単位で複数の現場を横断することもできます。",
    },
    events: {
      eyebrow: "Events · イベント",
      title: ["社会と出会う、", "最初の一歩を。"],
      lead: "説明会・座談会・ワークショップなど、TrypL ではさまざまなイベントを開催しています。最新の開催予定と参加のお申し込みはこちらから。",
    },
    contact: {
      eyebrow: "Contact · お問い合わせ",
      title: ["話してみよう。"],
      lead: "参加のご相談、取材・メディア、企業や大学との連携など。どんなことでも、お気軽にどうぞ。",
    },
    join: {
      eyebrow: "Join · 参加する",
      title: ["最初の一歩を、", "ここから。"],
      lead: "興味の登録から、説明会、そして実践へ。完璧である必要はありません。まずは気軽に、扉を開いてみてください。",
    },
    members: {
      eyebrow: "Members · メンバー専用",
      title: ["ようこそ、TrypL へ。"],
      lead: "メンバー限定のリンクと最新情報です。実践の現場へ、ここから。",
    },
  },
  about: {
    whatEyebrow: "What",
    whatLede:
      "TrypL は、REAPRA 発の「若年層向けインターンシップコミュニティ」です。",
    whatP1:
      "不透明度が増す社会において、若年層が長い時間軸をかけて「株式会社にまつわる仕事＝社会との繋がり」を通じて社会と共創し、熟達でイキイキ生きる（ウェルビーイング）きっかけを掴む——その場と機会を共創するプロジェクトです。",
    whatP2:
      "就活や報酬・お金ドリブンではなく、「自分は何者か」「どう社会に関わりたいか」という内発的な動機を持つ学生が、実際の企業活動を通じて「社会と共創する熟達」の一歩を踏み出していきます。",
    nameEyebrow: "The name",
    nameHeading: "名前に込めた、3つのL。",
    triple: [
      {
        key: "Learning",
        jp: "学び",
        body: "知識や資格の取得ではなく、実際の現場に飛び込み、手を動かしながら「自分は何者か」「社会の中で何ができるか」を探っていく。",
      },
      {
        key: "Long-term",
        jp: "長期",
        body: "目先の就活や報酬のためではなく、1年後・5年後・10年後というスケールで、社会と向き合い続ける姿勢を育てる。",
      },
      {
        key: "LifeMission",
        jp: "ライフミッション",
        body: "「どう社会と関わりたいか」という内側から湧き出る動機を起点に、自分なりの貢献のかたちを深めていく。",
      },
    ],
    words: [
      { en: "Try", jp: "挑戦" },
      { en: "Practice", jp: "実践" },
      { en: "pLay", jp: "楽しむ" },
    ],
    nameTagline:
      "「楽しく遊ぶように、実践に挑戦する」。読み方は “トリプル”。その姿勢を、名前そのものに込めています。",
    reapraEyebrow: "REAPRA にとっての意義",
    reapraHeading: ["長く続く、", "芯を食った内発的動機を。"],
    reapraP1:
      "REAPRA は「産業創造の研究実践」をミッションに、世代を跨ぐ長い時間軸で社会課題を解決する産業を創り、そのリーダーを育んでいます。その核心にあるのが、外発的・短期的な成功ではなく、自分の内面から湧き出る使命感を問い続けるアプローチです。",
    reapraP2:
      "TrypL を通じて内発的動機と向き合った学生たちが、5年後・10年後に自分のキャリアや届けたい社会を持って、再び REAPRA のエコシステムに接続してくれる。それも、TrypL が持つ長期的な意義です。",
    visionEyebrow: "Vision · 2035",
    visionHeading: ["「大学生になったら、", "とりあえず TrypL。」"],
    visionP:
      "大学の生活協同組合のように、当たり前にそこにある存在へ。2035年までに、既存の有力学生団体を超える規模と質を持つ、日本で最も強い学生実践コミュニティを目指します。学生が自分のペースで「やりたいこと」や「社会への貢献のかたち」を探し、深められる場を提供し続けます。",
    msgEyebrow: "Message · 代表メッセージ",
    msgTitle: "「やりたい」という衝動を、社会の現場で形にする。",
    msgBody: [
      "TrypLが目指すのは、単なる学生団体やインターン紹介所ではありません。それは、どんな人とも安心感を持って本音を出し合い、共に人生という冒険を楽しみ、互いに応援し支え合える「家族」のような愛情に満ちたコミュニティです。",
      "今の社会では、多くの学生が「将来のために実績を作らなければならない」という強迫観念に囚われています。しかし、本当に大切なのは、履歴書を飾ることではなく、あなた自身の内側にある純粋な動機に従って、社会の複雑さに直接触れてみることです。",
      "自分の弱さや「わがまま」さえも分かち合いながら、仲間と共に未踏の現場へ踏み出す。その試行錯誤のプロセスこそが、あなたを本当の意味での「熟達」へと導きます。私たちは、この挑戦を楽しみ、共に成長していける「越境者」たちを待っています。",
    ],
    repName: "山田 晃義",
    repRole: "TrypL 代表",
    repOrg: "株式会社リープラジャパン",
    reapraLink: "REAPRA について詳しくはこちら",
  },
  events: {
    calEyebrow: "Upcoming · 開催予定",
    calHeading: "開催予定をチェック。",
    calBody:
      "次回の開催日や詳細、参加のお申し込みはこちらから。気になる回があれば、お気軽にご参加ください。",
    calBtn: "開催予定を見る",
    seeInternships: "募集を見る",
    hostEyebrow: "What we host",
    hostHeading: "開催しているイベント",
    kinds: [
      {
        title: "説明会",
        body: "TrypL の世界観と、いま募集中の実践機会（インターン）を知る。はじめての方へ。",
      },
      {
        title: "座談会・対話の場",
        body: "現役メンバーや運営と本音で話す。「やってみたい」の解像度を上げていく。",
      },
      {
        title: "ワークショップ",
        body: "生成AIの実務活用など、現場で使えるスキルに手を動かしながら触れる。",
      },
    ],
    galleryEyebrow: "Gallery · イベントの様子",
    galleryHeading: "これまでの開催から。",
    galleryLead:
      "発表、対話、交流。実際の現場に触れながら、仲間とともに学び合う場をつくっています。",
  },
  contact: {
    directHeading: "直接のご連絡も歓迎です",
    directBody:
      "フォームのほか、メールでも受け付けています。内容に応じて、担当より折り返しご連絡します。",
    fName: "お名前",
    fEmail: "メールアドレス",
    fCategory: "種別",
    fMessage: "お問い合わせ内容",
    fMessagePlaceholder: "ご相談内容をご記入ください。",
    submit: "送信する",
    sending: "送信中…",
    doneTitle: "送信しました",
    doneBody:
      "お問い合わせありがとうございます。内容を確認のうえ、担当より折り返しご連絡します。",
    errorDefault: "送信に失敗しました",
    categories: [
      "参加について",
      "取材・メディア",
      "企業・大学との連携",
      "採用・インターン掲載",
      "その他",
    ],
  },
  join: {
    howEyebrow: "How it works",
    howHeading: "参加から実践までの、5ステップ。",
    steps: [
      { title: "知る", body: "SNS やイベントを通じて、TrypL の世界に触れる。" },
      {
        title: "深める",
        body: "説明会・座談会・対話の場で、活動やインターンの実際を知る。",
      },
      {
        title: "会員登録する",
        body: "このサイトから Google アカウントで会員登録。無料・30秒で完了します。",
      },
      {
        title: "つながる",
        body: "LINE 公式やコミュニティで、同世代の仲間や運営とつながる。",
      },
      {
        title: "応募・実践する",
        body: "会員限定で、気になる募集に応募。やりながら学び、熟達への一歩を踏み出す。",
      },
    ],
    getStartedEyebrow: "Get started",
    getStartedHeading: "いますぐ、はじめる。",
    getStartedBody:
      "まずはこのサイトで会員登録（無料・30秒）。その後 LINE で最新情報を受け取り、気になる募集に応募できます。",
    entryReady: "参加フォームへ",
    entryPrep: "参加フォーム（準備中）",
    seeInternships: "募集を見る",
    lineLabel: "LINE：",
    lineAction: "友だち追加",
    slackLabel: "Slack：",
    slackAction: "参加する",
    contactLabel: "お問い合わせ：",
    prep: "準備中",
    faqEyebrow: "FAQ",
    faqHeading: "よくある質問",
    faqs: [
      { q: "参加に費用はかかりますか？", a: "いいえ。コミュニティへの参加は無料です。" },
      {
        q: "文系・理系や学部は問われますか？",
        a: "問いません。学部・専攻に関わらず、内発的な動機を大切にする方を歓迎します。",
      },
      {
        q: "対象となる学年は？",
        a: "主に大学生・大学院生（16〜25歳が目安）です。将来的には高校生や社会人2年目の方などへも広げていく予定です。",
      },
      {
        q: "地方に住んでいても参加できますか？",
        a: "はい。リモート中心の活動やインターンも多くあります。場所に関わらず参加いただけます。",
      },
      {
        q: "就職活動の役に立ちますか？",
        a: "結果としてキャリアの確かな足場になりますが、TrypL は就活対策の場ではなく、内発的動機を起点に社会と関わる実践の場です。",
      },
    ],
  },
  links: {
    subtitle: "REAPRA発・実践型インターンコミュニティ",
    entryLabel: "参加フォーム",
    entryDesc: "まずは興味の登録から。30秒で完了します。",
    primary: [
      { label: "募集一覧を見る", sub: "REAPRA・投資先でのインターン" },
      { label: "イベントに参加する", sub: "説明会・座談会・ワークショップ" },
      { label: "TrypLとは", sub: "ミッション・名前の由来・運営" },
    ],
    followUs: "Follow us",
    prep: "準備中",
    poweredBy: "Powered by REAPRA",
  },
  login: {
    badge: "Members only",
    title: "メンバー限定ログイン",
    desc: "TrypL のメンバーになった方だけがアクセスできる、限定エリアです。",
    username: "ユーザー名",
    usernamePlaceholder: "お名前 / ユーザー名",
    password: "パスワード",
    submit: "ログイン",
    sending: "確認中…",
    note: "メンバー用パスワードは運営からお知らせします。運営者は管理者アカウントでログインすると管理画面に進みます。",
    errorDefault: "ログインに失敗しました",
  },
  members: {
    welcome: "ようこそ、",
    welcomeSuffix: " さん。TrypL のメンバーエリアです。",
    cardHeading: "あなたの会員証",
    internships: "募集一覧",
    internshipsSub: "REAPRA・投資先の実践機会を見る。",
    events: "イベント",
    eventsSub: "説明会・座談会・ワークショップの予定。",
    toAdmin: "管理画面へ",
    logout: "ログアウト",
    deleteAccount: "退会する",
    deleteConfirm:
      "本当に退会しますか？会員情報が削除され、ログアウトされます。この操作は取り消せません。",
    deleteConfirmYes: "退会する",
    deleteCancel: "キャンセル",
    deleting: "処理中…",
  },
  memberAuth: {
    badge: "Membership",
    title: "TrypL に参加する",
    desc: "Google アカウントで会員登録・ログインできます。登録は無料、30秒で完了します。",
    google: "Google で続ける",
    apple: "Apple で続ける",
    privacy: "続行することで、TrypL の運営方針とプライバシーの取り扱いに同意したものとみなされます。",
    prepTitle: "会員登録は近日公開",
    prepDesc: "現在、会員登録機能を準備中です。公開までは下記からお気軽にご連絡ください。",
    prepLine: "公式アカウントを友だち追加",
    adminLink: "運営の方はこちら",
  },
  apply: {
    cta: "会員登録して応募",
    note: "応募には無料の会員登録が必要です。",
    authedNote: "ログイン済みです。そのまま応募に進めます。",
  },
};

type Pages = typeof ja;

const en: Pages = {
  tagline: "Take on practice, as if at play.",
  photoStrip: {
    eyebrow: "Community · in the field",
    heading: "In the field, there are always peers.",
  },
  home: {
    tripleEyebrow: "The name · TrypL",
    tripleHeading: "Three L’s, woven into the name.",
    tryLine: "Try (challenge) × Practice × pLay (enjoy)",
    triple: [
      {
        key: "Learning",
        jp: "Learning",
        line: "Real learning, through practice.",
        body: "Not acquiring knowledge or credentials, but diving into the real field — exploring “who am I” and “what can I do in society” with your own hands.",
      },
      {
        key: "Long-term",
        jp: "Long-term",
        line: "Not the short term — a long horizon.",
        body: "Not for the immediate job hunt or pay, but keeping facing society on the scale of one, five, ten years.",
      },
      {
        key: "LifeMission",
        jp: "Life Mission",
        line: "From intrinsic motivation to a life’s mission.",
        body: "Starting from the motivation welling up inside — “how do I want to relate to society” — and deepening your own form of contribution.",
      },
    ],
  },
  headers: {
    about: {
      eyebrow: "About · What is TrypL",
      title: ["The next generation", "of co-creators with society."],
      lead: "Starting from intrinsic motivation, students co-create with society — learning, challenging, and growing into mastery. TrypL is the community that provides those real opportunities.",
    },
    internships: {
      eyebrow: "Internships",
      title: ["Opportunities for practice."],
      lead: "Curated internships at REAPRA and its portfolio companies. Dive deep into one field, or move across several over half-year stretches.",
    },
    events: {
      eyebrow: "Events",
      title: ["Meet society,", "take the first step."],
      lead: "Info sessions, dialogues, workshops — TrypL hosts a range of events. Find the latest schedule and sign up here.",
    },
    contact: {
      eyebrow: "Contact",
      title: ["Let’s talk."],
      lead: "Joining, press and media, partnerships with companies or universities — whatever it is, feel free to reach out.",
    },
    join: {
      eyebrow: "Join",
      title: ["Your first step,", "starts here."],
      lead: "From registering your interest to info sessions and real practice. You don’t need to be perfect — just open the door, casually.",
    },
    members: {
      eyebrow: "Members only",
      title: ["Welcome to TrypL."],
      lead: "Members-only links and the latest updates. To the field of practice, from here.",
    },
  },
  about: {
    whatEyebrow: "What",
    whatLede:
      "TrypL is a “youth-focused internship community,” born from REAPRA.",
    whatP1:
      "In an increasingly uncertain society, TrypL is a project that co-creates the place and the chances for young people to connect with society over a long time horizon — through real work and companies — and to find well-being through mastery.",
    whatP2:
      "Not driven by job hunting or money, but starting from intrinsic motivation — “who am I,” “how do I want to relate to society” — students take a first step toward mastery co-created with society through real company work.",
    nameEyebrow: "The name",
    nameHeading: "Three L’s, woven into the name.",
    triple: [
      {
        key: "Learning",
        jp: "Learning",
        body: "Not acquiring knowledge or credentials, but diving into the real field — exploring “who am I” and “what can I do in society” with your own hands.",
      },
      {
        key: "Long-term",
        jp: "Long-term",
        body: "Not for the immediate job hunt or pay, but cultivating a stance that keeps facing society on the scale of one, five, ten years.",
      },
      {
        key: "LifeMission",
        jp: "Life Mission",
        body: "Starting from the motivation welling up inside — “how do I want to relate to society” — and deepening your own form of contribution.",
      },
    ],
    words: [
      { en: "Try", jp: "Challenge" },
      { en: "Practice", jp: "Practice" },
      { en: "pLay", jp: "Enjoy" },
    ],
    nameTagline:
      "“Take on practice as if at play.” Read it as “Triple.” That very attitude is woven into the name itself.",
    reapraEyebrow: "Why it matters to REAPRA",
    reapraHeading: ["A lasting,", "deeply-rooted intrinsic drive."],
    reapraP1:
      "With “research and practice for creating industries” as its mission, REAPRA builds industries — and nurtures the leaders — that solve societal problems across generations. At its core is an approach of continually questioning a sense of mission that rises from within, rather than external, short-term success.",
    reapraP2:
      "Students who have faced their intrinsic motivation through TrypL come back, five or ten years later, with their own careers and the society they want to create, and reconnect to REAPRA’s ecosystem. That, too, is TrypL’s long-term significance.",
    visionEyebrow: "Vision · 2035",
    visionHeading: ["“Once you become a student,", "just start with TrypL.”"],
    visionP:
      "Like a campus co-op, something that is simply there as a given. By 2035, we aim to be Japan’s strongest student community of practice — surpassing today’s leading student organizations in scale and quality — and to keep offering a place where students explore and deepen “what they want to do” and “their form of contribution” at their own pace.",
    msgEyebrow: "Message",
    msgTitle: "Giving the urge to “try” a real shape, in the field of society.",
    msgBody: [
      "What TrypL aims for is not a mere student group or internship agency. It is a community full of family-like affection — where anyone can share their true feelings in safety, enjoy the adventure of life together, and cheer each other on.",
      "In today’s society, many students are gripped by the obsession that they “must build achievements for the future.” But what truly matters is not decorating a résumé — it is following the pure motivation inside you and touching the complexity of society directly.",
      "Sharing even your weaknesses and “selfishness,” you step into uncharted fields with your peers. That very process of trial and error leads you to true mastery. We’re waiting for “boundary-crossers” who can enjoy this challenge and grow together.",
    ],
    repName: "Akiyoshi Yamada",
    repRole: "TrypL Representative",
    repOrg: "REAPRA Japan, Inc.",
    reapraLink: "Learn more about REAPRA",
  },
  events: {
    calEyebrow: "Upcoming",
    calHeading: "Check the schedule.",
    calBody:
      "Find the next dates, details, and how to sign up here. If a session catches your eye, feel free to join.",
    calBtn: "See the schedule",
    seeInternships: "See internships",
    hostEyebrow: "What we host",
    hostHeading: "The events we run",
    kinds: [
      {
        title: "Info sessions",
        body: "Get to know TrypL’s world and the practice opportunities (internships) open now. For first-timers.",
      },
      {
        title: "Dialogues",
        body: "Talk honestly with current members and the team. Sharpen the picture of what you “want to try.”",
      },
      {
        title: "Workshops",
        body: "Get hands-on with field-ready skills, like putting generative AI to practical use.",
      },
    ],
    galleryEyebrow: "Gallery",
    galleryHeading: "From our past events.",
    galleryLead:
      "Presenting, dialoguing, connecting. Touching the real field, we create a place to learn together with peers.",
  },
  contact: {
    directHeading: "Reaching out directly is welcome too",
    directBody:
      "Besides the form, we also accept email. Depending on your message, a team member will get back to you.",
    fName: "Name",
    fEmail: "Email",
    fCategory: "Type",
    fMessage: "Your message",
    fMessagePlaceholder: "Please write your inquiry here.",
    submit: "Send",
    sending: "Sending…",
    doneTitle: "Sent",
    doneBody:
      "Thank you for reaching out. We’ll review your message and a team member will get back to you.",
    errorDefault: "Failed to send",
    categories: [
      "About joining",
      "Press & media",
      "Partnership (company / university)",
      "Hiring & internship listings",
      "Other",
    ],
  },
  join: {
    howEyebrow: "How it works",
    howHeading: "From joining to practice, in 5 steps.",
    steps: [
      { title: "Discover", body: "Encounter TrypL’s world through social media and events." },
      {
        title: "Go deeper",
        body: "Learn what the activities and internships are really like, through info sessions and dialogues.",
      },
      {
        title: "Sign up",
        body: "Create a member account with your Google account on this site. Free, ~30 seconds.",
      },
      {
        title: "Connect",
        body: "Connect with peers and the team via LINE Official and the community.",
      },
      {
        title: "Apply & practice",
        body: "Members can apply to internships that interest them. Learn by doing, and take a step toward mastery.",
      },
    ],
    getStartedEyebrow: "Get started",
    getStartedHeading: "Start, right now.",
    getStartedBody:
      "First, sign up on this site (free, ~30s). Then get updates on LINE and apply to internships that interest you.",
    entryReady: "Go to the form",
    entryPrep: "Form (coming soon)",
    seeInternships: "See internships",
    lineLabel: "LINE: ",
    lineAction: "Add as friend",
    slackLabel: "Slack: ",
    slackAction: "Join",
    contactLabel: "Contact: ",
    prep: "Coming soon",
    faqEyebrow: "FAQ",
    faqHeading: "Frequently asked questions",
    faqs: [
      { q: "Is there a cost to join?", a: "No. Joining the community is free." },
      {
        q: "Does your major or field matter?",
        a: "No. Regardless of major or field, we welcome those who value intrinsic motivation.",
      },
      {
        q: "Which years can join?",
        a: "Mainly undergraduate and graduate students (around 16–25). We plan to expand to high schoolers and early-career professionals in the future.",
      },
      {
        q: "Can I join from outside the city?",
        a: "Yes. Many activities and internships are remote-first. You can join from anywhere.",
      },
      {
        q: "Will it help with job hunting?",
        a: "It does become a solid foundation for your career, but TrypL is not a job-hunting prep service — it’s a place to engage with society from intrinsic motivation.",
      },
    ],
  },
  links: {
    subtitle: "A practice-first internship community, born from REAPRA",
    entryLabel: "Registration form",
    entryDesc: "Start by registering your interest. 30 seconds.",
    primary: [
      { label: "See internships", sub: "Internships at REAPRA & portfolio companies" },
      { label: "Join an event", sub: "Info sessions, dialogues, workshops" },
      { label: "About TrypL", sub: "Mission, the name, the team" },
    ],
    followUs: "Follow us",
    prep: "Coming soon",
    poweredBy: "Powered by REAPRA",
  },
  login: {
    badge: "Members only",
    title: "Members-only login",
    desc: "An exclusive area only those who have become TrypL members can access.",
    username: "Username",
    usernamePlaceholder: "Name / username",
    password: "Password",
    submit: "Log in",
    sending: "Checking…",
    note: "The member password is shared by the team. Admins log in with an admin account to reach the dashboard.",
    errorDefault: "Login failed",
  },
  members: {
    welcome: "Welcome, ",
    welcomeSuffix: ". This is the TrypL members area.",
    cardHeading: "Your membership card",
    internships: "Internships",
    internshipsSub: "See practice opportunities at REAPRA & portfolio companies.",
    events: "Events",
    eventsSub: "Schedule of info sessions, dialogues, and workshops.",
    toAdmin: "Go to admin",
    logout: "Log out",
    deleteAccount: "Delete my account",
    deleteConfirm:
      "Are you sure you want to delete your membership? Your member data will be removed and you'll be signed out. This can't be undone.",
    deleteConfirmYes: "Delete account",
    deleteCancel: "Cancel",
    deleting: "Processing…",
  },
  memberAuth: {
    badge: "Membership",
    title: "Join TrypL",
    desc: "Sign up or log in with your Google account. It's free and takes about 30 seconds.",
    google: "Continue with Google",
    apple: "Continue with Apple",
    privacy: "By continuing, you agree to TrypL's operating policy and the handling of your data.",
    prepTitle: "Sign-up coming soon",
    prepDesc: "Member sign-up is being prepared. Until it launches, feel free to reach us below.",
    prepLine: " Official — add as a friend",
    adminLink: "Operators, log in here",
  },
  apply: {
    cta: "Sign up to apply",
    note: "Applying requires a free member account.",
    authedNote: "You're signed in — go ahead and apply.",
  },
};

const ko: Pages = {
  tagline: "즐겁게 놀듯이, 실천에 도전한다.",
  photoStrip: {
    eyebrow: "Community · 활동의 모습",
    heading: "현장에는 언제나 동료가 있다.",
  },
  home: {
    tripleEyebrow: "The name · TrypL",
    tripleHeading: "이름에 담은 세 개의 L.",
    tryLine: "Try（도전）× Practice（실천）× pLay（즐기기）",
    triple: [
      {
        key: "Learning",
        jp: "배움",
        line: "실천을 통한, 진짜 배움.",
        body: "지식이나 자격 취득이 아니라, 실제 현장에 뛰어들어 손을 움직이며 ‘나는 누구인가’ ‘사회에서 무엇을 할 수 있는가’를 탐구합니다.",
      },
      {
        key: "Long-term",
        jp: "장기",
        line: "단기가 아니라, 긴 시간 축으로.",
        body: "당장의 취업이나 보수를 위해서가 아니라, 1년·5년·10년의 스케일로 사회와 계속 마주합니다.",
      },
      {
        key: "LifeMission",
        jp: "라이프 미션",
        line: "내발적 동기에서, 인생의 사명으로.",
        body: "‘어떻게 사회와 관계 맺고 싶은가’라는 내면에서 솟는 동기를 기점으로, 자신만의 기여의 형태를 깊여 갑니다.",
      },
    ],
  },
  headers: {
    about: {
      eyebrow: "About · TrypL이란",
      title: ["사회와 공동 창조하는,", "그 예비군을."],
      lead: "내발적 동기를 기점으로, 학생이 사회와 공동 창조하며 배우고 도전하고 숙달해 갑니다. TrypL은 그 실천의 기회를 제공하는 커뮤니티입니다.",
    },
    internships: {
      eyebrow: "Internships · 모집 공고",
      title: ["실천의 기회를."],
      lead: "REAPRA와 투자처 기업에서 엄선한 인턴십. 한 현장에 깊이 파고드는 것도, 반년 단위로 여러 현장을 넘나드는 것도 가능합니다.",
    },
    events: {
      eyebrow: "Events · 이벤트",
      title: ["사회와 만나는,", "첫걸음을."],
      lead: "설명회·좌담회·워크숍 등 TrypL은 다양한 이벤트를 엽니다. 최신 일정과 참가 신청은 여기에서.",
    },
    contact: {
      eyebrow: "Contact · 문의",
      title: ["이야기해 봐요."],
      lead: "참여 상담, 취재·미디어, 기업이나 대학과의 협업 등. 무엇이든 편하게 연락 주세요.",
    },
    join: {
      eyebrow: "Join · 참여하기",
      title: ["첫걸음을,", "여기에서."],
      lead: "관심 등록부터 설명회, 그리고 실천까지. 완벽할 필요는 없습니다. 우선 가볍게 문을 열어 보세요.",
    },
    members: {
      eyebrow: "Members · 멤버 전용",
      title: ["TrypL에 오신 걸 환영해요."],
      lead: "멤버 전용 링크와 최신 정보입니다. 실천의 현장으로, 여기에서.",
    },
  },
  about: {
    whatEyebrow: "What",
    whatLede:
      "TrypL은 REAPRA에서 시작된 ‘청년 대상 인턴십 커뮤니티’입니다.",
    whatP1:
      "불확실성이 커지는 사회에서, 청년이 긴 시간 축에 걸쳐 ‘회사와 관련된 일=사회와의 연결’을 통해 사회와 공동 창조하고, 숙달로 생기 있게 사는(웰빙) 계기를 잡는—그 장과 기회를 함께 만드는 프로젝트입니다.",
    whatP2:
      "취업이나 보수·돈 중심이 아니라, ‘나는 누구인가’ ‘어떻게 사회와 관계 맺고 싶은가’라는 내발적 동기를 가진 학생이, 실제 기업 활동을 통해 ‘사회와 공동 창조하는 숙달’의 첫걸음을 내딛습니다.",
    nameEyebrow: "The name",
    nameHeading: "이름에 담은 세 개의 L.",
    triple: [
      {
        key: "Learning",
        jp: "배움",
        body: "지식이나 자격 취득이 아니라, 실제 현장에 뛰어들어 손을 움직이며 ‘나는 누구인가’ ‘사회에서 무엇을 할 수 있는가’를 탐구합니다.",
      },
      {
        key: "Long-term",
        jp: "장기",
        body: "당장의 취업이나 보수를 위해서가 아니라, 1년·5년·10년의 스케일로 사회와 계속 마주하는 자세를 기릅니다.",
      },
      {
        key: "LifeMission",
        jp: "라이프 미션",
        body: "‘어떻게 사회와 관계 맺고 싶은가’라는 내면에서 솟는 동기를 기점으로, 자신만의 기여의 형태를 깊여 갑니다.",
      },
    ],
    words: [
      { en: "Try", jp: "도전" },
      { en: "Practice", jp: "실천" },
      { en: "pLay", jp: "즐기기" },
    ],
    nameTagline:
      "‘즐겁게 놀듯이, 실천에 도전한다.’ 읽는 법은 “트리플”. 그 자세를 이름 그 자체에 담았습니다.",
    reapraEyebrow: "REAPRA에게의 의의",
    reapraHeading: ["오래 지속되는,", "핵심을 찌른 내발적 동기를."],
    reapraP1:
      "REAPRA는 ‘산업 창조의 연구 실천’을 미션으로, 세대를 넘는 긴 시간 축으로 사회 과제를 해결하는 산업을 만들고 그 리더를 길러냅니다. 그 핵심에는 외발적·단기적 성공이 아니라, 내면에서 솟는 사명감을 끊임없이 묻는 접근이 있습니다.",
    reapraP2:
      "TrypL을 통해 내발적 동기와 마주한 학생들이 5년·10년 뒤 자신의 커리어와 만들고 싶은 사회를 안고 다시 REAPRA의 생태계로 이어집니다. 그것 또한 TrypL이 지닌 장기적 의의입니다.",
    visionEyebrow: "Vision · 2035",
    visionHeading: ["“대학생이 되면,", "일단 TrypL.”"],
    visionP:
      "대학의 생활협동조합처럼, 당연히 거기에 있는 존재로. 2035년까지 기존의 유력 학생 단체를 뛰어넘는 규모와 질을 갖춘, 일본에서 가장 강한 학생 실천 커뮤니티를 목표로 합니다. 학생이 자신의 페이스로 ‘하고 싶은 일’이나 ‘사회 기여의 형태’를 찾고 깊일 수 있는 장을 계속 제공합니다.",
    msgEyebrow: "Message · 대표 메시지",
    msgTitle: "‘하고 싶다’는 충동을, 사회의 현장에서 형태로.",
    msgBody: [
      "TrypL이 지향하는 것은 단순한 학생 단체나 인턴 소개소가 아닙니다. 누구와도 안심하고 본심을 나누고, 인생이라는 모험을 함께 즐기며, 서로 응원하고 지지하는 ‘가족’ 같은 애정으로 가득한 커뮤니티입니다.",
      "지금 사회에서는 많은 학생이 ‘미래를 위해 실적을 쌓아야 한다’는 강박에 사로잡혀 있습니다. 하지만 정말 중요한 것은 이력서를 꾸미는 것이 아니라, 당신 내면의 순수한 동기를 따라 사회의 복잡함에 직접 닿아 보는 것입니다.",
      "자신의 약함이나 ‘제멋대로’조차 나누면서, 동료와 함께 미답의 현장으로 나아갑니다. 그 시행착오의 과정이야말로 당신을 진정한 의미의 ‘숙달’로 이끕니다. 우리는 이 도전을 즐기며 함께 성장할 ‘경계를 넘는 사람들’을 기다립니다.",
    ],
    repName: "야마다 아키요시",
    repRole: "TrypL 대표",
    repOrg: "주식회사 리프라 재팬",
    reapraLink: "REAPRA에 대해 자세히 보기",
  },
  events: {
    calEyebrow: "Upcoming",
    calHeading: "일정을 확인하세요.",
    calBody:
      "다음 개최일과 상세, 참가 신청은 여기에서. 마음에 드는 회차가 있으면 편하게 참여하세요.",
    calBtn: "일정 보기",
    seeInternships: "모집 보기",
    hostEyebrow: "What we host",
    hostHeading: "여는 이벤트",
    kinds: [
      {
        title: "설명회",
        body: "TrypL의 세계관과 지금 모집 중인 실천 기회(인턴십)를 알아봅니다. 처음 오신 분께.",
      },
      {
        title: "좌담회·대화의 장",
        body: "현역 멤버나 운영진과 본심으로 이야기합니다. ‘해보고 싶다’의 해상도를 높여 갑니다.",
      },
      {
        title: "워크숍",
        body: "생성 AI의 실무 활용 등, 현장에서 쓰는 스킬을 손을 움직이며 익힙니다.",
      },
    ],
    galleryEyebrow: "Gallery · 활동의 모습",
    galleryHeading: "지금까지의 개최에서.",
    galleryLead:
      "발표, 대화, 교류. 실제 현장에 닿으며 동료와 함께 배우는 장을 만들고 있습니다.",
  },
  contact: {
    directHeading: "직접 연락도 환영합니다",
    directBody:
      "폼 외에 이메일로도 받습니다. 내용에 따라 담당자가 회신드립니다.",
    fName: "이름",
    fEmail: "이메일",
    fCategory: "유형",
    fMessage: "문의 내용",
    fMessagePlaceholder: "상담 내용을 적어 주세요.",
    submit: "보내기",
    sending: "전송 중…",
    doneTitle: "전송했습니다",
    doneBody:
      "문의해 주셔서 감사합니다. 내용을 확인한 뒤 담당자가 회신드립니다.",
    errorDefault: "전송에 실패했습니다",
    categories: [
      "참여에 대해",
      "취재·미디어",
      "기업·대학과의 협업",
      "채용·인턴 게재",
      "기타",
    ],
  },
  join: {
    howEyebrow: "How it works",
    howHeading: "참여부터 실천까지, 5단계.",
    steps: [
      { title: "알기", body: "SNS와 이벤트를 통해 TrypL의 세계에 닿습니다." },
      {
        title: "깊이 알기",
        body: "설명회·좌담회·대화의 장에서 활동과 인턴십의 실제를 알아봅니다.",
      },
      {
        title: "회원 가입",
        body: "이 사이트에서 Google 계정으로 회원 가입. 무료·30초면 완료됩니다.",
      },
      {
        title: "연결되기",
        body: "LINE 공식과 커뮤니티에서 또래 동료·운영진과 이어집니다.",
      },
      {
        title: "지원·실천하기",
        body: "회원 전용으로 관심 있는 모집에 지원. 하면서 배우고, 숙달로 한 걸음.",
      },
    ],
    getStartedEyebrow: "Get started",
    getStartedHeading: "지금 바로 시작.",
    getStartedBody:
      "먼저 이 사이트에서 회원 가입(무료·30초). 이후 LINE으로 소식을 받고, 관심 있는 모집에 지원할 수 있습니다.",
    entryReady: "참가 폼으로",
    entryPrep: "참가 폼(준비 중)",
    seeInternships: "모집 보기",
    lineLabel: "LINE: ",
    lineAction: "친구 추가",
    slackLabel: "Slack: ",
    slackAction: "참여하기",
    contactLabel: "문의: ",
    prep: "준비 중",
    faqEyebrow: "FAQ",
    faqHeading: "자주 묻는 질문",
    faqs: [
      { q: "참여에 비용이 드나요?", a: "아니요. 커뮤니티 참여는 무료입니다." },
      {
        q: "문과·이과나 전공을 따지나요?",
        a: "따지지 않습니다. 전공과 관계없이 내발적 동기를 소중히 하는 분을 환영합니다.",
      },
      {
        q: "대상 학년은?",
        a: "주로 대학생·대학원생(16~25세가 기준)입니다. 앞으로 고등학생이나 사회 초년생 등으로도 넓혀 갈 예정입니다.",
      },
      {
        q: "지방에 살아도 참여할 수 있나요?",
        a: "네. 원격 중심의 활동과 인턴십도 많습니다. 장소와 관계없이 참여할 수 있습니다.",
      },
      {
        q: "취업에 도움이 되나요?",
        a: "결과적으로 커리어의 확실한 발판이 되지만, TrypL은 취업 대비의 장이 아니라 내발적 동기를 기점으로 사회와 관계 맺는 실천의 장입니다.",
      },
    ],
  },
  links: {
    subtitle: "REAPRA에서 시작된 실천형 인턴십 커뮤니티",
    entryLabel: "참가 폼",
    entryDesc: "우선 관심 등록부터. 30초면 끝납니다.",
    primary: [
      { label: "모집 보기", sub: "REAPRA·투자처에서의 인턴십" },
      { label: "이벤트 참여하기", sub: "설명회·좌담회·워크숍" },
      { label: "TrypL이란", sub: "미션·이름의 유래·운영" },
    ],
    followUs: "Follow us",
    prep: "준비 중",
    poweredBy: "Powered by REAPRA",
  },
  login: {
    badge: "Members only",
    title: "멤버 전용 로그인",
    desc: "TrypL 멤버가 된 분만 접근할 수 있는 전용 공간입니다.",
    username: "사용자 이름",
    usernamePlaceholder: "이름 / 사용자 이름",
    password: "비밀번호",
    submit: "로그인",
    sending: "확인 중…",
    note: "멤버용 비밀번호는 운영진이 안내합니다. 운영자는 관리자 계정으로 로그인하면 관리 화면으로 이동합니다.",
    errorDefault: "로그인에 실패했습니다",
  },
  members: {
    welcome: "환영합니다, ",
    welcomeSuffix: "님. TrypL 멤버 전용 공간입니다.",
    cardHeading: "나의 멤버십 카드",
    internships: "모집 공고",
    internshipsSub: "REAPRA·투자처의 실천 기회를 봅니다.",
    events: "이벤트",
    eventsSub: "설명회·좌담회·워크숍 일정.",
    toAdmin: "관리 화면으로",
    logout: "로그아웃",
    deleteAccount: "회원 탈퇴",
    deleteConfirm:
      "정말 탈퇴하시겠습니까? 회원 정보가 삭제되고 로그아웃됩니다. 이 작업은 되돌릴 수 없습니다.",
    deleteConfirmYes: "탈퇴하기",
    deleteCancel: "취소",
    deleting: "처리 중…",
  },
  memberAuth: {
    badge: "Membership",
    title: "TrypL에 참여하기",
    desc: "Google 계정으로 회원 가입·로그인할 수 있습니다. 무료이며 30초면 완료됩니다.",
    google: "Google로 계속하기",
    apple: "Apple로 계속하기",
    privacy: "계속하면 TrypL의 운영 방침과 개인정보 처리에 동의하는 것으로 간주됩니다.",
    prepTitle: "회원 가입은 곧 공개됩니다",
    prepDesc: "현재 회원 가입 기능을 준비 중입니다. 공개 전까지는 아래로 편하게 연락 주세요.",
    prepLine: " 공식 계정 친구 추가",
    adminLink: "운영자는 여기로",
  },
  apply: {
    cta: "회원가입 후 지원",
    note: "지원하려면 무료 회원 가입이 필요합니다.",
    authedNote: "로그인되어 있어 바로 지원할 수 있습니다.",
  },
};

export const pagesDict = { ja, en, ko };

export function usePages() {
  const { locale } = useLocale();
  return pagesDict[locale];
}

export type PageDict = Pages;
