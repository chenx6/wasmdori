var e=Object.defineProperty,r=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,t=Object.prototype.propertyIsEnumerable,o=(r,n,t)=>n in r?e(r,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[n]=t,l=(e,l)=>{for(var i in l||(l={}))n.call(l,i)&&o(e,i,l[i]);if(r)for(var i of r(l))t.call(l,i)&&o(e,i,l[i]);return e},i={},a=[],s=e=>e,u=a.map,f=Array.isArray,d="undefined"!=typeof requestAnimationFrame?requestAnimationFrame:setTimeout,p=e=>{var r="";if("string"==typeof e)return e;if(f(e))for(var n,t=0;t<e.length;t++)(n=p(e[t]))&&(r+=(r&&" ")+n);else for(var t in e)e[t]&&(r+=(r&&" ")+t);return r},v=(e,r)=>{for(var n in l(l({},e),r))if("function"==typeof(f(e[n])?e[n][0]:e[n]))r[n]=e[n];else if(e[n]!==r[n])return!0},m=e=>null==e?e:e.key,c=(e,r,n,t,o,i)=>{if("key"===r);else if("style"===r)for(var a in l(l({},n),t))n=null==t||null==t[a]?"":t[a],"-"===a[0]?e[r].setProperty(a,n):e[r][a]=n;else"o"===r[0]&&"n"===r[1]?((e.events||(e.events={}))[r=r.slice(2)]=t)?n||e.addEventListener(r,o):e.removeEventListener(r,o):!i&&"list"!==r&&"form"!==r&&r in e?e[r]=null==t?"":t:null==t||!1===t||"class"===r&&!(t=p(t))?e.removeAttribute(r):e.setAttribute(r,t)},y=(e,r,n)=>{var t=e.props,o=3===e.type?document.createTextNode(e.tag):(n=n||"svg"===e.tag)?document.createElementNS("http://www.w3.org/2000/svg",e.tag,{is:t.is}):document.createElement(e.tag,{is:t.is});for(var l in t)c(o,l,null,t[l],r,n);for(var i=0;i<e.children.length;i++)o.appendChild(y(e.children[i]=h(e.children[i]),r,n));return e.node=o},g=(e,r,n,t,o,i)=>{if(n===t);else if(null!=n&&3===n.type&&3===t.type)n.tag!==t.tag&&(r.nodeValue=t.tag);else if(null==n||n.tag!==t.tag)r=e.insertBefore(y(t=h(t),o,i),r),null!=n&&e.removeChild(n.node);else{var a,s,u,f,d=n.props,p=t.props,v=n.children,b=t.children,w=0,C=0,k=v.length-1,A=b.length-1;for(var O in i=i||"svg"===t.tag,l(l({},d),p))("value"===O||"selected"===O||"checked"===O?r[O]:d[O])!==p[O]&&c(r,O,d[O],p[O],o,i);for(;C<=A&&w<=k&&null!=(u=m(v[w]))&&u===m(b[C]);)g(r,v[w].node,v[w],b[C]=h(b[C++],v[w++]),o,i);for(;C<=A&&w<=k&&null!=(u=m(v[k]))&&u===m(b[A]);)g(r,v[k].node,v[k],b[A]=h(b[A--],v[k--]),o,i);if(w>k)for(;C<=A;)r.insertBefore(y(b[C]=h(b[C++]),o,i),(s=v[w])&&s.node);else if(C>A)for(;w<=k;)r.removeChild(v[w++].node);else{var E={},N={};for(O=w;O<=k;O++)null!=(u=v[O].key)&&(E[u]=v[O]);for(;C<=A;)u=m(s=v[w]),f=m(b[C]=h(b[C],s)),N[u]||null!=f&&f===m(v[w+1])?(null==u&&r.removeChild(s.node),w++):null==f||1===n.type?(null==u&&(g(r,s&&s.node,s,b[C],o,i),C++),w++):(u===f?(g(r,s.node,s,b[C],o,i),N[f]=!0,w++):null!=(a=E[f])?(g(r,r.insertBefore(a.node,s&&s.node),a,b[C],o,i),N[f]=!0):g(r,s&&s.node,null,b[C],o,i),C++);for(;w<=k;)null==m(s=v[w++])&&r.removeChild(s.node);for(var O in E)null==N[O]&&r.removeChild(E[O].node)}}return t.node=r},h=(e,r)=>!0!==e&&!1!==e&&e?"function"==typeof e.tag?((!r||null==r.memo||((e,r)=>{for(var n in e)if(e[n]!==r[n])return!0;for(var n in r)if(e[n]!==r[n])return!0})(r.memo,e.memo))&&((r=e.tag(e.memo)).memo=e.memo),r):e:C(""),b=e=>3===e.nodeType?C(e.nodeValue,e):w(e.nodeName.toLowerCase(),i,u.call(e.childNodes,b),1,e),w=(e,r,n,t,o)=>({tag:e,props:r,key:r.key,children:n,type:t,node:o}),C=(e,r)=>w(e,i,a,3,r),k=(e,r,n=a)=>w(e,r,f(n)?n:[n]),A=({node:e,view:r,subscriptions:n,dispatch:t=s,init:o=i})=>{var l,u,p=e&&b(e),m=[],c=e=>{l!==e&&(null==(l=e)&&(t=n=y=s),n&&(m=((e,r=a,n)=>{for(var t,o,l=[],i=0;i<e.length||i<r.length;i++)t=e[i],o=r[i],l.push(o&&!0!==o?!t||o[0]!==t[0]||v(o[1],t[1])?[o[0],o[1],(t&&t[2](),o[0](n,o[1]))]:t:t&&t[2]());return l})(m,n(l),t)),r&&!u&&d(y,u=!0))},y=()=>e=g(e.parentNode,e,p,p=r(l),h,u=!1),h=function(e){t(this.events[e.type],e)};return(t=t(((e,r)=>"function"==typeof e?t(e(l,r)):f(e)?"function"==typeof e[0]?t(e[0],e[1]):e.slice(1).map((e=>e&&!0!==e&&e[0](t,e[1])),c(e[0])):c(e))))(o),t};export{A as a,k as h,C as t};
//# sourceMappingURL=vendor.d8d0fb72.js.map