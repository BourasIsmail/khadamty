(()=>{var e={};e.id=626,e.ids=[626],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3575:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>o.a,__next_app__:()=>m,originalPathname:()=>u,pages:()=>c,routeModule:()=>p,tree:()=>d}),s(4687),s(1506),s(5866);var r=s(3191),a=s(8716),i=s(7922),o=s.n(i),n=s(5231),l={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);s.d(t,l);let d=["",{children:["login",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,4687)),"C:\\Users\\hp\\Desktop\\frontend-modified-source\\app\\login\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,1506)),"C:\\Users\\hp\\Desktop\\frontend-modified-source\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,5866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\hp\\Desktop\\frontend-modified-source\\app\\login\\page.tsx"],u="/login/page",m={require:s,loadChunk:()=>Promise.resolve()},p=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/login/page",pathname:"/login",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},7627:(e,t,s)=>{Promise.resolve().then(s.bind(s,4050))},4050:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>h});var r=s(326),a=s(7577),i=s(5047),o=s(6205),n=s(6824),l=s(381),d=s(9258),c=s(6229),u=s(2809),m=s(8258);let p=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"}))}),x="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 outline-none transition-all bg-gray-50 focus:bg-white text-sm";function h(){let e=(0,i.useRouter)(),{login:t}=(0,o.t)(),[s,h]=(0,a.useState)("login"),[f,g]=(0,a.useState)(""),[b,y]=(0,a.useState)(""),[v,w]=(0,a.useState)(!1),[j,N]=(0,a.useState)(!1),[k,E]=(0,a.useState)(""),[C,P]=(0,a.useState)(["","","","","",""]),[A,D]=(0,a.useState)(!1),[L,_]=(0,a.useState)(60),[M,O]=(0,a.useState)(!1),R=(0,a.useRef)([]),$=async s=>{s.preventDefault(),N(!0);try{let s=await n.h.login({email:f,password:b});s.requireOtp?(E(s.email),h("otp"),l.ZP.success("Code de v\xe9rification envoy\xe9 sur votre email !")):s.token&&(t({id:s.id,email:s.email,firstName:s.firstName,lastName:s.lastName,role:s.role,passwordChangeRequired:s.passwordChangeRequired},s.token),l.ZP.success(`Bienvenue ${s.firstName} !`),e.push(s.passwordChangeRequired?"/dashboard/profile#change-password":"/dashboard"))}catch(e){l.ZP.error(e.message||"Email ou mot de passe incorrect")}finally{N(!1)}},Z=(e,t)=>{if(!/^\d*$/.test(t))return;let s=[...C];s[e]=t.slice(-1),P(s),t&&e<5&&R.current[e+1]?.focus(),s.every(e=>e)&&6===s.join("").length&&q(s.join(""))},q=async s=>{let r=s||C.join("");if(6!==r.length){l.ZP.error("Entrez les 6 chiffres");return}D(!0);try{let s=await n.h.verifyOtp({email:k,code:r});t({id:s.id,email:s.email,firstName:s.firstName,lastName:s.lastName,role:s.role,passwordChangeRequired:s.passwordChangeRequired},s.token),l.ZP.success(`Bienvenue ${s.firstName} !`),e.push(s.passwordChangeRequired?"/dashboard/profile#change-password":"/dashboard")}catch(e){l.ZP.error(e.message||"Code incorrect ou expir\xe9"),P(["","","","","",""]),R.current[0]?.focus()}finally{D(!1)}},S=async()=>{try{await n.h.resendOtp(k),l.ZP.success("Nouveau code envoy\xe9 !"),P(["","","","","",""]),_(60),O(!1)}catch(e){l.ZP.error(e.message||"Erreur")}};return(0,r.jsxs)("div",{className:"min-h-screen flex",children:[r.jsx(l.x7,{position:"top-center"}),(0,r.jsxs)("div",{className:"hidden lg:flex lg:w-5/12 gradient-brand flex-col justify-between p-12 relative overflow-hidden",children:[r.jsx("div",{className:"absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full"}),r.jsx("div",{className:"absolute -bottom-32 -right-16 w-80 h-80 bg-white/5 rounded-full"}),(0,r.jsxs)("div",{className:"relative z-10",children:[(0,r.jsxs)("div",{className:"flex items-center gap-4 mb-12",children:[r.jsx("div",{className:"w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl",children:r.jsx("span",{className:"text-2xl font-black text-primary-600",children:"K"})}),(0,r.jsxs)("div",{children:[r.jsx("h1",{className:"text-3xl font-black text-white",children:"Khadamati"}),r.jsx("p",{className:"text-white/60 text-sm",children:"خدماتي \xb7 Portail RH"})]})]}),(0,r.jsxs)("h2",{className:"text-4xl font-bold text-white leading-tight mb-4",children:["Bienvenue sur",r.jsx("br",{}),"votre espace RH"]}),r.jsx("p",{className:"text-white/70 text-lg leading-relaxed max-w-sm",children:"Plateforme s\xe9curis\xe9e de gestion des ressources humaines de l'Entraide Nationale."})]}),(0,r.jsxs)("div",{className:"relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15",children:[r.jsx("p",{className:"text-white font-semibold text-sm mb-3",children:"Acc\xe8s \xe0 la plateforme"}),(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsxs)("div",{className:"flex items-center gap-3",children:[r.jsx("div",{className:"w-2 h-2 rounded-full bg-danger-500"}),r.jsx("span",{className:"text-white/70 text-sm",children:"Administrateur"})]}),(0,r.jsxs)("div",{className:"flex items-center gap-3",children:[r.jsx("div",{className:"w-2 h-2 rounded-full bg-primary-600"}),r.jsx("span",{className:"text-white/70 text-sm",children:"Ressources Humaines"})]}),(0,r.jsxs)("div",{className:"flex items-center gap-3",children:[r.jsx("div",{className:"w-2 h-2 rounded-full bg-primary-500"}),r.jsx("span",{className:"text-white/70 text-sm",children:"Employ\xe9"})]})]}),r.jsx("p",{className:"text-white/50 text-xs mt-3",children:"Votre r\xf4le est d\xe9tect\xe9 automatiquement lors de la connexion."})]}),r.jsx("div",{className:"relative z-10",children:(0,r.jsxs)("div",{className:"flex items-center gap-3",children:[r.jsx("div",{className:"w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center",children:r.jsx("span",{className:"text-white text-xs font-bold",children:"EN"})}),r.jsx("p",{className:"text-white/50 text-sm",children:"Entraide Nationale \xb7 Royaume du Maroc"})]})})]}),r.jsx("div",{className:"flex-1 flex flex-col justify-center px-6 py-12 lg:px-14 bg-white overflow-y-auto",children:(0,r.jsxs)("div",{className:"max-w-md w-full mx-auto",children:[(0,r.jsxs)("div",{className:"lg:hidden flex items-center gap-3 mb-10",children:[r.jsx("div",{className:"w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center",children:r.jsx("span",{className:"text-white font-black text-lg",children:"K"})}),(0,r.jsxs)("div",{children:[r.jsx("p",{className:"font-black text-gray-900 text-xl",children:"Khadamati"}),r.jsx("p",{className:"text-gray-400 text-xs",children:"خدماتي"})]})]}),"login"===s&&(0,r.jsxs)("div",{className:"animate-fade-in",children:[(0,r.jsxs)("div",{className:"mb-8",children:[r.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Connexion"}),r.jsx("p",{className:"text-gray-400 text-sm",children:"Connectez-vous \xe0 votre espace Khadamati"})]}),(0,r.jsxs)("form",{onSubmit:$,className:"space-y-4",children:[(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block text-sm font-semibold text-gray-700 mb-2",children:"Adresse email"}),r.jsx("input",{type:"email",required:!0,value:f,onChange:e=>g(e.target.value),className:x,placeholder:"votre@email.com"})]}),(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block text-sm font-semibold text-gray-700 mb-2",children:"Mot de passe"}),(0,r.jsxs)("div",{className:"relative",children:[r.jsx("input",{type:v?"text":"password",required:!0,value:b,onChange:e=>y(e.target.value),className:x+" pr-11",placeholder:"••••••••"}),r.jsx("button",{type:"button",onClick:()=>w(!v),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",children:v?r.jsx(d.Z,{className:"w-5 h-5"}):r.jsx(c.Z,{className:"w-5 h-5"})})]})]}),r.jsx("button",{type:"submit",disabled:j,className:"w-full py-3.5 bg-brand-green hover:bg-primary-700 text-white font-bold rounded-xl shadow-green transition-all flex items-center justify-center gap-2 disabled:opacity-60",children:j?(0,r.jsxs)(r.Fragment,{children:[r.jsx("div",{className:"w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"}),"Connexion..."]}):(0,r.jsxs)(r.Fragment,{children:[r.jsx("span",{children:"Se connecter"}),r.jsx(u.Z,{className:"w-5 h-5"})]})})]}),(0,r.jsxs)("p",{className:"text-center text-xs text-gray-300 mt-8",children:["\xa9 ",new Date().getFullYear()," Khadamati \xb7 Entraide Nationale \xb7 Maroc"]})]}),"otp"===s&&(0,r.jsxs)("div",{className:"animate-fade-in",children:[r.jsx("div",{className:"w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5",children:r.jsx(m.Z,{className:"w-7 h-7 text-primary-600"})}),r.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-1",children:"V\xe9rification"}),(0,r.jsxs)("p",{className:"text-gray-400 text-sm mb-8",children:["Code envoy\xe9 \xe0 ",r.jsx("span",{className:"font-semibold text-gray-700",children:k})]}),(0,r.jsxs)("div",{className:"mb-6",children:[r.jsx("label",{className:"block text-sm font-semibold text-gray-700 mb-4",children:"Code \xe0 6 chiffres"}),r.jsx("div",{className:"flex gap-2 justify-between",children:C.map((e,t)=>r.jsx("input",{ref:e=>{R.current[t]=e},type:"text",inputMode:"numeric",maxLength:1,value:e,onChange:e=>Z(t,e.target.value),onKeyDown:e=>{"Backspace"===e.key&&!C[t]&&t>0&&R.current[t-1]?.focus()},className:`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                        ${e?"border-primary-600 bg-primary-50 text-primary-700":"border-gray-200 bg-gray-50"}
                        focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10`},t))})]}),r.jsx("button",{onClick:()=>q(),disabled:A||C.some(e=>!e),className:"w-full py-3.5 bg-brand-green hover:bg-primary-700 text-white font-bold rounded-xl shadow-green transition flex items-center justify-center gap-2 disabled:opacity-60",children:A?(0,r.jsxs)(r.Fragment,{children:[r.jsx("div",{className:"w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"}),"V\xe9rification..."]}):(0,r.jsxs)(r.Fragment,{children:[r.jsx("span",{children:"Confirmer"}),r.jsx(u.Z,{className:"w-5 h-5"})]})}),r.jsx("div",{className:"text-center mt-5",children:M?(0,r.jsxs)("button",{onClick:S,className:"flex items-center gap-2 mx-auto text-sm font-semibold text-primary-600 hover:text-primary-700",children:[r.jsx(p,{className:"w-4 h-4"})," Renvoyer le code"]}):(0,r.jsxs)("p",{className:"text-sm text-gray-400",children:["Renvoyer dans ",(0,r.jsxs)("span",{className:"font-semibold text-gray-600",children:[L,"s"]})]})}),r.jsx("div",{className:"bg-amber-50 border border-amber-200 rounded-xl p-3 mt-5",children:r.jsx("p",{className:"text-xs text-amber-700",children:"\uD83D\uDCA1 Le code s'affiche aussi dans les logs du backend si l'email n'est pas configur\xe9."})})]})]})})]})}},6205:(e,t,s)=>{"use strict";s.d(t,{t:()=>i});var r=s(551),a=s(5251);let i=(0,r.Ue)()((0,a.tJ)((e,t)=>({user:null,token:null,isAuthenticated:!1,login:(t,s)=>{e({user:t,token:s,isAuthenticated:!0})},logout:()=>{e({user:null,token:null,isAuthenticated:!1})},updateUser:s=>{let r=t().user;r&&e({user:{...r,...s}})}}),{name:"auth-storage",partialize:e=>({user:e.user,token:e.token,isAuthenticated:e.isAuthenticated})}));(0,r.Ue)((e,t)=>({employees:[],currentEmployee:null,loading:!1,error:null,totalPages:0,currentPage:1,total:0,setEmployees:t=>e({employees:t}),setCurrentEmployee:t=>e({currentEmployee:t}),setLoading:t=>e({loading:t}),setError:t=>e({error:t}),setPagination:(t,s,r)=>e({totalPages:t,currentPage:s,total:r}),addEmployee:s=>{let{employees:r}=t();e({employees:[s,...r]})},updateEmployee:(s,r)=>{let{employees:a}=t();e({employees:a.map(e=>e._id===s?{...e,...r}:e)})},removeEmployee:s=>{let{employees:r}=t();e({employees:r.filter(e=>e._id!==s)})}}))},4687:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});let r=(0,s(8570).createProxy)(String.raw`C:\Users\hp\Desktop\frontend-modified-source\app\login\page.tsx#default`)},2809:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});var r=s(7577);let a=r.forwardRef(function({title:e,titleId:t,...s},a){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:a,"aria-labelledby":t},s),e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"}))})},8258:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});var r=s(7577);let a=r.forwardRef(function({title:e,titleId:t,...s},a){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:a,"aria-labelledby":t},s),e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"}))})},6229:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});var r=s(7577);let a=r.forwardRef(function({title:e,titleId:t,...s},a){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:a,"aria-labelledby":t},s),e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"}),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"}))})},9258:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});var r=s(7577);let a=r.forwardRef(function({title:e,titleId:t,...s},a){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:a,"aria-labelledby":t},s),e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"}))})},381:(e,t,s)=>{"use strict";s.d(t,{x7:()=>ec,ZP:()=>eu});var r,a=s(7577);let i={data:""},o=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,c=(e,t)=>{let s="",r="",a="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+o+";":r+="f"==i[1]?c(o,i):i+"{"+c(o,"k"==i[1]?"":t)+"}":"object"==typeof o?r+=c(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=c.p?c.p(i,o):i+":"+o+";")}return s+(t&&a?t+"{"+a+"}":a)+r},u={},m=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+m(e[s]);return t}return e},p=(e,t,s,r,a)=>{let i=m(e),o=u[i]||(u[i]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(i));if(!u[o]){let t=i!==e?e:(e=>{let t,s,r=[{}];for(;t=n.exec(e.replace(l,""));)t[4]?r.shift():t[3]?(s=t[3].replace(d," ").trim(),r.unshift(r[0][s]=r[0][s]||{})):r[0][t[1]]=t[2].replace(d," ").trim();return r[0]})(e);u[o]=c(a?{["@keyframes "+o]:t}:t,s?"":"."+o)}let p=s&&u.g;return s&&(u.g=u[o]),((e,t,s,r)=>{r?t.data=t.data.replace(r,e):-1===t.data.indexOf(e)&&(t.data=s?e+t.data:t.data+e)})(u[o],t,r,p),o},x=(e,t,s)=>e.reduce((e,r,a)=>{let i=t[a];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"");function h(e){let t=this||{},s=e.call?e(t.p):e;return p(s.unshift?s.raw?x(s,[].slice.call(arguments,1),t.p):s.reduce((e,s)=>Object.assign(e,s&&s.call?s(t.p):s),{}):s,o(t.target),t.g,t.o,t.k)}h.bind({g:1});let f,g,b,y=h.bind({k:1});function v(e,t){let s=this||{};return function(){let r=arguments;function a(i,o){let n=Object.assign({},i),l=n.className||a.className;s.p=Object.assign({theme:g&&g()},n),s.o=/go\d/.test(l),n.className=h.apply(s,r)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),b&&d[0]&&b(n),f(d,n)}return t?t(a):a}}var w=e=>"function"==typeof e,j=(e,t)=>w(e)?e(t):e,N=(()=>{let e=0;return()=>(++e).toString()})(),k=(()=>{let e;return()=>e})(),E="default",C=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return C(e,{type:e.toasts.find(e=>e.id===r.id)?1:0,toast:r});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},P=[],A={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},D={},L=(e,t=E)=>{D[t]=C(D[t]||A,e),P.forEach(([e,s])=>{e===t&&s(D[t])})},_=e=>Object.keys(D).forEach(t=>L(e,t)),M=e=>Object.keys(D).find(t=>D[t].toasts.some(t=>t.id===e)),O=(e=E)=>t=>{L(t,e)},R={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},$=(e={},t=E)=>{let[s,r]=(0,a.useState)(D[t]||A),i=(0,a.useRef)(D[t]);(0,a.useEffect)(()=>(i.current!==D[t]&&r(D[t]),P.push([t,r]),()=>{let e=P.findIndex(([e])=>e===t);e>-1&&P.splice(e,1)}),[t]);let o=s.toasts.map(t=>{var s,r,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||R[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}});return{...s,toasts:o}},Z=(e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||N()}),q=e=>(t,s)=>{let r=Z(t,e,s);return O(r.toasterId||M(r.id))({type:2,toast:r}),r.id},S=(e,t)=>q("blank")(e,t);S.error=q("error"),S.success=q("success"),S.loading=q("loading"),S.custom=q("custom"),S.dismiss=(e,t)=>{let s={type:3,toastId:e};t?O(t)(s):_(s)},S.dismissAll=e=>S.dismiss(void 0,e),S.remove=(e,t)=>{let s={type:4,toastId:e};t?O(t)(s):_(s)},S.removeAll=e=>S.remove(void 0,e),S.promise=(e,t,s)=>{let r=S.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?j(t.success,e):void 0;return a?S.success(a,{id:r,...s,...null==s?void 0:s.success}):S.dismiss(r),e}).catch(e=>{let a=t.error?j(t.error,e):void 0;a?S.error(a,{id:r,...s,...null==s?void 0:s.error}):S.dismiss(r)}),e};var z=1e3,I=(e,t="default")=>{let{toasts:s,pausedAt:r}=$(e,t),i=(0,a.useRef)(new Map).current,o=(0,a.useCallback)((e,t=z)=>{if(i.has(e))return;let s=setTimeout(()=>{i.delete(e),n({type:4,toastId:e})},t);i.set(e,s)},[]);(0,a.useEffect)(()=>{if(r)return;let e=Date.now(),a=s.map(s=>{if(s.duration===1/0)return;let r=(s.duration||0)+s.pauseDuration-(e-s.createdAt);if(r<0){s.visible&&S.dismiss(s.id);return}return setTimeout(()=>S.dismiss(s.id,t),r)});return()=>{a.forEach(e=>e&&clearTimeout(e))}},[s,r,t]);let n=(0,a.useCallback)(O(t),[t]),l=(0,a.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,a.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,a.useCallback)(()=>{r&&n({type:6,time:Date.now()})},[r,n]),u=(0,a.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:a=8,defaultPosition:i}=t||{},o=s.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+a,0)},[s]);return(0,a.useEffect)(()=>{s.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[s,o]),{toasts:s,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}},B=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,F=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,H=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,U=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${B} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${H} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,K=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,T=v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${K} 1s linear infinite;
