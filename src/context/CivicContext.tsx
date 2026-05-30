import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, Proposal, Poll, CouncilMeeting, MapZone, ProposalCategory, BlogPost } from '../types';

interface CivicContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  polls: Poll[];
  votePoll: (pollId: string, optionId: string) => void;
  proposals: Proposal[];
  upvoteProposal: (id: string) => void;
  addProposal: (title: Record<Language, string>, description: Record<Language, string>, category: ProposalCategory, locationName: string, author: string, tags: string[]) => void;
  selectedZone: string | null;
  setSelectedZone: (zoneId: string | null) => void;
  meetings: CouncilMeeting[];
  selectedMeeting: CouncilMeeting | null;
  setSelectedMeeting: (meeting: CouncilMeeting | null) => void;
  translateText: (key: string) => string;
  blogs: BlogPost[];
  addBlogPost: (title: Record<Language, string>, content: Record<Language, string>, author: string, tags: string[], imageUrl?: string) => void;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

// Core translation dictionary for UI labels
const UI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  appName: {
    en: 'Parravision',
    zh: '帕拉米眼 (Parravision)',
    hn: 'पैराविज़न (Parravision)'
  },
  tagline: {
    en: 'Frictionless civic participation, interactive maps & AI chatbot for Parramatta',
    zh: '帕拉米眼：集街区互动、博客快讯与 AI 问答于一体的帕拉马塔市民协作平台',
    hn: 'पैराविज़न: पैरामाटा के लिए इंटरैक्टिव मानचित्र, ब्लॉग और एआई चैटबॉट्स'
  },
  activeMeetings: {
    en: 'Active Council Briefings',
    zh: '进行中的市议会通报',
    hn: 'सक्रिय नगर परिषद ब्रीफिंग'
  },
  interactiveMap: {
    en: 'Interactive CBD Map',
    zh: '互动中央商务区地图',
    hn: 'इंटरैक्टिव सीबीडी मानचित्र'
  },
  mapInstruction: {
    en: 'Click a glowing zone to filter local ideas and see active public projects',
    zh: '点击发光区域以筛选本地提案并查看活跃的公共项目',
    hn: 'स्थानीय विचार और सक्रिय सार्वजनिक परियोजनाओं को देखने के लिए एक चमकदार क्षेत्र पर क्लिक करें'
  },
  pulsePolling: {
    en: 'Micro-Pulse Polling',
    zh: '微型快速民意调查',
    hn: 'माइक्रो-पल्स पोलिंग'
  },
  expertPitches: {
    en: 'Expert Pitching Engine',
    zh: '专家建言献策引擎',
    hn: 'एक्सपर्ट पिचिंग इंजन'
  },
  submitPitch: {
    en: 'Submit a Structured Pitch',
    zh: '提交结构化提案',
    hn: 'एक संरचित पिच जमा करें'
  },
  translateLabel: {
    en: 'Mocks AI Localization',
    zh: '模拟 AI 本地化翻译',
    hn: 'मॉक एआई स्थानीयकरण'
  },
  tldrSummary: {
    en: 'TL;DR AI Meeting Assistant',
    zh: 'TL;DR AI 议会小助手',
    hn: 'TL;DR एआई मीटिंग सहायक'
  },
  allZones: {
    en: 'Showing All Zones',
    zh: '显示所有区域',
    hn: 'सभी क्षेत्र दिखा रहे हैं'
  },
  clearFilter: {
    en: 'Clear filter',
    zh: '清除筛选',
    hn: 'फ़िल्टर साफ़ करें'
  },
  infrastructure: {
    en: 'Infrastructure',
    zh: '基础设施建设',
    hn: 'बुनियादी ढांचा'
  },
  cultural: {
    en: 'Cultural & Community',
    zh: '文化与社区',
    hn: 'सांस्कृतिक एवं समुदाय'
  },
  policy: {
    en: 'Policy & Governance',
    zh: '政策与治理',
    hn: 'नीति और शासन'
  },
  upvote: {
    en: 'Upvote',
    zh: '赞同',
    hn: 'सहमति दें'
  },
  voted: {
    en: 'Voted',
    zh: '已投票',
    hn: 'मतदान किया'
  },
  totalVotes: {
    en: 'total votes',
    zh: '张选票',
    hn: 'कुल मत'
  },
  newPitchTitle: {
    en: 'Pitch Title',
    zh: '提案标题',
    hn: 'पिच शीर्षक'
  },
  newPitchDesc: {
    en: 'Description of your civic solution...',
    zh: '描述您的城市解决方案...',
    hn: 'आपके नागरिक समाधान का विवरण...'
  },
  pitchAuthor: {
    en: 'Your Name / Affiliation',
    zh: '您的名字 / 组织归属',
    hn: 'आपका नाम / संबद्धता'
  },
  pitchLocation: {
    en: 'Target Location (e.g. Centenary Square)',
    zh: '目标地点 (如 Centenary Square)',
    hn: 'लक्षित स्थान (जैसे सेंटेनरी स्क्वायर)'
  },
  pitchButton: {
    en: 'Broadcast Pitch to Feed',
    zh: '广播提案至动态页面',
    hn: 'फ़ीड पर पिच प्रसारित करें'
  },
  selectCategory: {
    en: 'Select Category',
    zh: '选择类别',
    hn: 'श्रेणी का चयन करें'
  },
  successMessage: {
    en: 'Thank you! Your action has been registered.',
    zh: '谢谢！您的操作已登记。',
    hn: 'धन्यवाद! आपकी कार्रवाई दर्ज कर ली गई है।'
  },
  enterTitleDesc: {
    en: 'Please enter both title and description.',
    zh: '请同时输入标题和描述。',
    hn: 'कृपया शीर्षक और विवरण दोनों दर्ज करें।'
  },
  latestNotes: {
    en: 'Live Council Meeting Notes',
    zh: '即时市议会会议纪要',
    hn: 'लाइव नगर परिषद बैठक नोट्स'
  }
};

