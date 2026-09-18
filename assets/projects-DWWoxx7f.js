const KEY=`jadwa:projects`;
function uid(){try{return crypto.randomUUID()}catch{return`p_${Date.now()}`}}
function load(){try{let e=localStorage.getItem(KEY);return e?JSON.parse(e):[]}catch{return[]}}
function save(e){localStorage.setItem(KEY,JSON.stringify(e))}
function summarize(p){return{id:p.id,title:p.title,status:p.status,country:p.country,currency:p.currency,capital:p.capital,npv:p.npv}}
async function getCompute(){const m=await import(`./schema-D5neG8AA.js`);return m.r}
async function buildReport(inputs){
  const compute=await getCompute();
  const model=compute(inputs);
  const lang=inputs.language||`ar`;
  const irr=model.metrics.irr;
  const irrTxt=irr==null?`—`:(irr*100).toFixed(1)+`%`;
  const npv=model.metrics.npv.toFixed(0);
  const ar=lang===`ar`;
  const narrative={
    executiveSummary:ar
      ?`دراسة محلية لمشروع «${inputs.title}»: صافي القيمة الحالية ${npv} ${inputs.currency}، ومعدل العائد الداخلي ${irrTxt}، والحكم ${model.metrics.verdict} (درجة ${model.metrics.verdictScore}). الأرقام محسوبة محليًا في المتصفح.`
      :`Local study for “${inputs.title}”: NPV ${npv} ${inputs.currency}, IRR ${irrTxt}, verdict ${model.metrics.verdict} (score ${model.metrics.verdictScore}). Figures are computed locally in the browser.`,
    marketAnalysis:ar
      ?`تحليل سوق مبسّط محليًا بدون مصادر سحابية. راجع الافتراضات والأرقام قبل أي قرار استثماري.`
      :`Simplified local market note without cloud research. Review assumptions before any investment decision.`,
    technical:ar
      ?`الافتراضات التقنية والمالية مأخوذة من المدخلات التي أدخلتها (رأس المال، الإيراد، التكاليف، الضرائب، وسنوات الإسقاط).`
      :`Technical and financial assumptions come from the inputs you entered (capital, revenue, costs, tax, projection years).`,
    operations:ar
      ?`التشغيل مُنمذج عبر نمو الإيراد والتكاليف وعدد الموظفين والرواتب كما في النموذج.`
      :`Operations are modeled via revenue/cost growth, headcount and salaries as entered.`,
    risks:ar
      ?`المخاطر تشمل تغيّر الطلب، ارتفاع التكاليف، وتأخّر التشغيل. الحساسية في التقرير تساعد على اختبار السيناريوهات.`
      :`Risks include demand shifts, cost inflation, and delayed ramp-up. Sensitivity in the report helps stress-test scenarios.`,
    recommendations:ar
      ?`راجع صافي القيمة الحالية ومعدل العائد وفترة الاسترداد قبل الالتزام. هذه نسخة محلية مبسّطة وليست استشارة استثمارية.`
      :`Review NPV, IRR and payback before committing. This is a simplified local build, not investment advice.`,
    conclusion:ar
      ?`الخلاصة وفق المحرك المحلي: الحكم ${model.metrics.verdict}. استخدم الأرقام كنقطة انطلاق ثم دقّق بالبيانات الميدانية.`
      :`Local-engine conclusion: verdict ${model.metrics.verdict}. Treat figures as a starting point and validate with field data.`,
    swot:{
      strengths:ar?`نموذج مالي حتمي واضح؛ مدخلات قابلة للتعديل؛ مؤشرات NPV/IRR/الاسترداد فورية.`:`Deterministic model; editable inputs; immediate NPV/IRR/payback indicators.`,
      weaknesses:ar?`بدون بحث سوق سحابي حيّ؛ الافتراضات تعتمد على تقديرك.`:`No live cloud market research; assumptions depend on your estimates.`,
      opportunities:ar?`تحسين التسعير أو خفض التكاليف التشغيلية يرفع العائد بسرعة في الحساسية.`:`Pricing or opex improvements move returns quickly in sensitivity.`,
      threats:ar?`ضغط المنافسة وتغيّر التكاليف قد يقلّل الهوامش عن السيناريو الأساسي.`:`Competition and cost inflation can compress margins vs the base case.`
    },
    usedAi:!1
  };
  return{inputs,...model,narrative,research:null,citations:[]};
}
async function listProjects(){return load().map(summarize)}
async function quota(){return{remaining:99,limit:99}}
async function getProject(arg){const id=arg&&arg.data!==void 0?arg.data:arg;const p=load().find(x=>x.id===id);if(!p)throw new Error(`not found`);return p}
async function deleteProject(arg){const id=arg&&arg.data!==void 0?arg.data:arg;save(load().filter(x=>x.id!==id));return{ok:!0}}
async function saveDraft(arg){
  const payload=arg&&arg.data!==void 0?arg.data:arg||{};
  const inputs=payload.data??payload;
  const id=uid();
  const project={id,title:inputs.title,description:inputs.description,country:inputs.country,currency:inputs.currency,capital:inputs.capital,status:`draft`,npv:null,inputs,reports:[],createdAt:new Date().toISOString()};
  save([project,...load()]);
  return{id};
}
async function generate(arg){
  const payload=arg&&arg.data!==void 0?arg.data:arg||{};
  const inputs=payload.data??payload;
  if(!inputs||typeof inputs!==`object`||!inputs.title)throw new Error(`invalid inputs`);
  const projectId=payload.projectId;
  const report=await buildReport(inputs);
  const id=projectId||uid();
  const existing=load();
  const prev=existing.find(x=>x.id===id);
  const project={id,title:inputs.title,description:inputs.description,country:inputs.country,currency:inputs.currency,capital:inputs.capital,status:`ready`,npv:report.metrics.npv,inputs,reports:[{content:report,createdAt:new Date().toISOString()}],createdAt:prev?.createdAt||new Date().toISOString()};
  save([project,...existing.filter(x=>x.id!==id)]);
  return{ok:!0,projectId:id};
}
async function noop(){return{ok:!0}}
const o=listProjects,a=quota,u=generate,c=saveDraft,s=getProject,d=noop,l=deleteProject;
export{o as a,a as i,u as n,c as o,s as r,d as s,l as t};
