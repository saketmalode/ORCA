export type Language = 'en' | 'hi' | 'mr';

export interface TranslationDict {
  // Header
  appTitle: string;
  appSubtitle: string;
  liveSensors: string;
  zeroLLM: string;
  agentsActive: string;

  // Navigation Tabs
  tabSafety: string;
  tabWhatIf: string;
  tabGeofence: string;
  tabFishing: string;

  // Command Panel
  queryTitle: string;
  querySubtitle: string;
  inputPlaceholder: string;
  btnRun: string;
  presetTitle: string;
  presets: Array<{ label: string; query: string }>;

  // Risk Assessment & Decision Card
  riskHeader: string;
  riskScoreLabel: string;
  levelSafe: string;
  levelModerate: string;
  levelHigh: string;
  levelCritical: string;
  factorsTitle: string;
  recommendationTitle: string;
  consensusTitle: string;
  dataSourceLabel: string;
  disclaimerNotice: string;

  // Factor Labels (Simple Fisherman Terms)
  factorWave: string;
  factorWind: string;
  factorRain: string;
  factorLightning: string;
  factorGeofence: string;

  // What-If Simulation Widget
  whatIfTitle: string;
  whatIfSubtitle: string;
  timeCurrentLabel: string;
  timeAltLabel: string;
  timeSelectTitle: string;
  btnSimulateWhatIf: string;
  riskReductionLabel: string;
  keyChangesLabel: string;

  // Geofencing Widget
  geofenceTitle: string;
  geofenceSubtitle: string;
  speedLabel: string;
  headingLabel: string;
  btnCheckVector: string;
  statusSafeVector: string;
  statusDangerVector: string;
  etaToBorderLabel: string;

  // PFZ & Fishing Tab
  pfzTitle: string;
  pfzOfficialBadge: string;
  pfzNearestLabel: string;
  pfzBearingDist: string;
  pfzDepth: string;
  pfzSpecies: string;
  pfzSuitabilityScore: string;
  pfzNoAdvisory: string;

  // Timeline Bar
  timelineTitle: string;
  timelineNow: string;

  // Map Controls & Shore Presets
  shoresLabel: string;
  layersTitle: string;
  layerPorts: string;
  layerSST: string;
  layerChl: string;
  layerPFZ: string;
  layerHazards: string;
  layerBoundaries: string;
  layerRoutes: string;
  layerTrajectory: string;
  mapHint: string;
  btnInspectPort: string;

  // Drawers
  drawerAuditTitle: string;
  drawerEvidenceTitle: string;
  drawerZeroAIProof: string;

  // Footer
  footerPlatform: string;
  footerDept: string;
  footerSync: string;
  footerNoAI: string;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    appTitle: 'ORCA',
    appSubtitle: 'Marine Ecosystem Reasoning with Collaborative Agents (ISRO / DOS)',
    liveSensors: 'LIVE SENSORS',
    zeroLLM: 'ZERO-LLM (Deterministic)',
    agentsActive: '11 Agents Active',

    tabSafety: '🛡️ Marine Safety',
    tabWhatIf: '⏱️ Best Departure Time',
    tabGeofence: '🛑 Border & Geofence',
    tabFishing: '🐟 Fish Zone (PFZ)',