const INITIAL_POLLS: Poll[] = [
  {
    id: 'poll-1',
    question: {
      en: 'Should Parramatta Council implement a 30km/h speed limit zone in the high-density CBD core to improve walking safety?',
      zh: '帕拉马塔议会是否应在中央商务区高密度核心区实施 30公里/小时限速，以提高步行安全？',
      hn: 'क्या पैरामाटा काउंसिल को पैदल चलने की सुरक्षा में सुधार के लिए उच्च घनत्व वाले सीबीडी मुख्य भाग में 30 किमी/घंटा की गति सीमा सुरक्षित करनी चाहिए?'
    },
    options: [
      {
        id: 'poll-1-opt1',
        text: { en: 'Yes, endorse pedestrian-first CBD', zh: '是的，支持行人第一的商务区', hn: 'हाँ, पैदल यात्री-प्रथम सीबीडी का समर्थन करें' },
        votes: 1420
      },
      {
        id: 'poll-1-opt2',
        text: { en: 'No, keep current speed limits', zh: '不，保持现行限速限制', hn: 'नहीं, वर्तमान गति सीमाएं बनाए रखें' },
        votes: 843
      },
      {
        id: 'poll-1-opt3',
        text: { en: 'Compromise: Only during business peak hours', zh: '折中案：仅在上下班高峰期限制', hn: 'समझौता: केवल व्यावसायिक घंटों के दौरान' },
        votes: 312
      }
    ],
    totalVotes: 2575,
    date: '2026-05-28',
    category: 'TypePolicy'
  },
  {
    id: 'poll-2',
    question: {
      en: 'Do you support micro-grants for street murals designed by Western Sydney youth collectives along the Parramatta River foreshore?',
      zh: '您是否支持在帕拉马塔河沿岸为西悉尼青年艺术团体设计的街头壁画提供微型资金补助？',
      hn: 'क्या आप पैरामाटा नदी के किनारे पश्चिमी सिडनी युवा सोसायटी द्वारा डिज़ाइन किए गए भित्ति चित्रों के लिए सूक्ष्म अनुदान का समर्थन करते हैं?'
    },
    options: [
      {
        id: 'poll-2-opt1',
        text: { en: 'Absolutely, activate the public space', zh: '当然，激活公共滨水空间', hn: 'बिल्कुल, सार्वजनिक स्थान को सक्रिय करें' },
        votes: 1894
      },
      {
        id: 'poll-2-opt2',
        text: { en: 'Prefer funding traditional gallery exhibits', zh: '倾向于向传统美术馆展览倾斜资金', hn: 'पारंपरिक गैलरी प्रदर्शनियों के वित्तपोषण को प्राथमिकता दें' },
        votes: 212
      },
      {
        id: 'poll-2-opt3',
        text: { en: 'Neutral / No preference', zh: '中立 / 无特定偏好', hn: 'तटस्थ / कोई प्राथमिकता नहीं' },
        votes: 95
      }
    ],
    totalVotes: 2201,
    date: '2026-05-29',
    category: 'TypeCultural'
  }
];