`,V=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,W=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,G=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${V} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${W} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Y=v("div")`
  position: absolute;
`,J=v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,X=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Q=v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${X} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ee=({toast:e})=>{let{icon:t,type:s,iconTheme:r}=e;return void 0!==t?"string"==typeof t?a.createElement(Q,null,t):t:"blank"===s?null:a.createElement(J,null,a.createElement(T,{...r}),"loading"!==s&&a.createElement(Y,null,"error"===s?a.createElement(U,{...r}):a.createElement(G,{...r})))},et=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,es=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,er=v("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ea=v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ei=(e,t)=>{let s=e.includes("top")?1:-1,[r,a]=k()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[et(s),es(s)];return{animation:t?`${y(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},eo=a.memo(({toast:e,position:t,style:s,children:r})=>{let i=e.height?ei(e.position||t||"top-center",e.visible):{opacity:0},o=a.createElement(ee,{toast:e}),n=a.createElement(ea,{...e.ariaProps},j(e.message,e));return a.createElement(er,{className:e.className,style:{...i,...s,...e.style}},"function"==typeof r?r({icon:o,message:n}):a.createElement(a.Fragment,null,o,n))});r=a.createElement,c.p=void 0,f=r,g=void 0,b=void 0;var en=({id:e,className:t,style:s,onHeightUpdate:r,children:i})=>{let o=a.useCallback(t=>{if(t){let s=()=>{r(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return a.createElement("div",{ref:o,className:t,style:s},i)},el=(e,t)=>{let s=e.includes("top"),r=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:k()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...r}},ed=h`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ec=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:r,children:i,toasterId:o,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=I(s,o);return a.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(s=>{let o=s.position||t,n=el(o,c.calculateOffset(s,{reverseOrder:e,gutter:r,defaultPosition:t}));return a.createElement(en,{id:s.id,key:s.id,onHeightUpdate:c.updateHeight,className:s.visible?ed:"",style:n},"custom"===s.type?j(s.message,s):i?i(s):a.createElement(eo,{toast:s,position:o}))}))},eu=S}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[480,696,445],()=>s(3575));module.exports=r})();