    queryTitle: 'ORCA Marine Decision Assistant',
    querySubtitle: 'Rule-Based Deterministic Marine Intelligence',
    inputPlaceholder: 'Ask in simple words (e.g., Is it safe to go fishing tomorrow at 6 AM near Kochi?)',
    btnRun: 'Check',
    presetTitle: '⚡ Quick One-Click Scenarios for Fishermen:',
    presets: [
      { label: '⚓ Ratnagiri (Konkan)', query: 'Is it safe to go fishing tomorrow at 6 AM near Ratnagiri?' },
      { label: '🛶 Kochi (Malabar)', query: 'Is it safe to go fishing tomorrow at 6 AM near Kochi?' },
      { label: '🏙️ Mumbai Offshore', query: 'Is it safe to go fishing tomorrow at 6 AM near Mumbai?' },
      { label: '🌅 Chennai (Coromandel)', query: 'Is it safe to go fishing tomorrow at 6 AM near Chennai?' },
      { label: '🚢 Visakhapatnam (Andhra)', query: 'Is it safe to go fishing tomorrow at 6 AM near Visakhapatnam?' },
      { label: '🌊 Porbandar (Gujarat)', query: 'Is it safe to go fishing tomorrow at 6 AM near Porbandar?' },
      { label: '🌾 Paradip (Odisha)', query: 'Is it safe to go fishing tomorrow at 6 AM near Paradip?' },
      { label: '🌿 Digha (Bengal Delta)', query: 'Is it safe to go fishing tomorrow at 6 AM near Digha?' },
      { label: '🌴 Goa (Panaji/Mormugao)', query: 'Is it safe to go fishing tomorrow at 6 AM near Goa?' },
      { label: '🏝️ Port Blair (Andamans)', query: 'Is it safe to go fishing tomorrow at 6 AM near Port Blair?' },
      { label: '⏱️ Best Time: 4 AM vs 6 AM', query: 'What if I leave at 4 AM instead of 6 AM near Ratnagiri?' },
      { label: '🛡️ Safest Sea Route', query: 'Find the safest route to this location' },
      { label: '🐟 Where is Fish Zone?', query: 'Where is the nearest favourable fishing zone?' },
      { label: '⚠️ Dangerous Surge Areas', query: 'Show me dangerous marine areas.' },
      { label: '🛑 Border Alert Check', query: 'Show restricted areas near me.' },
    ],

    riskHeader: 'Sea Safety & Fishing Decision',
    riskScoreLabel: 'Danger Score',
    levelSafe: '🟢 SAFE TO GO (सुरक्षित)',
    levelModerate: '🟡 CAUTION ADVISED (सावधान)',
    levelHigh: '🔴 HIGH DANGER - AVOID (खतरा)',
    levelCritical: '⛔ CRITICAL DANGER (अत्यधिक खतरा)',
    factorsTitle: '📊 Key Ocean & Weather Factors Observed:',
    recommendationTitle: '⚓ Clear Operational Decision for Fishermen:',
    consensusTitle: '🤝 11-Agent Scientific Consensus:',
    dataSourceLabel: 'Verified Data Sources: INCOIS (Sea State), IMD (Weather), ISRO MOSDAC (Satellite).',
    disclaimerNotice: 'Prototype decision-support platform. Always listen to Coast Guard and local port advisories.',

    factorWave: 'Sea Waves Height (लहरें)',
    factorWind: 'Wind Speed (हवा की गति)',
    factorRain: 'Rain & Showers (बारिश)',
    factorLightning: 'Thunder & Lightning (बिजली)',
    factorGeofence: 'Distance to Maritime Border (सीमा दूरी)',

    whatIfTitle: '⏱️ Best Time to Sail (Departure Simulator)',
    whatIfSubtitle: 'Compare sea conditions between two departure times to find the safest window',
    timeCurrentLabel: 'Current Plan (समय १)',
    timeAltLabel: 'Alternative Time (समय २)',
    timeSelectTitle: 'Select and compare departure hours:',
    btnSimulateWhatIf: '⚡ Compare These Times',
    riskReductionLabel: 'Danger Score Change',
    keyChangesLabel: 'Expected Ocean Changes:',

    geofenceTitle: '🛑 Maritime Border & Proximity Alarm',
    geofenceSubtitle: 'Mathematical projection of your boat vector for the next 60 minutes',
    speedLabel: 'Boat Speed (Knots / किमी/घंटा)',
    headingLabel: 'Boat Direction / Heading (°)',
    btnCheckVector: '🧭 Check Course Projection',
    statusSafeVector: '✅ COURSE CLEAR: No border breach projected in next 60 minutes',
    statusDangerVector: '⚠️ WARNING: Vessel vector entering restricted / international boundary',
    etaToBorderLabel: 'Estimated Time to Border',

    pfzTitle: '🐟 INCOIS Fish Finding Zone (PFZ) & Biology',
    pfzOfficialBadge: 'Official Government Advisory',
    pfzNearestLabel: 'Nearest Rich Fishing Zone',
    pfzBearingDist: 'Distance & Direction from Harbour',
    pfzDepth: 'Water Depth for Nets',
    pfzSpecies: 'Target Commercial Fish Species',
    pfzSuitabilityScore: 'Fish Opportunity Index',
    pfzNoAdvisory: 'No active INCOIS PFZ line in this immediate coastal sector.',