const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-1',
    title: {
      en: 'Floating Wetlands Filtration Walkway',
      zh: '帕拉马塔河漂浮式湿地生态过滤步道',
      hn: 'फ्लोटिंग वेटलैंड्स निस्पंदन वॉकवे'
    },
    description: {
      en: 'A continuous community-built floating pontoon system embedded with native reed beds (phragmites australis) along the Parramatta River. This dual-purpose infrastructure naturally cleans urban runoff waters entering the river while giving Sydney travelers a fully connected pedestrian boardwalk experience.',
      zh: '一个由社区建造的、带本土芦苇植物床的沿河连续漂浮浮桥系统。该双重用途设施能自然净化流入帕拉马塔河的城市径流，同时也为悉尼旅客提供完全贯通的滨水人行步道体验。',
      hn: 'पैरामाटा नदी के किनारे देशी ईख के बिस्तरों के साथ एक सतत समुदाय-निर्मित फ्लोटिंग पोंटून प्रणाली। यह बहुउद्देशीय बुनियादी ढांचा नदी में प्रवेश करने वाले शहरी अपवाह जल को प्राकृतिक रूप से साफ करता है और सिडनी के यात्रियों को पैदल यात्री मार्ग का अनुभव देता है।'
    },
    author: 'Dr. Sarah Lin (Western Sydney University Urban Lab)',
    category: 'TypeInfrastructure',
    upvotes: 342,
    votedUp: false,
    date: '2026-05-29',
    locationName: 'River Foreshore',
    tags: ['Ecology', 'Pedestrian', 'Green Infra']
  },
  {
    id: 'prop-2',
    title: {
      en: 'Acoustic Street-Eat Zones',
      zh: '教堂街餐馆街原声微音乐角制度',
      hn: 'ध्वनिक स्ट्रीट-ईट जोन'
    },
    description: {
      en: 'Policy proposal to establish designated, low-noise acoustic live music zones along Church Street (Eat Street) after 8 PM. It cuts expensive noise-monitoring compliance costs for local restaurants while offering local artists paid street performance licenses sponsored by developers of new residential blocks.',
      zh: '教堂街 (美食街) 晚上8点后设立特定低噪原声现场音乐角的政策提案。该方案可削减本地餐厅昂贵的噪音监管达标成本，同时通过新建住宅楼的开发商赞助，向本地艺术家提供带报酬的街头艺术表演许可证。',
      hn: '8 बजे के बाद चर्च स्ट्रीट (ईट स्ट्रीट) के किनारे नामित, कम शोर वाले ध्वनिक लाइव संगीत क्षेत्रों को स्थापित करने का नीति प्रस्ताव। यह स्थानीय रेस्तरां के लिए महंगे शोर-निगरानी अनुपालन लागत को कम करता है।'
    },
    author: 'Marcus Vance (Parramatta Live Music Alliance)',
    category: 'TypePolicy',
    upvotes: 219,
    votedUp: false,
    date: '2026-05-28',
    locationName: 'Church Street CBD',
    tags: ['Night Economy', 'Music', 'Local Creators']
  },
  {
    id: 'prop-3',
    title: {
      en: 'Centenary Square Heat Mitigation Forest',
      zh: '百年广场防暑排热“斑马森林”计划',
      hn: 'सेंटेनरी स्क्वायर हीट शमन वन'
    },
    description: {
      en: 'Parramatta CBD is a major urban heat island in high summer. This infrastructure pitch details adding a high-density cluster of potted fast-growing eucalyptus and she-oak trees in Centenary Square equipped with public misting nozzles, capturing greywater from nearby fountains to drop local ambient temperature by 4.5°C.',
      zh: '夏季帕拉马塔中央商务区是一个严重的城市热岛。该基础设施提案建议在百年广场加设由快生桉树和木麻黄树组成的高密度可移动树袋森林，连接附近喷泉的清洁灰水雾化喷嘴，可成功降低局部环境温度达 4.5摄氏度。',
      hn: 'गर्मी के मौसम में पैरामाटा सीबीडी एक प्रमुख शहरी हीट आइलैंड बन जाता है। इस पिच में सेंटेनरी स्क्वायर में गमले में लगे तेजी से बढ़ने वाले नीलगिरी के पेड़ों को जोड़ने का विवरण है जो सार्वजनिक धुंध नोजल से सुसज्जित हैं।'
    },
    author: 'Ar. Dev Patel (Urban Oasis Architects)',
    category: 'TypeInfrastructure',
    upvotes: 512,
    votedUp: false,
    date: '2026-05-30',
    locationName: 'Centenary Square',
    tags: ['Urban Heat', 'Climate Resilient', 'Public Spaces']
  },
  {
    id: 'prop-4',
    title: {
      en: 'Dharug Language Signage Trail',
      zh: '达鲁格原住民语言历史地名标识步道',
      hn: 'धारुग भाषा साइनेज ट्रेल'
    },
    description: {
      en: 'Establish physical and digital augmented reality interpretive signage trail explaining Parramatta CBD landmarks using their original Dharug language names and cultural significance, created in partnership with the local Aboriginal Land Council to enrich historical learning for schools.',
      zh: '在帕拉马塔中央商务区建立融合实体与AR数字地名解释标识的的步行道，介绍各大地标原始的达鲁格原住民语名称与文化内涵。该项目与当地原住民土地委员会联合策划，致力于丰富中小学校的地质人文教育。',
      hn: 'लक्षित भौतिक और डिजिटल संवर्धित वास्तविकता व्याख्यात्मक साइनेज मार्ग स्थापित करना जो पैरामाटा सीबीडी स्थलों को उनके मूल धारुग भाषा नामों का उपयोग करके समझाता है।'
    },
    author: 'Uncle Chris Webb & Aunty Mary (Dharug Elders Circle)',
    category: 'TypeCultural',
    upvotes: 184,
    votedUp: false,
    date: '2026-05-27',
    locationName: 'Heritage Precinct',
    tags: ['Indigeneity', 'Tourism', 'AR Tech']
  }
];

