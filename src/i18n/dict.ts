/**
 * 多言語辞書（日本語 / English / 한국어）。
 * 既存の日本語コピーを基準（ja）に、en / ko を用意。
 * 文言の追加は ja に足し、en / ko に同じキーで翻訳を加える。
 */

export const LOCALES = ["ja", "en", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABEL: Record<Locale, string> = {
  ja: "日本語",
  en: "English",
  ko: "한국어",
};

/** <html lang> 用 */
export const LOCALE_HTML: Record<Locale, string> = {
  ja: "ja",
  en: "en",
  ko: "ko",
};

type Dict = {
  nav: { about: string; internships: string; events: string; links: string };
  cta: string;
  ctaMember: string;
  press: { eyebrow: string; heading: string };
  scroll: string;
  hero: {
    eyebrow: string;
    title: string[];
    lead1: string;
    lead2: string;
    seeInternships: string;
    aboutLink: string;
  };
  statement: {
    eyebrow: string;
    title: string[];
    body: string;
    pillars: { label: string; body: string }[];
    brandWords: string[];
  };
  why: {
    eyebrow: string;
    titleLines: string[];
    lead: string;
    shifts: { from: string; to: string }[];
  };
  who: { eyebrow: string; titleLines: string[]; lead: string };
  preview: { eyebrow: string; title: string; lead: string; all: string };
  join: { eyebrow: string; title: string; body: string; primary: string; secondary: string };
  footer: {
    desc: string;
    explore: string;
    follow: string;
    poweredBy: string;
    contact: string;
    login: string;
    logout: string;
    privacy: string;
    terms: string;
  };
};

export const dict: Record<Locale, Dict> = {
  ja: {
    nav: {
      about: "TrypLとは",
      internships: "募集一覧",
      events: "イベント",
      links: "リンク",
    },
    cta: "参加する",
    ctaMember: "会員ページへ",
    press: { eyebrow: "News · 掲載情報", heading: "ニュース／プレス。" },
    scroll: "Scroll",
    hero: {
      eyebrow: "REAPRA発・実践型コミュニティ。",
      title: ["社会とつながり、", "やりながら学ぶ。"],
      lead1:
        "「何者かになりたい」と願う。未知の世界に足を踏み入れる。社会の肌触りを感じながら、仲間と共に問い続ける。",
      lead2:
        "TrypL（トリプル）は、学生の「やりたい」を「実践」に変え、社会と接続するためのコミュニティです。私たちは、一人ひとりの内発的な動機を大切にしながら、共に未来を切り拓く場を提供します。",
      seeInternships: "募集を見る",
      aboutLink: "TrypLとは",
    },
    statement: {
      eyebrow: "What we do",
      title: ["社会と学生の距離を縮め", "実践的な学びを最大化する。"],
      body: "TrypLは、REAPRAの投資先企業群と連携し、単なるスキル習得に留まらない、社会のリアルな課題に向き合う機会を提供します。社会に価値を生み出すためには、まず動いてみること。私たちは「案ずるより産むが易し」を合言葉に、学生が社会のプレイヤーとして成長するためのコミュニティを構築しています。",
      pillars: [
        {
          label: "社会との接点",
          body: "REAPRA および投資先企業での実際のインターン。机上ではなく、本物の現場から始まる。",
        },
        {
          label: "実践からの学び",
          body: "やりながら学び、感じたことを言葉にして蓄積する。「自分は何者か」を実践の中で探っていく。",
        },
        {
          label: "長期の時間軸",
          body: "就活や報酬のためではなく、1年後・5年後・10年後を見据えて社会と向き合い続ける。",
        },
      ],
      brandWords: [
        "社会とつながる",
        "やりながら学ぶ",
        "越境する",
        "実践する",
        "可能性を広げる",
      ],
    },
    why: {
      eyebrow: "Why TrypL",
      titleLines: ["なぜ、", "TrypL なのか。"],
      lead: "「良い大学に入る」ことに全力を注いだ先で、燃え尽きてしまう。気づけば3年生、「就活どうしよう」と焦り出す。\n\n本来、学生の時間は、もっと豊かな探索の場であるはず。TrypLは、その問いに別の入口を用意します。",
      shifts: [
        { from: "就活のために", to: "内発的動機から" },
        { from: "短期の実績づくり", to: "長期の時間軸で" },
        { from: "情報を受け取るだけ", to: "実践して学ぶ" },
        { from: "ひとりで悩む", to: "仲間と共創する" },
      ],
    },
    who: {
      eyebrow: "Who · 求める人物像",
      titleLines: [
        "まず、動いてみたい人。",
        "就活のためじゃなく、",
        "自分の動機から始めたい人。",
        "学んだことを、言葉にできる人。",
      ],
      lead: "入口は、広く。最初から完璧である必要はありません。曖昧な状況でも一歩を踏み出し、活動を通じて自分の志向と適性を見つけていく——そんな姿勢を、私たちは大切にします。",
    },
    preview: {
      eyebrow: "Internships",
      title: "実践の機会。",
      lead: "REAPRA およびREAPRA投資先企業での、選び抜かれたインターン。複数のインターンを横断する経験設計も可能です。",
      all: "すべての募集を見る",
    },
    join: {
      eyebrow: "Join our community",
      title: "共に歩む仲間へ。",
      body: "わたしたちは、個々の内発的動機を尊重しつつ、互いに刺激し合う「越境者」の集まりです。現状に満足せず、社会の現場で試行錯誤しながら共に成長できる仲間を探しています。将来の履歴書のためではなく、今のあなたの「挑戦」を、わたしたちと一緒に形にしませんか？",
      primary: "参加する",
      secondary: "募集を見る",
    },
    footer: {
      desc: "REAPRA発・若年層向け実践型インターンコミュニティ。",
      explore: "Explore",
      follow: "Follow",
      poweredBy: "Powered by",
      contact: "お問い合わせ",
      login: "メンバーログイン",
      logout: "ログアウト",
      privacy: "プライバシーポリシー",
      terms: "レギュレーション",
    },
  },

  en: {
    nav: {
      about: "About",
      internships: "Internships",
      events: "Events",
      links: "Links",
    },
    cta: "Join",
    ctaMember: "Member area",
    press: { eyebrow: "News · Press", heading: "News & press." },
    scroll: "Scroll",
    hero: {
      eyebrow: "A practice-first community, born from REAPRA",
      title: ["Connect with society,", "learn by doing."],
      lead1:
        "Wishing to “become someone.” Stepping into the unknown. Feeling the texture of the real world, and keep questioning together with peers.",
      lead2:
        "TrypL turns a student’s “I want to try” into real practice and connects it to society. We honor each person’s intrinsic motivation and create a place to carve out the future, together.",
      seeInternships: "See internships",
      aboutLink: "About TrypL",
    },
    statement: {
      eyebrow: "What we do",
      title: ["Close the gap between", "students and society."],
      body: "Working with REAPRA’s portfolio companies, TrypL offers chances to face the real problems of society — far beyond simply acquiring skills. To create value, you first have to move. Under the motto “doing is easier than worrying,” we build a community where students grow into players in the real world.",
      pillars: [
        {
          label: "A door to society",
          body: "Real internships at REAPRA and its portfolio companies. It starts from the actual field, not the textbook.",
        },
        {
          label: "Learning by doing",
          body: "Learn as you go, and put what you feel into words. Explore “who am I” through practice.",
        },
        {
          label: "A long time horizon",
          body: "Not for job hunting or pay, but facing society with a view to one, five, ten years ahead.",
        },
      ],
      brandWords: [
        "Connect with society",
        "Learn by doing",
        "Cross boundaries",
        "Put it into practice",
        "Widen what’s possible",
      ],
    },
    why: {
      eyebrow: "Why TrypL",
      titleLines: ["Why", "TrypL?"],
      lead: "After pouring everything into “getting into a good university,” many burn out. Before they know it, they’re juniors, suddenly anxious about job hunting.\n\nA student’s time should be a far richer space for exploration. TrypL offers another way into that question.",
      shifts: [
        { from: "For job hunting", to: "From intrinsic motivation" },
        { from: "Short-term résumé padding", to: "On a long time horizon" },
        { from: "Just receiving information", to: "Learning by doing" },
        { from: "Struggling alone", to: "Co-creating with peers" },
      ],
    },
    who: {
      eyebrow: "Who · who we look for",
      titleLines: [
        "People who want to move first.",
        "Not for job hunting,",
        "but starting from their",
        "own motivation.",
        "People who can put what",
        "they learn into words.",
      ],
      lead: "The door is wide open. You don’t need to be perfect from the start. Take a step even amid uncertainty, and discover your direction and strengths through the work — that’s the attitude we value.",
    },
    preview: {
      eyebrow: "Internships",
      title: "Opportunities for practice.",
      lead: "Curated internships at REAPRA and its portfolio companies. You can even design an experience that spans several internships.",
      all: "See all internships",
    },
    join: {
      eyebrow: "Join our community",
      title: "To those who walk with us.",
      body: "We are a gathering of “boundary-crossers” who respect each other’s intrinsic motivation and spark one another. We’re looking for peers who aren’t content with the status quo and can grow together through trial and error in the field. Not for a future résumé — let’s give shape to your challenge, right now, together.",
      primary: "Join",
      secondary: "See internships",
    },
    footer: {
      desc: "A practice-first internship community for youth, born from REAPRA.",
      explore: "Explore",
      follow: "Follow",
      poweredBy: "Powered by",
      contact: "Contact",
      login: "Member login",
      logout: "Log out",
      privacy: "Privacy Policy",
      terms: "Regulations",
    },
  },

  ko: {
    nav: {
      about: "TrypL이란",
      internships: "모집 공고",
      events: "이벤트",
      links: "링크",
    },
    cta: "참여하기",
    ctaMember: "멤버 페이지로",
    press: { eyebrow: "News · 미디어", heading: "뉴스 / 프레스." },
    scroll: "Scroll",
    hero: {
      eyebrow: "REAPRA에서 시작된 실천형 커뮤니티",
      title: ["사회와 연결되고,", "하면서 배운다."],
      lead1:
        "“무언가가 되고 싶다”고 바란다. 미지의 세계에 발을 들인다. 사회의 질감을 느끼며, 동료와 함께 계속 질문한다.",
      lead2:
        "TrypL(트리플)은 학생의 “해보고 싶다”를 “실천”으로 바꿔 사회와 잇는 커뮤니티입니다. 우리는 한 사람 한 사람의 내발적 동기를 소중히 하며, 함께 미래를 열어가는 장을 제공합니다.",
      seeInternships: "모집 보기",
      aboutLink: "TrypL이란",
    },
    statement: {
      eyebrow: "What we do",
      title: ["사회와 학생의 거리를 좁히고", "실천적 배움을 극대화한다."],
      body: "TrypL은 REAPRA의 투자처 기업들과 협력하여, 단순한 스킬 습득에 그치지 않고 사회의 실제 과제와 마주하는 기회를 제공합니다. 가치를 만들려면 먼저 움직여야 합니다. ‘걱정보다 실행이 쉽다’를 모토로, 학생이 사회의 플레이어로 성장하는 커뮤니티를 만들어 갑니다.",
      pillars: [
        {
          label: "사회와의 접점",
          body: "REAPRA와 투자처 기업에서의 실제 인턴십. 책상이 아니라 진짜 현장에서 시작됩니다.",
        },
        {
          label: "실천을 통한 배움",
          body: "하면서 배우고, 느낀 것을 언어로 쌓아갑니다. ‘나는 누구인가’를 실천 속에서 탐구합니다.",
        },
        {
          label: "긴 시간 축",
          body: "취업이나 보수가 아니라, 1년·5년·10년 뒤를 바라보며 사회와 계속 마주합니다.",
        },
      ],
      brandWords: [
        "사회와 연결된다",
        "하면서 배운다",
        "경계를 넘는다",
        "실천한다",
        "가능성을 넓힌다",
      ],
    },
    why: {
      eyebrow: "Why TrypL",
      titleLines: ["왜,", "TrypL인가."],
      lead: "‘좋은 대학에 들어가는’ 일에 온 힘을 쏟은 끝에 번아웃이 옵니다. 정신을 차려보면 3학년, ‘취업 어쩌지’ 하며 초조해집니다.\n\n본래 학생의 시간은 훨씬 풍요로운 탐색의 장이어야 합니다. TrypL은 그 물음에 또 다른 입구를 마련합니다.",
      shifts: [
        { from: "취업을 위해", to: "내발적 동기에서" },
        { from: "단기 실적 쌓기", to: "긴 시간 축으로" },
        { from: "정보를 받기만", to: "실천하며 배우기" },
        { from: "혼자 고민하기", to: "동료와 공동 창조" },
      ],
    },
    who: {
      eyebrow: "Who · 찾는 인물상",
      titleLines: [
        "우선 움직여 보고 싶은 사람.",
        "취업을 위해서가 아니라,",
        "자신의 동기에서 시작하고 싶은 사람.",
        "배운 것을 말로 표현할 수 있는 사람.",
      ],
      lead: "입구는 넓게. 처음부터 완벽할 필요는 없습니다. 불확실한 상황에서도 한 걸음 내딛고, 활동을 통해 자신의 지향과 적성을 찾아가는—그런 자세를 우리는 소중히 여깁니다.",
    },
    preview: {
      eyebrow: "Internships",
      title: "실천의 기회.",
      lead: "REAPRA와 REAPRA 투자처 기업에서 엄선한 인턴십. 여러 인턴십을 넘나드는 경험 설계도 가능합니다.",
      all: "모든 모집 보기",
    },
    join: {
      eyebrow: "Join our community",
      title: "함께 걷는 동료에게.",
      body: "우리는 서로의 내발적 동기를 존중하며 서로를 자극하는 ‘경계를 넘는 사람들’의 모임입니다. 현재에 안주하지 않고 사회 현장에서 시행착오하며 함께 성장할 동료를 찾고 있습니다. 미래의 이력서를 위해서가 아니라, 지금 당신의 ‘도전’을 우리와 함께 형태로 만들어 보지 않겠어요?",
      primary: "참여하기",
      secondary: "모집 보기",
    },
    footer: {
      desc: "REAPRA에서 시작된, 청년을 위한 실천형 인턴십 커뮤니티.",
      explore: "Explore",
      follow: "Follow",
      poweredBy: "Powered by",
      contact: "문의하기",
      login: "멤버 로그인",
      logout: "로그아웃",
      privacy: "개인정보 처리방침",
      terms: "커뮤니티 규정",
    },
  },
};
