var e=Object.defineProperty,a=Object.defineProperties,t=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,l=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable,n=(a,t,r)=>t in a?e(a,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):a[t]=r,s=(e,a)=>{for(var t in a||(a={}))l.call(a,t)&&n(e,t,a[t]);if(r)for(var t of r(a))o.call(a,t)&&n(e,t,a[t]);return e},i=(e,r)=>a(e,t(r));import{h as c,t as p}from"./vendor.d8d0fb72.js";const g={selectLanguage:"选择语言",aboutText1:"少女乐团派对辅助工具集 / Wasmdori",frontPage:"前端代码",subProject:"子项目",helpProject:"感谢下面这些第三方项目的帮助！！！",hintText1:"选择服务器和截图后，点击截图中左上方的卡片，即可在截图右边的表格中选择识别出的卡片",hintText2:"在表格中选择识别出的卡片后，点击“生成”按钮就可以在下方看到生成的 Bestdori 用户资料",hintText3:"(可以使用多张图片导入数据，只需在“选择截图”处选择下一张图片就可以导入了)",cardRecognize:"卡片识别",teamBuilder:"组队助手",selectServer:"选择服务器",selectCharacter:"选择加成角色",userProfile:"用户资料",selectParameter:"选择加成技能",selectProperty:"选择加成属性",selectScreenshot:"选择截图",waitRecognize:"等待识别",cardImage:"图片",id:"Id",cardName:"卡片名字",character:"角色",selected:"选中",nextPage:"下一页",prevPage:"上一页",selectAll:"全选",generate:"生成",showImage:"显示图片",hideImage:"隐藏图片",performance:"演出",technique:"技巧",visual:"形象",propBonus:"属性加成大小",characterBonus:"角色加成大小",allFitBonus:"所有匹配时加成大小",selectMode:"选择模式",freePlay:"自由模式",multiPlay:"协力模式",vsPlay:"竞演模式",selectProfile:"选择用户资料",profile:"用户资料",profileName:"资料名字",profileServer:"资料服务器",importProfileData:"导入资料数据",setPrimaryData:"设置为首选资料",createNewProfile:"创建新资料",deleteProfile:"删除资料",appendToProfile:"附加到资料",eventGacha:"卡池千里眼",pageCount:"选择页面活动个数",startEvent:"选择开始活动",loading:"加载中"},d={selectLanguage:"Select language",aboutText1:"Bandori band girl party assist tools / Wasmdori",frontPage:"Front-end project",subProject:"Sub project",helpProject:"Thank you, the following third-party projects!!!",hintText1:"After selected server and screenshot, click the card on the left-top in the screenshot, you will see the recognized card in the left table",hintText2:'After selected the recognized card in the table, click "Generate" button to generate the user profile that can be used by Bestdori',hintText3:'(You can use multiple screenshot to generate user profile, just use "Select screenshot" to add next screenshot)',cardRecognize:"Card Recognize",teamBuilder:"Team Builder",selectServer:"Select server",selectCharacter:"Select bonus Character",userProfile:"User profile",selectParameter:"Select bonus parameter",selectProperty:"Select bonus property",selectScreenshot:"Select screenshot",waitRecognize:"Waiting for card recognition",cardImage:"Image",id:"Id",cardName:"Card name",character:"Character",selected:"Selected",nextPage:"Next page",prevPage:"Prev page",selectAll:"Select all",generate:"Generate",showImage:"Show image",hideImage:"Hide image",performance:"Performance",technique:"Technique",visual:"Visual",propBonus:"Prop bonus",characterBonus:"Character bonus",allFitBonus:"All fit bonus",selectMode:"Select game mode",freePlay:"Free Play",multiPlay:"Multi Play",vsPlay:"VS Play",profile:"User Profile",selectProfile:"Select profile",profileName:"Profile name",profileServer:"Profile server",importProfileData:"Import profile",setPrimaryData:"Set as primary profile",createNewProfile:"Create new profile",deleteProfile:"Delete profile",appendToProfile:"Append to profile",eventGacha:"Event-Gacha-Viewer",pageCount:"Select item per page",startEvent:"Select start event",loading:"Loading"},u=[d,d,g,g],f=(e,a)=>{fetch(a.url).then((e=>e.json())).then((t=>e(a.action,t)))},h=(e,a)=>[f,{url:e,action:a}],m=(e,a)=>i(s({},e),{rawBands:a}),v=(e,a)=>i(s({},e),{rawCards:a}),b=(e,a)=>i(s({},e),{rawHashes:a}),P=(e,a)=>{let t="";for(let r=0;r<a;r++){let a=e%64;e=Math.floor(e/64),t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"[a]+t}return t},S=e=>{let a="";for(let t=0;t<e.length;t++){let r=e[t];a+=r.id>=1e4?P(r.id-1e4+3072,2):P(r.id,2),a+=P(r.level,1),a+=P(1*(r.exclude?1:0)+2*r.art+4*r.train+8*r.ep+24*r.skill,2)}return a},y=(e,a,t=!0,r="jp")=>{let l=Math.floor(parseInt(a)/50).toString().padStart(5,"0"),o=e.rarity<=2||!t?"normal":"after_training";return`https://bestdori.com/assets/${r}/thumb/chara/card${l}_rip/${e.resourceSetName}_${o}.png`},w=(e,a)=>(localStorage.setItem("languageNo",a.target.name),i(s({},e),{language:u[parseInt(a.target.name)]})),I=()=>parseInt(localStorage.getItem("languageNo"))||0,j=e=>c("nav",{class:"navbar navbar-expand-lg navbar-light bg-light"},[c("div",{class:"container"},[c("a",{class:"navbar-brand",href:"./"},p("Wasmdori")),c("button",{class:"navbar-toggler collapsed",type:"button","data-bs-toggle":"collapse","data-bs-target":"#navbarNavAltMarkup","aria-controls":"navbarNavAltMarkup","aria-expanded":"false","aria-label":"Toggle navigation"},[c("span",{class:"navbar-toggler-icon"})]),c("div",{id:"navbarNavAltMarkup",class:"collapse navbar-collapse"},[c("div",{class:"navbar-nav"},[c("a",{class:"nav-link",href:"./card_recognize.html"},p(e.language.cardRecognize)),c("a",{class:"nav-link",href:"./team_builder.html"},p(e.language.teamBuilder)),c("a",{class:"nav-link",href:"./profile.html"},p(e.language.profile)),c("a",{class:"nav-link",href:"./gacha.html"},p(e.language.eventGacha)),c("div",{class:"nav-item dropdown"},[c("a",{href:"#",class:"nav-link dropdown-toggle",role:"button","data-bs-toggle":"dropdown","aria-expanded":"false"},p(e.language.selectLanguage)),c("ul",{class:"dropdown-menu"},[c("li",{},[c("button",{class:"dropdown-item",name:"1",onclick:w},p("English"))]),c("li",{},[c("button",{class:"dropdown-item",name:"3",onclick:w},p("简体中文"))])])])])])])]),x=(e,a)=>i(s({},e),{server:parseInt(a.target.value)}),k=(e,{action:a})=>{const t=localStorage.getItem("profiles");let r=[];null!==t&&0!==t.length&&(r=JSON.parse(t)),e(a,r)},B=(e,a)=>i(s({},e),{profiles:a}),N=(e,a)=>{let t=localStorage.getItem("primaryProfile"),r=0;null!==t&&(r=parseInt(t));let l=a[r];return a.length<=r&&(l=null),i(s({},e),{profiles:a,selectedProfile:l})},T=()=>[k,{action:N}],C=()=>[k,{action:B}],O=e=>{let a=new Set;for(let r=0;r<e.length;r+=5)a.add(e.slice(r,r+5));let t="";for(const r of a)t+=r;return t},z=(e,a)=>`https://bestdori.com/assets/${e}/homebanner_rip/${a}.png`,A=(e,a=x)=>c("div",{class:"row p-1"},[c("div",{class:"col"},[c("label",{for:"server"},p(e.language.selectServer)),c("select",{name:"server",id:"server",class:"form-select",onchange:a},[c("option",{value:"0"},p("日本")),c("option",{value:"1"},p("International")),c("option",{value:"2"},p("繁体中文")),c("option",{value:"3"},p("简体中文"))])])]);export{b as G,O as R,v as a,A as b,y as c,S as d,m as e,z as f,I as g,h as j,j as n,C as p,T as s,u as t};
//# sourceMappingURL=utils.b80295f2.js.map