const INITIAL_MEETINGS: CouncilMeeting[] = [
  {
    id: 'meet-1',
    title: {
      en: 'Parramatta CBD Thermal Strategy & Waterfront Rejuvenation Review',
      zh: '帕拉马塔中央商务区防暑散热战略与滨水区复兴审查会',
      hn: 'पैरामाटा सीबीडी थर्मल रणनीति और वाटरफ्रंट कायाकल्प समीक्षा'
    },
    date: 'May 28, 2026',
    locationName: 'Parramatta Town Hall Council Chambers',
    notes: {
      en: `The meeting opened at 6:00 PM in the Parramatta Town Hall with Councillor Claire Evans presiding. Key agenda item 4.2 focused on the "Urban Heat Island Mitigation Strategy 2026-2030." 
      
Council environmental engineering team presented high-resolution thermal imaging showing that Centenary Square pavement routinely exceeds 52°C on late January afternoons. Proposals discussed include:
1. Allocating $1.2 million to high-canopy tree installation.
2. Expanding graywater-fed public cooling mist systems.
3. Requiring all commercial facades built after 2027 to utilize low-albedo eco-material coating (refractive facades).

Councillor Evans pointed out that residents are expressing fatigue over plain grey concrete paving. Resident group 'Cool-down Parramatta' voiced concern that local small businesses on Church Street will experience reduced walkability. Under deliberation, the council is opening community submission lines for temporary bento-grid styled pocket parks. Action was tabled until next month's voting session.`,
      zh: `会议于下午6:00在帕拉马塔市政厅召开，由Claire Evans法官主持。核心议程第4.2节重点讨论了 “2026-2030年城市热岛效能缓解战略”。

市议会环境工程团队展示了高分辨率红外热成像报告，显示百年广场在1月下旬的下午地表温度常规性突破52°C。讨论的补救提案包括：
1. 拨付 120 万澳元用以安装高林荫冠幅的树木阵列。
2. 扩建由循环水源补及的公共雾化防暑冷却系统。
3. 强制要求所有 2027 年以后建造的商业建筑外立面必须采用低反照率的生态材质图层（低吸热涂料）。

市议员Claire Evans指出，居民反映对大面积单调的灰色混凝土铺装感到视觉疲劳。市民团体“降温帕拉马塔”表达了担忧，认为教堂街附近的小型商家在极端高温天气的顾客步行体验正在急剧下滑。在审议下，议会决定向社区开辟提交“盒状格”迷你流动公园解决方案。决议将延迟至下个月的全体表决会议。`,
      hn: `बैठक दोपहर 6:00 बजे पैरामाटा टाउन हॉल में शुरू हुई जिसमें पार्षद क्लेयर इवांस ने अध्यक्षता की। मुख्य एजेंडा आइटम 4.2 "अर्बन हीट आइलैंड शमन रणनीति 2026-2030" पर केंद्रित था।

काउंसिल की पर्यावरण इंजीनियरिंग टीम ने उच्च-रिज़ॉल्यूशन थर्मल इमेजिंग प्रस्तुत की जिसमें दिखाया गया कि सेंटेनरी स्क्वायर फुटपाथ नियमित रूप से जनवरी के अंत में 52 डिग्री सेल्सियस से अधिक हो जाता है। चर्चा किए गए प्रस्तावों में शामिल हैं:
1. उच्च-छतरी वाले पेड़ लगाने के लिए $1.2 मिलियन आवंटित करना।
2. ग्रेवाटर से संचालित सार्वजनिक कूलिंग मिस्ट सिस्टम का विस्तार करना।
3. 2027 के बाद निर्मित सभी वाणिज्यिक पहलुओं को कम-एल्बिडो पर्यावरण-सामग्री कोटिंग का उपयोग करने की आवश्यकता है।`
    },
    summary: {
      en: 'Parramatta council is reviewing a major $1.2M strategy to combat extreme summer pavement heat (exceeding 52°C) in Centenary Square by installing adaptive canopy trees, greywater cooling mist networks, and mandatory exterior high-reflectivity solar-reflective coatings for incoming skyscrapers.',
      zh: '帕拉马塔议会正在审查一项总额120万澳元的重大工程，通过在百年广场引入林荫绿植排布、中水净化降温喷雾网，并强制要求未来落成的摩天大楼使用高太阳能反射表层，来对抗盛夏时分地表突破52°C的酷热天气。',
      hn: 'पैरामाटा काउंसिल सेंटेनरी स्क्वायर में चरम संचय गर्मी (52 डिग्री सेल्सियस से अधिक) का मुकाबला करने के लिए $ 1.2M की एक बड़ी रणनीति की समीक्षा कर रही है।'
    },
    keyTakeaways: [
      {
        en: 'Centenary Square pavement peak temperature reaches critical 52°C.',
        zh: '百年广场的人行道路表最高温度达到了危险的52°C。',
        hn: 'सेंटेनरी स्क्वायर फुटपाथ का तापमान महत्वपूर्ण 52 डिग्री सेल्सियस तक पहुँच जाता है।'
      },
      {
        en: 'Deliberation of $1.2M funding for cooling canopies and fountains.',
        zh: '热议拨款120万澳元用于引进降温林荫蓬与蓄水景观。',
        hn: 'कूलिंग कैनोपी और फव्वारों के लिए $1.2M फंडिंग का विचार।'
      },
      {
        en: 'Push to regulate building facades with climate-resilient refractive paints starting 2027.',
        zh: '力推从2027年起规范商用大楼表层必须采用抗温反射环保漆层。',
        hn: '2027 से जलवायु-लचीला अपवर्तक पेंट के साथ इमारतों को विनियमित करने का दबाव।'
      }
    ]
  },
  {
    id: 'meet-2',
    title: {
      en: 'River Corridor Cultural Activation and Public Lighting Expansion',
      zh: '滨河走廊文化活化与全域公共照明拓展案',
      hn: 'नदी गलियारा सांस्कृतिक सक्रियण और सार्वजनिक प्रकाश विस्तार'
    },
    date: 'May 25, 2026',
    locationName: 'Phive Civic Centre, Parramatta Square',
    notes: {
      en: `The evening forum was held in the iconic Phive Civic Centre focusing on revitalizing Parramatta River's night-time safety and artistic atmosphere. 
      The primary proposal focuses on deploying 140 energy-efficient smart LED streetlights that adjust temperature from golden warm to cool white based on proximity sensors and wildlife circadian rhythms (particularly respecting local micro-bat habitats along the mangroves).
      Superintendent John Vance reported that the illumination upgrade would likely reduce twilight incident rates by 28%. Live art group 'ParraNights' proposed matching the street lighting with low-lux neon poetry murals that spotlight Indigenous Dharug heritage.
      Funding of $450,000 was approved in principle. Local business coalitions voiced support, hoping for a secondary uplift in late-night takeaway sales.`,
      zh: `晚间交流会在标志性的 Phive 社区文化中心举行，重点关注重塑帕拉马塔河沿线夜间步行安全与文化艺术氛围。
      核心讨论案拟沿着河堤走廊升级140盏高效智能LED路灯。这些路灯搭载红外距离传感器，且能配合当地沿岸红树林中珍贵微型蝙蝠等野生动物的昼夜节律自动调整色温（从微黄暖光到柔和白光）。
      警长John Vance向理事会报告称，夜间照明系统升级有望使黄昏发生的安全事故率大跌28%。地方现场艺术团“ParraNights”则建议把城市功能路灯与低照度霓虹微风诗歌壁画融为一体，彰显达鲁格原住民遗址魅力。
      市议会对这笔45万美元的配套拨款表示原则上的通过，当地商业机构联合会纷纷投递支持书，期望带动河景深夜餐饮及外载零商活力。`,
      hn: `Phive सिविक सेंटर में शाम का मंच आयोजित किया गया था जिसमें पैरामाटा नदी की रात की सुरक्षा और परिचालन माहौल को पुनर्जीवित करने पर ध्यान केंद्रित किया गया था।
      प्राथमिक प्रस्ताव 140 ऊर्जा-कुशल स्मार्ट एलईडी स्ट्रीटलाइट्स को तैनात करने पर केंद्रित है जो निकटता सेंसर के आधार पर सुनहरे गर्म से शांत सफेद तक तापमान को समायोजित करते हैं।
      सुपरिटेंडेंट जॉन वेंस ने रिपोर्ट दी कि रोशनी अपग्रेड से शाम की अप्रिय घटनाओं की दर 28% कम हो जाएगी। $450,000 का फंड स्वीकृत किया गया।`
    },
    summary: {
      en: 'Approval of a $450K budget for adaptive LED smart-lighting along the River corridor, designed specifically to balance civic nighttime safety (aiming for 28% incident reduction) with specialized eco-dimming to protect local riverbat nocturnal circles.',
      zh: '市议会原则上通过首批45万澳元资金，沿河畔公共步行道部署自适应智能LED路灯。该照明提升旨在一方面夯实夜行公共治安（力争削减28%的安全事故），另一方面通过针对性生物夜间避光频闪技术，切实呵护河岸红树林生物圈。',
      hn: 'नदी गलियारे के साथ अनुकूली एलईडी स्मार्ट-लाइटिंग के लिए $450K बजट की स्वीकृति प्रदान की गई है।'
    },
    keyTakeaways: [
      {
        en: '$450K allocated to install eco-friendly sensor-based light nodes.',
        zh: '投入45万澳元专门布设搭载距离感应与生态友好的微光源。',
        hn: 'पारिस्थितिकी-अनुकूल सेंसर-आधारित लाइट नोड्स स्थापित करने के लिए $450K आवंटित।'
      },
      {
        en: 'Light wavelengths custom-tuned to preserve rare macro & micro-bat habitats.',
        zh: '灯光波长经光谱定制以尽量避免干扰河岸生态物种栖息规律。',
        hn: 'दुर्लभ चमगादड़ आवासों को संरक्षित करने के लिए प्रकाश तरंग दैर्ध्य को अनुकूलित किया गया।'
      },
      {
        en: 'Integrated partnership with night mural creators and Aboriginal land associations.',
        zh: '开启市政设施与街头暗光壁画艺术家及原住民社团的跨界合作。',
        hn: 'रात्रिकालीन भित्तिचित्र निर्माताओं और आदिवासी भूमि संघों के साथ एकीकृत साझेदारी।'
      }
    ]
  }
];

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: {
      en: 'Unveiling the River Foreshore Green Ribbon',
      zh: '推介滨河走廊“绿色丝带”公共步行生态空间项目',
      hn: 'नदी कायाकल्प ग्रीन रिबन परियोजना का अनावरण'
    },
    content: {
      en: 'Parramatta Council has officially budgeted $450K towards launching the adaptive LED smart-lighting installation along the Parramatta River corridor. Designed in partnership with the Dharug Elders Circle and local ecologists, this project is part of a grander vision to upgrade active transport channels. By optimizing light wavelengths, we are balancing human pedestrian hazard reduction (projected to drop dusk incident rates by 28%) with critical fauna preservation, ensuring our rare micro-bats aren\'t disoriented during roosting hours.',
      zh: '帕拉马塔议会正式投入45万澳元，启动沿帕拉马塔河畔智能传感器LED走廊路灯。该系统在与当地原住民达鲁格长老会和学者深入探访后实施，是促进河流夜行治安与野生动物（特别是罕见微型蝙蝠）昼夜微光相处、重构深夜夜行环境的典范项目。',
      hn: 'पैरामाटा परिषद ने आधिकारिक तौर पर पैरामाटा नदी के किनारे सेंसर-आधारित स्मार्ट एलईडी लाइटिंग के लिए धन आवंटित किया है। यह परियोजना रात की सुरक्षा को मजबूत करने और दुर्लभ चमगादड़ जैव विविधता को संवारने में सहायक होगी।'
    },
    author: 'Councillor Claire Evans',
    date: '2026-05-28',
    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800&q=80',
    tags: ['Waterfront', 'Ecology', 'Night Safety']
  },
  {
    id: 'blog-2',
    title: {
      en: 'Is Centenary Square Parra\'s Hottest Urban Spot?',
      zh: '百年广场：悉尼西部的极端“热岛”该如何解暑？',
      hn: 'क्या सेंटेनरी स्क्वायर सिडनी का सबसे गर्म स्थान है?'
    },
    content: {
      en: 'As part of our continuous CBD microclimate strategies, latest high-resolution infrared scans reveal Centenary Square paving can easily climb beyond 52°C on peak January summer days. ParraVision\'s expert contributors are proposing a $1.2M strategy for high-canopy tree placements, potted eucalyptus forests, and greywater mist outlets. Introducing shading structures can single-handedly drops local ambient temperature by 4.5°C, transforming concrete squares into cool, walkable oasis portals during sydney high summers.',
      zh: '新红外热图层曝光：盛夏一月的正午，百年广场的水泥地表温度在几小时内可升至恐怖的52°C。对此，ParraVision 平台上来自西悉尼大学建筑学院的多名学者联手提案，拟动用120万预算专门配置可移动高冠幅树林带。这些微型森林将通过抽取喷泉净化中水，使核心步行区物理降温 4.5°C。',
      hn: 'तापमान सेंसर के अनुसार, सेंटेनरी स्क्वायर की सघन सतह जनवरी के गर्म दिनों में 52 डिग्री सेल्सियस तक पहुँच सकती है। पर्यावरण विशेषज्ञों ने छाया कूप और फव्वारे लगाने का $1.2 मिलियन का प्रस्ताव दिया है।'
    },
    author: 'Urban Oasis Academics',
    date: '2026-05-29',
    imageUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80',
    tags: ['Climate', 'Thermal Relief', 'CBD Planning']
  },
  {
    id: 'blog-3',
    title: {
      en: 'Church Street "Eat Street" Acoustic Zones Debated',
      zh: '教堂街餐馆地带：“原声低噪Live音乐角”政策大讨论',
      hn: 'ईट स्ट्रीट ध्वनिक लाइव संगीत क्षेत्र विवाद'
    },
    content: {
      en: 'What are the economics of nightlife? Marcus Vance from Parramatta Live Music Alliance outlines the friction between incoming residential developers desiring silent quarters and local legacy restaurants struggling with noise monitors. Standardizing late-night outdoor dining performance permits directly boosts foot-traffic up to 34% without escalating noise enforcement overheads. A bento-grid park prototype is currently being deliberated in council chamber meetings.',
      zh: '平衡深夜餐饮与居民安眠的良方是什么？当地现场音乐联盟的主理人 Marcus Vance 针对教堂街餐馆区，建议用“可降噪原声音乐特别许可证”取代昂贵的噪音罚款和警力管制。报告表明，此举可在保障两公里内居住区噪声不超标的前提下，为餐饮商家创收约34%的热钱。',
      hn: 'क्या हम शोर सीमा के बिना अपनी रातों को जीवंत बना सकते हैं? स्थानीय रेस्तरां चर्च स्ट्रीट में शाम 8 बजे के बाद कम तीव्रता वाले ध्वनिक वाद्य प्रदर्शन की मांग कर रहे हैं ताकि ग्राहकों को जोड़े रखा जा सके।'
    },
    author: 'Marcus Vance',
    date: '2026-05-30',
    imageUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80',
    tags: ['Nightlife', 'Music', 'Dine-In']
  }
];

