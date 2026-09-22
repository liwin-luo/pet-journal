import type { Locale } from "./i18n.ts";

export const CONTACT_EMAIL = "support@petsdaily.live";
export const UPDATED = "2026-09-22";

export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = { title: string; updated: string; sections: LegalSection[] };

const en = {
  privacy: {
    title: "Privacy Policy",
    updated: `Updated ${UPDATED}`,
    sections: [
      {
        heading: "Who we are",
        body: [
          "Petsdaily at https://www.petsdaily.live/ is a private pet journal. You sign in with Google, file a pet, write a daily page, and generate illustrations for that journal.",
        ],
      },
      {
        heading: "Data we store",
        body: [
          "From Google sign-in: email, name, and the Google account id.",
          "What you add: pet name, species, traits, hobbies, toys, food, catchphrase, photos, diary text, and the images we generate from that file.",
          "Technical logs needed to run the site, such as a session cookie.",
        ],
      },
      {
        heading: "Why",
        body: [
          "To keep each journal private to its account, to draft and save diary pages, and to generate the pictures you ask for. We do not sell this data.",
        ],
      },
      {
        heading: "Payments",
        body: [
          "If you subscribe, card details are collected by the checkout provider, not stored on Petsdaily servers. We receive the subscription status and a receipt contact, not your full card number.",
        ],
      },
      {
        heading: "Who else processes it",
        body: [
          "Google, for sign-in. Our host and database, to store the account. The image and text models, to generate a page you request. The checkout provider, if you pay.",
        ],
      },
      {
        heading: "Deletion",
        body: [
          `Email ${CONTACT_EMAIL} from the Google address on the account and ask us to delete it. We delete the account, pets, diary pages, and images tied to it.`,
        ],
      },
      {
        heading: "Children",
        body: ["Petsdaily is not directed at children under 13."],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: `Updated ${UPDATED}`,
    sections: [
      {
        heading: "The service",
        body: [
          "Petsdaily is software: a private journal for a pet you file, plus illustrations generated from that file. One account sees only its own journal.",
        ],
      },
      {
        heading: "What you are buying",
        body: [
          "Paid plans are a digital subscription to this website, billed monthly in USD. Nothing is shipped. We do not sell pet food, toys, supplies, or veterinary care.",
          "Diary text and pictures are for your personal album. They are not veterinary, medical, behavioral, or nutrition advice. Do not use them to decide treatment, dosage, or emergency care.",
        ],
      },
      {
        heading: "Plans",
        body: [
          "Free is $0: 1 pet, a diary page each day, 8 generated images a month, and album download. Sign-in uses Free until a paid subscription is active.",
          "Plus is $6 per month: 5 pets, diary images with no monthly cap, template stills, and toys and habits used as picture references.",
          "Family is $12 per month: 15 pets and everything in Plus.",
          "The live prices are only at /pricing.",
        ],
      },
      {
        heading: "Renewal and cancellation",
        body: [
          "A paid plan renews each month until you cancel. Cancel before the next renewal and future charges stop. Access continues until the end of the period already paid.",
          "This is a digital subscription. There is no physical return. If a charge was a mistake, email us and we will take it to the checkout provider.",
        ],
      },
      {
        heading: "Your content",
        body: [
          "You keep the photos and notes you upload. You let us store and process them only to run your journal and to generate images you request.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "Do not upload photos you have no right to use, try to open another account’s journal, or use the service to break the law.",
        ],
      },
      {
        heading: "Contact",
        body: [`Questions, cancellation help, and deletion requests: ${CONTACT_EMAIL}.`],
      },
    ],
  },
} satisfies { privacy: LegalDoc; terms: LegalDoc };

const zh: typeof en = {
  privacy: {
    title: "隐私政策",
    updated: `更新于 ${UPDATED}`,
    sections: [
      {
        heading: "我们是谁",
        body: [
          "Petsdaily（https://www.petsdaily.live/）是一份私人宠物手账。你用 Google 登录，给宠物建档，写今天，再按档案生成配图。",
        ],
      },
      {
        heading: "我们保存什么",
        body: [
          "Google 登录带来的邮箱、名字和账号编号。",
          "你填的内容：宠物名字、物种、性格、爱好、玩具、食物、口头禅、照片、日记正文，以及据此生成的图片。",
          "站点运行需要的技术记录，例如登录会话 cookie。",
        ],
      },
      {
        heading: "用来做什么",
        body: ["让每份手账只属于该账号，保存日记，并生成你要求的配图。我们不出售这些数据。"],
      },
      {
        heading: "付款",
        body: ["如果你订阅，银行卡信息由收银台收集，不存在 Petsdaily 的服务器上。我们只收到订阅状态和收据联系方式，不保存完整卡号。"],
      },
      {
        heading: "谁会经手",
        body: ["Google 负责登录。主机和数据库负责保存账号。你要求生成时，文本和图像模型会处理那一次请求。如果你付款，收银台会处理付款。"],
      },
      {
        heading: "删除",
        body: [`用账号上的 Google 邮箱写信到 ${CONTACT_EMAIL}，要求删除。我们会删掉该账号以及挂在上面的宠物、日记和图片。`],
      },
      {
        heading: "儿童",
        body: ["Petsdaily 不面向 13 岁以下儿童。"],
      },
    ],
  },
  terms: {
    title: "服务条款",
    updated: `更新于 ${UPDATED}`,
    sections: [
      {
        heading: "服务是什么",
        body: ["Petsdaily 是软件：为你建档的宠物写私人手账，并按档案生成配图。一个账号只能看到自己的手账。"],
      },
      {
        heading: "你买的是什么",
        body: [
          "付费档是这个网站的数字订阅，按月以美元计费。不发货。不卖宠物食品、玩具、用品或诊疗。",
          "日记和配图只给你自己的相册。它们不是兽医、医疗、行为或营养建议。不要用它们决定治疗、剂量或急诊。",
        ],
      },
      {
        heading: "档位",
        body: [
          "免费 $0：1 只宠物，每天一篇日记，每月 8 张生成图，相册可下载。在付费订阅生效前，登录使用的是免费档。",
          "Plus 每月 $6：5 只宠物，日记配图不设月上限，模板出图，玩具和喜好作为图片参考。",
          "家庭档每月 $12：15 只宠物，并包含 Plus 的全部。",
          "当前价格仅在 /pricing。",
        ],
      },
      {
        heading: "续订与取消",
        body: [
          "付费档按月续订，直到你取消。在下个账期前取消，之后不再扣款。已付的这一期可以继续用到期末。",
          "这是数字订阅，没有实物可退。如果扣款有误，写信给我们，我们会交给收银台处理。",
        ],
      },
      {
        heading: "你的内容",
        body: ["你上传的照片和文字仍归你。你允许我们保存并处理它们，只为了运行你的手账和生成你要求的图。"],
      },
      {
        heading: "使用限制",
        body: ["不要上传你无权使用的照片，不要尝试打开别人的手账，不要用本服务违法。"],
      },
      {
        heading: "联系",
        body: [`问题、取消订阅和删除账号：${CONTACT_EMAIL}。`],
      },
    ],
  },
};

const ko: typeof en = {
  privacy: {
    title: "개인정보 처리방침",
    updated: `업데이트 ${UPDATED}`,
    sections: [
      {
        heading: "운영자",
        body: [
          "Petsdaily(https://www.petsdaily.live/)는 비공개 반려동물 일기입니다. Google로 로그인하고, 반려동물을 등록하고, 오늘을 쓴 뒤 그 기록으로 그림을 만듭니다.",
        ],
      },
      {
        heading: "저장하는 데이터",
        body: [
          "Google 로그인에서 받은 이메일, 이름, 계정 식별자.",
          "직접 입력한 내용: 이름, 종류, 성격, 취미, 장난감, 음식, 말버릇, 사진, 일기, 그리고 그 기록으로 만든 이미지.",
          "사이트를 운영하는 데 필요한 기술 기록. 예: 세션 쿠키.",
        ],
      },
      {
        heading: "사용 목적",
        body: ["일기를 해당 계정만 보게 하고, 일기를 저장하며, 요청한 그림을 만들기 위해서입니다. 이 데이터를 판매하지 않습니다."],
      },
      {
        heading: "결제",
        body: ["구독하면 카드 정보는 결제 화면을 제공하는 쪽에서 수집하며, Petsdaily 서버에 저장하지 않습니다. 우리는 구독 상태와 영수증 연락처만 받고 전체 카드 번호는 받지 않습니다."],
      },
      {
        heading: "처리 수탁",
        body: ["로그인은 Google. 계정 저장은 호스팅과 데이터베이스. 생성을 요청하면 그 요청만 텍스트·이미지 모델이 처리합니다. 결제하면 결제 대행사가 처리합니다."],
      },
      {
        heading: "삭제",
        body: [`계정에 연결된 Google 주소로 ${CONTACT_EMAIL} 에 삭제를 요청하세요. 계정과 그에 묶인 반려동물, 일기, 이미지를 삭제합니다.`],
      },
      {
        heading: "아동",
        body: ["Petsdaily는 13세 미만을 대상으로 하지 않습니다."],
      },
    ],
  },
  terms: {
    title: "이용약관",
    updated: `업데이트 ${UPDATED}`,
    sections: [
      {
        heading: "서비스",
        body: ["Petsdaily는 소프트웨어입니다. 등록한 반려동물의 비공개 일기와, 그 기록으로 만든 그림입니다. 계정은 자신의 일기만 봅니다."],
      },
      {
        heading: "구매하는 것",
        body: [
          "유료 플랜은 이 웹사이트의 디지털 구독이며, 매월 미국 달러로 청구됩니다. 실물은 배송하지 않습니다. 사료, 장난감, 용품, 진료는 판매하지 않습니다.",
          "일기와 그림은 개인 앨범용입니다. 수의사, 의료, 행동, 영양 조언이 아닙니다. 치료, 용량, 응급 처치를 정하는 데 사용하지 마세요.",
        ],
      },
      {
        heading: "플랜",
        body: [
          "무료 $0: 반려동물 1마리, 매일 일기, 월 8장의 생성 이미지, 앨범 다운로드. 유료 구독이 켜지기 전에는 로그인이 무료 플랜입니다.",
          "Plus 월 $6: 5마리, 일기 그림은 월 상한 없음, 템플릿 컷, 장난감과 취향을 그림 참고로 사용.",
          "패밀리 월 $12: 15마리와 Plus의 전부.",
          "현재 가격은 /pricing 에만 있습니다.",
        ],
      },
      {
        heading: "갱신과 취소",
        body: [
          "유료 플랜은 취소할 때까지 매월 갱신됩니다. 다음 갱신 전에 취소하면 이후 청구는 멈춥니다. 이미 결제한 기간은 끝까지 사용할 수 있습니다.",
          "디지털 구독이라 반품할 실물이 없습니다. 잘못된 청구는 이메일로 알려 주시면 결제 대행사에 전달합니다.",
        ],
      },
      {
        heading: "이용자 콘텐츠",
        body: ["올린 사진과 글의 권리는 이용자에게 있습니다. 일기 운영과 요청한 그림 생성에만 저장·처리하도록 허락하는 것입니다."],
      },
      {
        heading: "금지",
        body: ["권리가 없는 사진을 올리거나, 다른 계정의 일기를 열거나, 위법한 용도로 쓰지 마세요."],
      },
      {
        heading: "연락",
        body: [`문의, 구독 취소, 계정 삭제: ${CONTACT_EMAIL}.`],
      },
    ],
  },
};

const ja: typeof en = {
  privacy: {
    title: "プライバシーポリシー",
    updated: `更新 ${UPDATED}`,
    sections: [
      {
        heading: "運営者",
        body: [
          "Petsdaily（https://www.petsdaily.live/）は非公開のペット手帳です。Google でログインし、ペットを登録し、今日を書いて、その記録から挿絵を作ります。",
        ],
      },
      {
        heading: "保存するデータ",
        body: [
          "Google ログインから受け取るメール、名前、アカウント識別子。",
          "入力した内容：名前、種類、性格、趣味、おもちゃ、食事、口ぐせ、写真、日記本文、そこから生成した画像。",
          "サイト運営に必要な技術記録。例：セッション cookie。",
        ],
      },
      {
        heading: "目的",
        body: ["手帳をそのアカウントだけに見せ、日記を保存し、頼まれた絵を作るためです。このデータを販売しません。"],
      },
      {
        heading: "支払い",
        body: ["購読する場合、カード情報は決済画面の提供者が受け取り、Petsdaily のサーバーには保存しません。受け取るのは購読状態と領収の連絡先で、カード番号の全桁ではありません。"],
      },
      {
        heading: "処理を任せる相手",
        body: ["ログインは Google。アカウントの保存はホスティングとデータベース。生成を頼んだときだけ、その依頼を文章・画像モデルが処理します。支払う場合は決済事業者が処理します。"],
      },
      {
        heading: "削除",
        body: [`アカウントの Google アドレスから ${CONTACT_EMAIL} に削除を依頼してください。アカウントと、それに紐づくペット、日記、画像を削除します。`],
      },
      {
        heading: "子ども",
        body: ["Petsdaily は 13 歳未満を対象にしていません。"],
      },
    ],
  },
  terms: {
    title: "利用規約",
    updated: `更新 ${UPDATED}`,
    sections: [
      {
        heading: "サービス",
        body: ["Petsdaily はソフトウェアです。登録したペットの非公開の手帳と、その記録から作る挿絵です。アカウントは自分の手帳だけを見ます。"],
      },
      {
        heading: "買うもの",
        body: [
          "有料プランはこのウェブサイトのデジタル購読で、毎月米ドルで請求します。物は送りません。フード、おもちゃ、用品、診療は売りません。",
          "日記と絵は個人のアルバム用です。獣医、医療、行動、栄養の助言ではありません。治療、用量、救急の判断に使わないでください。",
        ],
      },
      {
        heading: "プラン",
        body: [
          "無料 $0：ペット 1、毎日の日記、生成画像 月 8 枚、アルバム保存。有料購読が有効になるまで、ログインは無料プランです。",
          "Plus は月 $6：ペット 5、日記の挿絵は月の上限なし、テンプレ作画、おもちゃと好みを絵の参考にする。",
          "ファミリーは月 $12：ペット 15 と Plus のすべて。",
          "現行の価格は /pricing のみにあります。",
        ],
      },
      {
        heading: "更新と解約",
        body: [
          "有料プランは解約するまで毎月更新されます。次の更新前に解約すれば、その後の請求は止まります。支払い済みの期間は最後まで使えます。",
          "デジタル購読なので、返品する物はありません。誤った請求はメールで知らせてください。決済事業者に渡します。",
        ],
      },
      {
        heading: "利用者の内容",
        body: ["アップロードした写真と文章の権利は利用者にあります。手帳の運営と、頼んだ絵の生成にだけ保存・処理することを許すものです。"],
      },
      {
        heading: "禁止",
        body: ["権利のない写真を上げないこと。他人の手帳を開こうとしないこと。違法な使い方をしないこと。"],
      },
      {
        heading: "連絡",
        body: [`質問、解約、アカウント削除：${CONTACT_EMAIL}。`],
      },
    ],
  },
};

export const legal: Record<Locale, { privacy: LegalDoc; terms: LegalDoc }> = { en, zh, ko, ja };

export function checkoutHref(checkout: string): string {
  if (checkout === "plus" && process.env.NEXT_PUBLIC_CREEM_PLUS_URL) return process.env.NEXT_PUBLIC_CREEM_PLUS_URL;
  if (checkout === "family" && process.env.NEXT_PUBLIC_CREEM_FAMILY_URL) return process.env.NEXT_PUBLIC_CREEM_FAMILY_URL;
  return "/login";
}