    timelineTitle: '🌊 12-Hour Coastal Ocean & Wind Forecast',
    timelineNow: 'Now',

    shoresLabel: 'SHORES:',
    layersTitle: 'Marine Layers',
    layerPorts: 'Shore Ports & Harbours',
    layerSST: 'Sea Surface Temp (MOSDAC)',
    layerChl: 'Chlorophyll Plankton Bloom',
    layerPFZ: 'INCOIS Fish Zones (PFZ)',
    layerHazards: 'High Wave & Storm Alerts',
    layerBoundaries: 'Boundaries & Coral Sanctuaries',
    layerRoutes: 'Fastest vs Safest Route',
    layerTrajectory: 'Boat 60-Min Trajectory',
    mapHint: 'Click any coastal harbour or water coordinate across India for instant multi-agent report',
    btnInspectPort: '🧭 Analyze Shore Conditions',

    drawerAuditTitle: '🤖 11-Agent Autonomous Execution Audit Trail',
    drawerEvidenceTitle: '🔗 Verified Sensor Evidence Provenance (Zero-AI DAG)',
    drawerZeroAIProof: 'Zero Generative AI Model Dependency — Verified Deterministic Rules',

    footerPlatform: 'ORCA Marine Decision Platform • SIH 2026',
    footerDept: 'Department of Space / ISRO',
    footerSync: '● INCOIS OSF & IMD Bulletins Live Synchronized',
    footerNoAI: 'Strict Zero-LLM Architecture',
  },

  hi: {
    appTitle: 'ओरका (ORCA)',
    appSubtitle: 'भारतीय समुद्री मौसम एवं मछुआरा निर्णय-सहायता प्रणाली (इसरो / अंतरिक्ष विभाग)',
    liveSensors: 'लाइव सेंसर डेटा',
    zeroLLM: 'सटीक गणितीय मॉडल (Zero-LLM)',
    agentsActive: '11 एजेंट सक्रिय',

    tabSafety: '🛡️ क्या समुद्र में जाएं? (सुरक्षा)',
    tabWhatIf: '⏱️ किस समय जाना सही है?',
    tabGeofence: '🛑 समुद्री सीमा चेतावनी',
    tabFishing: '🐟 मछली कहाँ मिलेगी? (PFZ)',

    queryTitle: 'ओरका समुद्री सलाहकार टर्मिनल',
    querySubtitle: 'सटीक नियमों और सरकारी डेटा पर आधारित समुद्री सूचना',
    inputPlaceholder: 'आसान भाषा में पूछें (जैसे: क्या कल सुबह 6 बजे कोच्चि के पास समुद्र में जाना सुरक्षित है?)',
    btnRun: 'जाँचें',
    presetTitle: '⚡ मछुआरों के लिए मुख्य एक-क्लिक सवाल:',
    presets: [
      { label: '⚓ रत्नागिरी (महाराष्ट्र)', query: 'कल सुबह रत्नागिरी के पास मछली पकड़ना सुरक्षित है क्या?' },
      { label: '🛶 कोच्चि (केरल)', query: 'कल सुबह कोच्चि के पास मछली पकड़ना सुरक्षित है क्या?' },
      { label: '🏙️ मुंबई समुद्र तट', query: 'कल सुबह मुंबई के पास मछली पकड़ना सुरक्षित है क्या?' },
      { label: '🌅 चेन्नई (तमिलनाडु)', query: 'कल सुबह चेन्नई के पास मछली पकड़ना सुरक्षित है क्या?' },
      { label: '🚢 विशाखापट्टनम (आंध्र)', query: 'कल सुबह विशाखापट्टनम के पास मछली पकड़ना सुरक्षित है क्या?' },
      { label: '🌊 पोरबंदर (गुजरात)', query: 'कल सुबह पोरबंदर के पास मछली पकड़ना सुरक्षित है क्या?' },
      { label: '🌾 पारादीप (ओडिशा)', query: 'कल सुबह पारादीप के पास मछली पकड़ना सुरक्षित है क्या?' },
      { label: '🌿 दीघा (पश्चिम बंगाल)', query: 'कल सुबह दीघा के पास मछली पकड़ना सुरक्षित है क्या?' },
      { label: '🌴 गोवा तट', query: 'कल सुबह गोवा के पास मछली पकड़ना सुरक्षित है क्या?' },
      { label: '🏝️ पोर्ट ब्लेयर (अंडमान)', query: 'कल सुबह पोर्ट ब्लेयर के पास मछली पकड़ना सुरक्षित है क्या?' },
      { label: '⏱️ समय तुलना: सुबह 4 बजे बनाम 6 बजे', query: 'यदि मैं रत्नागिरी से सुबह 6 बजे के बजाय 4 बजे निकलूं तो क्या होगा?' },
      { label: '🛡️ सबसे सुरक्षित समुद्री रास्ता', query: 'खतरे से बचकर जाने का सुरक्षित रास्ता बताएं' },
      { label: '🐟 मछली पकड़ने का मुख्य क्षेत्र कहाँ है?', query: 'मछली पकड़ने का सबसे अच्छा क्षेत्र कहाँ है?' },
      { label: '⚠️ खतरनाक लहरों वाले क्षेत्र दिखाएं', query: 'समुद्र में खतरनाक लहरों वाले क्षेत्र दिखाएं' },
      { label: '🛑 प्रतिबंधित सीमा और अभ्यास क्षेत्र', query: 'प्रतिबंधित समुद्री सीमा दिखाएं' },
    ],

    riskHeader: 'समुद्री सुरक्षा एवं मासेमारी निर्णय',
    riskScoreLabel: 'जोखिम स्कोर',
    levelSafe: '🟢 जाना सुरक्षित है (SAFE)',
    levelModerate: '🟡 सावधानी जरूरी है (CAUTION)',
    levelHigh: '🔴 भारी खतरा - न जाएं (DANGER)',
    levelCritical: '⛔ अत्यंत खतरनाक - तुरंत रुकें (CRITICAL)',
    factorsTitle: '📊 समुद्र और मौसम के मुख्य आंकड़े:',
    recommendationTitle: '⚓ मछुआरों के लिए स्पष्ट सलाह:',
    consensusTitle: '🤝 11 वैज्ञानिक सॉफ्टवेयर एजेंटों की सर्वसम्मति:',
    dataSourceLabel: 'प्रमाणित डेटा स्रोत: INCOIS (समुद्री लहरें), IMD (मौसम विभाग), ISRO MOSDAC (उपग्रह)।',
    disclaimerNotice: 'यह निर्णय-सहायक प्रणाली है। कृपया तटरक्षक बल (Coast Guard) के निर्देशों का पालन करें।',

    factorWave: 'समुद्र की लहरें (Wave Height)',
    factorWind: 'हवा की रफ्तार (Wind Speed)',
    factorRain: 'बारिश (Rainfall)',
    factorLightning: 'आकाशीय बिजली (Lightning Alert)',
    factorGeofence: 'समुद्री सीमा से दूरी (Border Distance)',

    whatIfTitle: '⏱️ निकलने का सही समय (समय तुलना सिम्युलेटर)',
    whatIfSubtitle: 'दो अलग-अलग समय पर समुद्र की स्थिति की तुलना करके सबसे सुरक्षित समय चुनें',
    timeCurrentLabel: 'पहला समय (Time 1)',
    timeAltLabel: 'दूसरा समय (Time 2)',
    timeSelectTitle: 'निकलने का समय बदलकर देखें:',
    btnSimulateWhatIf: '⚡ इन दोनों समय की तुलना करें',
    riskReductionLabel: 'जोखिम में बदलाव (Risk Delta)',
    keyChangesLabel: 'मौसम और लहरों में होने वाले बदलाव:',

    geofenceTitle: '🛑 समुद्री सीमा एवं सुरक्षा अलार्म',
    geofenceSubtitle: 'नाव की दिशा और गति के आधार पर अगले 60 मिनट का सटीक प्रक्षेपण',
    speedLabel: 'नाव की गति (Knots / समुद्री मील)',
    headingLabel: 'नाव की दिशा / हेडिंग (°)',
    btnCheckVector: '🧭 दिशा और सीमा की जाँच करें',
    statusSafeVector: '✅ सुरक्षित मार्ग: अगले 60 मिनट तक नाव किसी भी सीमा या निषिद्ध क्षेत्र से दूर रहेगी',
    statusDangerVector: '⚠️ चेतावनी: नाव प्रतिबंधित या अंतरराष्ट्रीय सीमा की ओर जा रही है',
    etaToBorderLabel: 'सीमा तक पहुँचने का अनुमानित समय',

    pfzTitle: '🐟 सरकारी मछली क्षेत्र (INCOIS PFZ) व समुद्री जीवन',
    pfzOfficialBadge: 'आधिकारिक सरकारी सलाह',
    pfzNearestLabel: 'निकटतम सबसे बड़ा मछली क्षेत्र',
    pfzBearingDist: 'बंदरगाह से दूरी और दिशा',
    pfzDepth: 'जाल डालने की गहराई',
    pfzSpecies: 'मिलने वाली प्रमुख मछलियां',
    pfzSuitabilityScore: 'मछली उपलब्धता सूचकांक',
    pfzNoAdvisory: 'इस तट के पास अभी कोई सक्रिय PFZ रेखा नहीं है।',

    timelineTitle: '🌊 आगामी 12 घंटों का लहर और हवा का पूर्वानुमान',
    timelineNow: 'अभी',

    shoresLabel: 'तटीय क्षेत्र:',
    layersTitle: 'समुद्री परतें (Layers)',
    layerPorts: 'तटीय बंदरगाह व जेटी',
    layerSST: 'समुद्र का तापमान (MOSDAC)',
    layerChl: 'क्लोरोफिल व प्लैंकटन (भोजन)',
    layerPFZ: 'मछली पकड़ने के क्षेत्र (PFZ)',
    layerHazards: 'ऊंची लहरें व तूफानी चेतावनी',
    layerBoundaries: 'समुद्री सीमा व प्रवाल अभयारण्य',
    layerRoutes: 'तेज़ बनाम सबसे सुरक्षित रास्ता',
    layerTrajectory: 'नाव का 60 मिनट का रास्ता',
    mapHint: 'भारत के किसी भी बंदरगाह या समुद्री बिंदु पर क्लिक करके लाइव रिपोर्ट देखें',
    btnInspectPort: '🧭 इस तट की स्थिति जाँचें',

    drawerAuditTitle: '🤖 11 सॉफ्टवेयर एजेंटों की कार्य प्रणाली (Audit Trail)',
    drawerEvidenceTitle: '🔗 सेंसर डेटा प्रमाण श्रृंखला (Data Provenance DAG)',
    drawerZeroAIProof: 'शून्य जेनेरिक एआई मॉडल निर्भरता — 100% सटीक गणितीय नियम',

    footerPlatform: 'ओरका (ORCA) समुद्री निर्णय मंच • SIH 2026',
    footerDept: 'अंतरिक्ष विभाग / भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO)',
    footerSync: '● INCOIS व मौसम विभाग (IMD) से लाइव सिंक्रोनाइज़्ड',
    footerNoAI: 'सख्त Zero-LLM आर्किटेक्चर',
  },

  mr: {
    appTitle: 'ओर्का (ORCA)',
    appSubtitle: 'भारतीय सागरी हवामान व मच्छीमार निर्णय-सहाय्य प्रणाली (इस्रो / अंतराळ विभाग)',
    liveSensors: 'थेट सेन्सर डेटा',
    zeroLLM: 'अचूक गणितीय मॉडेल (Zero-LLM)',
    agentsActive: '११ एजंट्स कार्यरत',

    tabSafety: '🛡️ समुद्रात जाणे सुरक्षित आहे का?',
    tabWhatIf: '⏱️ कोणत्या वेळी जाणे योग्य?',
    tabGeofence: '🛑 सागरी सीमा इशारा',
    tabFishing: '🐟 मासे कुठे मिळतील? (PFZ)',

    queryTitle: 'ओर्का सागरी सल्लागार टर्मिनल',
    querySubtitle: 'नियमबद्ध आणि थेट सरकारी डेटावर आधारित सागरी माहिती',
    inputPlaceholder: 'सोप्या भाषेत विचारा (उदा. उद्या सकाळी ६ वाजता रत्नागिरीजवळ मासेमारी सुरक्षित आहे का?)',
    btnRun: 'तपासा',
    presetTitle: '⚡ मच्छीमारांसाठी महत्त्वाचे एका-क्लिकचे प्रश्न:',
    presets: [
      { label: '⚓ रत्नागिरी (कोकण)', query: 'उद्या सकाळी रत्नागिरीजवळ मासेमारी करणे सुरक्षित आहे का?' },
      { label: '🛶 कोची (केरळ)', query: 'उद्या सकाळी कोचीजवळ मासेमारी करणे सुरक्षित आहे का?' },
      { label: '🏙️ मुंबई किनारा', query: 'उद्या सकाळी मुंबईजवळ मासेमारी करणे सुरक्षित आहे का?' },
      { label: '🌅 चेन्नई (कोरोमंडल)', query: 'उद्या सकाळी चेन्नईजवळ मासेमारी करणे सुरक्षित आहे का?' },
      { label: '🚢 विशाखापट्टणम (आंध्र)', query: 'उद्या सकाळी विशाखापट्टणमजवळ मासेमारी करणे सुरक्षित आहे का?' },
      { label: '🌊 पोरबंदर (गुजरात)', query: 'उद्या सकाळी पोरबंदरजवळ मासेमारी करणे सुरक्षित आहे का?' },
      { label: '🌾 पारादीप (ओडिशा)', query: 'उद्या सकाळी पारादीपजवळ मासेमारी करणे सुरक्षित आहे का?' },
      { label: '🌿 दीघा (पश्चिम बंगाल)', query: 'उद्या सकाळी दीघाजवळ मासेमारी करणे सुरक्षित आहे का?' },
      { label: '🌴 गोवा किनारा', query: 'उद्या सकाळी गोव्याजवळ मासेमारी करणे सुरक्षित आहे का?' },
      { label: '🏝️ पोर्ट ब्लेअर (अंदमान)', query: 'उद्या सकाळी पोर्ट ब्लेअरजवळ मासेमारी करणे सुरक्षित आहे का?' },
      { label: '⏱️ वेळ तुलना: पहाटे ४ वि. सकाळी ६', query: 'मी उद्या सकाळी ६ ऐवजी पहाटे ४ वाजता निघालो तर काय होईल?' },
      { label: '🛡️ सर्वात सुरक्षित सागरी मार्ग', query: 'धोका टाळून जाण्याचा सर्वात सुरक्षित मार्ग दाखवा' },
      { label: '🐟 अनुकूल मासेमारी क्षेत्र कुठे आहे?', query: 'जवळचे अनुकूल मासेमारी क्षेत्र कुठे आहे?' },
      { label: '⚠️ धोकादायक लाटांचे क्षेत्र दाखवा', query: 'धोकादायक लाटांचे क्षेत्र दाखवा' },
      { label: '🛑 प्रतिबंधित सीमा व सराव क्षेत्र', query: 'जवळचे प्रतिबंधित क्षेत्र दाखवा' },
    ],

    riskHeader: 'सागरी सुरक्षा व मासेमारी निर्णय',
    riskScoreLabel: 'जोखीम निर्देशांक',
    levelSafe: '🟢 जाणे सुरक्षित आहे (SAFE)',
    levelModerate: '🟡 काळजीपूर्वक जा (CAUTION)',
    levelHigh: '🔴 जास्त धोका - जाऊ नका (DANGER)',
    levelCritical: '⛔ अत्यंत धोकादायक (CRITICAL)',
    factorsTitle: '📊 समुद्र व हवामानाची प्रमुख निरीक्षणे:',
    recommendationTitle: '⚓ मच्छीमारांसाठी थेट व स्पष्ट सल्ला:',
    consensusTitle: '🤝 ११ वैज्ञानिक सॉफ्टवेअर एजंट्सचे एकमत:',
    dataSourceLabel: 'प्रमाणित डेटा स्रोत: INCOIS (सागरी स्थिती), IMD (हवामान विभाग), ISRO MOSDAC (उपग्रह).',
    disclaimerNotice: 'ही निर्णय-सहाय्यक प्रणाली आहे. कृपया तटरक्षक दलाच्या (Coast Guard) सूचना पाळा.',

    factorWave: 'सागरी लाटांची उंची (Wave Height)',
    factorWind: 'वाऱ्याचा वेग (Wind Speed)',
    factorRain: 'पावसाची शक्यता (Rainfall)',
    factorLightning: 'विजांचा कडकडाट (Lightning Alert)',
    factorGeofence: 'सागरी सीमेचे अंतर (Border Distance)',

    whatIfTitle: '⏱️ निघण्याची योग्य वेळ (वेळ तुलना सिम्युलेटर)',
    whatIfSubtitle: 'दोन वेगवेगळ्या वेळेच्या सागरी स्थितीची तुलना करून सुरक्षित वेळ निवडा',
    timeCurrentLabel: 'पहिली वेळ (Time 1)',
    timeAltLabel: 'दुसरी वेळ (Time 2)',
    timeSelectTitle: 'निघण्याची वेळ बदलून तपासा:',
    btnSimulateWhatIf: '⚡ या दोन्ही वेळांची तुलना करा',
    riskReductionLabel: 'धोक्यातील घट (Risk Delta)',
    keyChangesLabel: 'हवामान व लाटांमध्ये होणारे बदल:',

    geofenceTitle: '🛑 सागरी सीमा व सुरक्षा अलार्म',
    geofenceSubtitle: 'बोटीच्या दिशेनुसार पुढील ६० मिनिटांचे अचूक प्रक्षेपण',
    speedLabel: 'बोटीचा वेग (Knots / किमी/तास)',
    headingLabel: 'बोटीची दिशा / हेडिंग (°)',
    btnCheckVector: '🧭 दिशा आणि सीमेची तपासणी करा',
    statusSafeVector: '✅ सुरक्षित मार्ग: पुढील ६० मिनिटांत बोट कोणत्याही प्रतिबंधित सीमेत जाणार नाही',
    statusDangerVector: '⚠️ इशारा: बोट प्रतिबंधित किंवा आंतरराष्ट्रीय सीमेच्या दिशेने जात आहे',
    etaToBorderLabel: 'सीमेपर्यंत पोहोचण्याचा अंदाजे वेळ',

    pfzTitle: '🐟 सरकारी मासेमारी क्षेत्र (INCOIS PFZ) व सागरी जीव',
    pfzOfficialBadge: 'अधिकृत सरकारी सल्ला',
    pfzNearestLabel: 'जवळचे मुख्य मासेमारी क्षेत्र',
    pfzBearingDist: 'बंदरापासून अंतर व दिशा',
    pfzDepth: 'जाळे टाकण्याची खोली',
    pfzSpecies: 'सापडणारे प्रमुख मासे',
    pfzSuitabilityScore: 'मासे मिळण्याची अनुकूलता',
    pfzNoAdvisory: 'या किनाऱ्याजवळ सध्या कोणतीही सक्रिय PFZ रेषा उपलब्ध नाही.',

    timelineTitle: '🌊 पुढील १२ तासांचा लाटा व वाऱ्याचा अंदाज',
    timelineNow: 'आता',

    shoresLabel: 'किनारपट्टी भाग:',
    layersTitle: 'सागरी स्तर (Layers)',
    layerPorts: 'किनारी बंदरे व जेटी',
    layerSST: 'समुद्राचे तापमान (MOSDAC)',
    layerChl: 'प्लवक व अन्न घटक (Chlorophyll)',
    layerPFZ: 'मासेमारी क्षेत्रे (PFZ Lines)',
    layerHazards: 'उंच लाटा व वादळ इशारे',
    layerBoundaries: 'सागरी सीमा व अभयारण्ये',
    layerRoutes: 'जलद वि. सर्वात सुरक्षित मार्ग',
    layerTrajectory: 'बोटीचा ६० मिनिटांचा मार्ग',
    mapHint: 'भारतातील कोणत्याही बंदरावर किंवा समुद्रातील बिंदूवर क्लिक करून थेट अहवाल मिळवा',
    btnInspectPort: '🧭 या किनाऱ्याची माहिती तपासा',

    drawerAuditTitle: '🤖 ११ सॉफ्टवेअर एजंट्सची कार्यप्रणाली (Audit Trail)',
    drawerEvidenceTitle: '🔗 सेन्सर डेटा पुरावा साखळी (Data Provenance DAG)',
    drawerZeroAIProof: 'शून्य जेनेरिक एआय अवलंबित्व — १००% अचूक वैज्ञानिक नियम',

    footerPlatform: 'ओर्का (ORCA) सागरी निर्णय मंच • SIH 2026',
    footerDept: 'अंतराळ विभाग / भारतीय अंतराळ संशोधन संस्था (ISRO)',
    footerSync: '● INCOIS आणि हवामान विभागाकडून थेट अपडेट',
    footerNoAI: 'अचूक Zero-LLM आर्किटेक्चर',
  },
};