export const CivicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<CouncilMeeting | null>(INITIAL_MEETINGS[0]);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);

  const votePoll = (pollId: string, optionId: string) => {
    setPolls(prevPolls =>
      prevPolls.map(poll => {
        if (poll.id !== pollId) return poll;
        
        // If they already voted on this, do nothing to keep vote integrity (or switch vote)
        if (poll.votedOptionId === optionId) return poll;

        const updatedOptions = poll.options.map(opt => {
          let extraVotes = 0;
          if (opt.id === optionId) extraVotes = 1;
          // If they are switching vote, decrement old option
          if (poll.votedOptionId && opt.id === poll.votedOptionId) extraVotes = -1;
          
          return { ...opt, votes: opt.votes + extraVotes };
        });

        const updatedTotal = poll.totalVotes + (poll.votedOptionId ? 0 : 1);

        return {
          ...poll,
          options: updatedOptions,
          votedOptionId: optionId,
          totalVotes: updatedTotal
        };
      })
    );
  };

  const upvoteProposal = (id: string) => {
    setProposals(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const voted = !p.votedUp;
        return {
          ...p,
          upvotes: p.upvotes + (voted ? 1 : -1),
          votedUp: voted
        };
      })
    );
  };

  const addProposal = (
    title: Record<Language, string>,
    description: Record<Language, string>,
    category: ProposalCategory,
    locationName: string,
    author: string,
    tags: string[]
  ) => {
    const newProp: Proposal = {
      id: `prop-${Date.now()}`,
      title,
      description,
      author: author || 'Anonymous Public Expert',
      category,
      upvotes: 1,
      votedUp: true,
      date: new Date().toISOString().split('T')[0],
      locationName: locationName || 'Parramatta CBD',
      tags: tags.length > 0 ? tags : ['Community Pitch']
    };
    setProposals(prev => [newProp, ...prev]);
  };

  const addBlogPost = (
    title: Record<Language, string>,
    content: Record<Language, string>,
    author: string,
    tags: string[],
    imageUrl?: string
  ) => {
    const newBlog: BlogPost = {
      id: `blog-${Date.now()}`,
      title,
      content,
      author: author || 'Guest Author',
      date: new Date().toISOString().split('T')[0],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80',
      tags: tags.length > 0 ? tags : ['Community Bulletin']
    };
    setBlogs(prev => [newBlog, ...prev]);
  };

  const translateText = (key: string): string => {
    const dictionaryEntry = UI_TRANSLATIONS[key];
    if (dictionaryEntry) {
      return dictionaryEntry[language] || dictionaryEntry['en'];
    }
    return key;
  };

  return (
    <CivicContext.Provider
      value={{
        language,
        setLanguage,
        polls,
        votePoll,
        proposals,
        upvoteProposal,
        addProposal,
        selectedZone,
        setSelectedZone,
        meetings: INITIAL_MEETINGS,
        selectedMeeting,
        setSelectedMeeting,
        translateText,
        blogs,
        addBlogPost
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => {
  const context = useContext(CivicContext);
  if (context === undefined) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
