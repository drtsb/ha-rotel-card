/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=globalThis,e$2=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$5=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$3.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$5(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$4,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$4(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,i$1=t=>t,s$1=t$2.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$3=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$3:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$2.litHtmlPolyfillSupport;B?.(S,k),(t$2.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$2=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$2(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r$1(r){return n({...r,state:true,attribute:false})}

var t,r;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none";}(t||(t={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24";}(r||(r={}));var ne=function(e,t,r,n){n=n||{},r=null==r?{}:r;var i=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return i.detail=r,e.dispatchEvent(i),i};

var card$9 = {
	power_off: "Power off",
	power_on: "Power on",
	volume_down: "Volume down",
	volume_up: "Volume up",
	mute: "Mute",
	unmute: "Unmute",
	volume_label: "VOLUME",
	settings_title: "SETTINGS",
	source_select: "Select source",
	more_sources: "+{count} more",
	unavailable: "—"
};
var settings$9 = {
	bass: "BASS",
	treble: "TREBLE",
	balance: "BALANCE",
	speakers_a: "SPEAKERS A",
	speakers_b: "SPEAKERS B",
	tone_bypass: "TONE BYPASS",
	dimmer: "DIMMER"
};
var editor$9 = {
	entity: "Entity",
	model: "Model",
	theme: "Theme",
	show_settings: "Show settings panel",
	hide_volume: "Hide volume controls",
	theme_silver: "Silver",
	theme_black: "Black",
	theme_champagne: "Champagne",
	theme_minimal: "Minimal",
	settings_entities: "Settings entities",
	bass_entity: "Bass entity",
	treble_entity: "Treble entity",
	balance_entity: "Balance entity",
	speakers_a_entity: "Speakers A entity",
	speakers_b_entity: "Speakers B entity",
	dimmer_entity: "Dimmer entity",
	tone_bypass_entity: "Tone Bypass entity"
};
var state$9 = {
	on: "On",
	off: "Off",
	standby: "Standby",
	unavailable: "Unavailable"
};
var en = {
	card: card$9,
	settings: settings$9,
	editor: editor$9,
	state: state$9
};

var card$8 = {
	power_off: "Ausschalten",
	power_on: "Einschalten",
	volume_down: "Leiser",
	volume_up: "Lauter",
	mute: "Stummschalten",
	unmute: "Ton einschalten",
	volume_label: "LAUTSTÄRKE",
	settings_title: "EINSTELLUNGEN",
	source_select: "Quelle wählen",
	more_sources: "+{count} weitere",
	unavailable: "—"
};
var settings$8 = {
	bass: "BASS",
	treble: "HÖHEN",
	balance: "BALANCE",
	speakers_a: "LAUTSPRECHER A",
	speakers_b: "LAUTSPRECHER B",
	tone_bypass: "TON BYPASS",
	dimmer: "DIMMER"
};
var editor$8 = {
	entity: "Entität",
	model: "Modell",
	theme: "Design",
	show_settings: "Einstellungsbereich anzeigen",
	hide_volume: "Lautstärkeregelung ausblenden",
	theme_silver: "Silber",
	theme_black: "Schwarz",
	theme_champagne: "Champagner",
	theme_minimal: "Minimal",
	settings_entities: "Einstellungs-Entitäten",
	bass_entity: "Bass-Entität",
	treble_entity: "Höhen-Entität",
	balance_entity: "Balance-Entität",
	speakers_a_entity: "Lautsprecher A Entität",
	speakers_b_entity: "Lautsprecher B Entität",
	dimmer_entity: "Dimmer-Entität",
	tone_bypass_entity: "Tone Bypass Entität"
};
var state$8 = {
	on: "Ein",
	off: "Aus",
	standby: "Standby",
	unavailable: "Nicht verfügbar"
};
var de = {
	card: card$8,
	settings: settings$8,
	editor: editor$8,
	state: state$8
};

var card$7 = {
	power_off: "Éteindre",
	power_on: "Allumer",
	volume_down: "Baisser le volume",
	volume_up: "Augmenter le volume",
	mute: "Muet",
	unmute: "Réactiver le son",
	volume_label: "VOLUME",
	settings_title: "RÉGLAGES",
	source_select: "Sélectionner la source",
	more_sources: "+{count} de plus",
	unavailable: "—"
};
var settings$7 = {
	bass: "BASS",
	treble: "AIGUS",
	balance: "BALANCE",
	speakers_a: "HAUT-PARLEURS A",
	speakers_b: "HAUT-PARLEURS B",
	tone_bypass: "BYPASS TONAL",
	dimmer: "VARIATEUR"
};
var editor$7 = {
	entity: "Entité",
	model: "Modèle",
	theme: "Thème",
	show_settings: "Afficher le panneau de réglages",
	hide_volume: "Masquer les contrôles de volume",
	theme_silver: "Argent",
	theme_black: "Noir",
	theme_champagne: "Champagne",
	theme_minimal: "Minimal",
	settings_entities: "Entités de réglages",
	bass_entity: "Entité Bass",
	treble_entity: "Entité Aigus",
	balance_entity: "Entité Balance",
	speakers_a_entity: "Entité Haut-parleurs A",
	speakers_b_entity: "Entité Haut-parleurs B",
	dimmer_entity: "Entité Variateur",
	tone_bypass_entity: "Entité Bypass Tonal"
};
var state$7 = {
	on: "Allumé",
	off: "Éteint",
	standby: "Veille",
	unavailable: "Indisponible"
};
var fr = {
	card: card$7,
	settings: settings$7,
	editor: editor$7,
	state: state$7
};

var card$6 = {
	power_off: "Apagar",
	power_on: "Encender",
	volume_down: "Bajar volumen",
	volume_up: "Subir volumen",
	mute: "Silenciar",
	unmute: "Activar sonido",
	volume_label: "VOLUMEN",
	settings_title: "AJUSTES",
	source_select: "Seleccionar fuente",
	more_sources: "+{count} más",
	unavailable: "—"
};
var settings$6 = {
	bass: "GRAVES",
	treble: "AGUDOS",
	balance: "BALANCE",
	speakers_a: "ALTAVOCES A",
	speakers_b: "ALTAVOCES B",
	tone_bypass: "BYPASS TONAL",
	dimmer: "DIMMER"
};
var editor$6 = {
	entity: "Entidad",
	model: "Modelo",
	theme: "Tema",
	show_settings: "Mostrar panel de ajustes",
	hide_volume: "Ocultar controles de volumen",
	theme_silver: "Plata",
	theme_black: "Negro",
	theme_champagne: "Champán",
	theme_minimal: "Mínimo",
	settings_entities: "Entidades de ajustes",
	bass_entity: "Entidad Graves",
	treble_entity: "Entidad Agudos",
	balance_entity: "Entidad Balance",
	speakers_a_entity: "Entidad Altavoces A",
	speakers_b_entity: "Entidad Altavoces B",
	dimmer_entity: "Entidad Dimmer",
	tone_bypass_entity: "Entidad Bypass Tonal"
};
var state$6 = {
	on: "Encendido",
	off: "Apagado",
	standby: "En espera",
	unavailable: "No disponible"
};
var es = {
	card: card$6,
	settings: settings$6,
	editor: editor$6,
	state: state$6
};

var card$5 = {
	power_off: "Spegni",
	power_on: "Accendi",
	volume_down: "Abbassa volume",
	volume_up: "Alza volume",
	mute: "Muto",
	unmute: "Riattiva audio",
	volume_label: "VOLUME",
	settings_title: "IMPOSTAZIONI",
	source_select: "Seleziona sorgente",
	more_sources: "+{count} altro",
	unavailable: "—"
};
var settings$5 = {
	bass: "BASSI",
	treble: "ACUTI",
	balance: "BILANCIAMENTO",
	speakers_a: "DIFFUSORI A",
	speakers_b: "DIFFUSORI B",
	tone_bypass: "BYPASS TONALE",
	dimmer: "DIMMER"
};
var editor$5 = {
	entity: "Entità",
	model: "Modello",
	theme: "Tema",
	show_settings: "Mostra pannello impostazioni",
	hide_volume: "Nascondi controlli volume",
	theme_silver: "Argento",
	theme_black: "Nero",
	theme_champagne: "Champagne",
	theme_minimal: "Minimale",
	settings_entities: "Entità impostazioni",
	bass_entity: "Entità Bassi",
	treble_entity: "Entità Acuti",
	balance_entity: "Entità Bilanciamento",
	speakers_a_entity: "Entità Diffusori A",
	speakers_b_entity: "Entità Diffusori B",
	dimmer_entity: "Entità Dimmer",
	tone_bypass_entity: "Entità Bypass Tonale"
};
var state$5 = {
	on: "Acceso",
	off: "Spento",
	standby: "Standby",
	unavailable: "Non disponibile"
};
var it = {
	card: card$5,
	settings: settings$5,
	editor: editor$5,
	state: state$5
};

var card$4 = {
	power_off: "Uitschakelen",
	power_on: "Insakelen",
	volume_down: "Volume verlagen",
	volume_up: "Volume verhogen",
	mute: "Dempen",
	unmute: "Geluid activeren",
	volume_label: "VOLUME",
	settings_title: "INSTELLINGEN",
	source_select: "Bron selecteren",
	more_sources: "+{count} meer",
	unavailable: "—"
};
var settings$4 = {
	bass: "BASS",
	treble: "HOOGTE",
	balance: "BALANS",
	speakers_a: "LUIDSPREKERS A",
	speakers_b: "LUIDSPREKERS B",
	tone_bypass: "TOON BYPASS",
	dimmer: "DIMMER"
};
var editor$4 = {
	entity: "Entiteit",
	model: "Model",
	theme: "Thema",
	show_settings: "Instellingenpaneel tonen",
	hide_volume: "Volumebediening verbergen",
	theme_silver: "Zilver",
	theme_black: "Zwart",
	theme_champagne: "Champagne",
	theme_minimal: "Minimaal",
	settings_entities: "Instelling entiteiten",
	bass_entity: "Bas entiteit",
	treble_entity: "Hoogte entiteit",
	balance_entity: "Balans entiteit",
	speakers_a_entity: "Luidsprekers A entiteit",
	speakers_b_entity: "Luidsprekers B entiteit",
	dimmer_entity: "Dimmer entiteit",
	tone_bypass_entity: "Toon Bypass entiteit"
};
var state$4 = {
	on: "Aan",
	off: "Uit",
	standby: "Standby",
	unavailable: "Niet beschikbaar"
};
var nl = {
	card: card$4,
	settings: settings$4,
	editor: editor$4,
	state: state$4
};

var card$3 = {
	power_off: "Wyłącz",
	power_on: "Włącz",
	volume_down: "Ciszej",
	volume_up: "Głośniej",
	mute: "Wycisz",
	unmute: "Przywróć dźwięk",
	volume_label: "GŁOŚNOŚĆ",
	settings_title: "USTAWIENIA",
	source_select: "Wybierz źródło",
	more_sources: "+{count} więcej",
	unavailable: "—"
};
var settings$3 = {
	bass: "BASY",
	treble: "SOPRANY",
	balance: "BALANS",
	speakers_a: "GŁOŚNIKI A",
	speakers_b: "GŁOŚNIKI B",
	tone_bypass: "POMIJANIE TONU",
	dimmer: "DIMMER"
};
var editor$3 = {
	entity: "Encja",
	model: "Model",
	theme: "Motyw",
	show_settings: "Pokaż panel ustawień",
	hide_volume: "Ukryj sterowanie głośnością",
	theme_silver: "Srebrny",
	theme_black: "Czarny",
	theme_champagne: "Szampański",
	theme_minimal: "Minimalny",
	settings_entities: "Encje ustawień",
	bass_entity: "Encja basów",
	treble_entity: "Encja sopranów",
	balance_entity: "Encja balansu",
	speakers_a_entity: "Encja głośników A",
	speakers_b_entity: "Encja głośników B",
	dimmer_entity: "Encja dimmera",
	tone_bypass_entity: "Encja pomijania tonu"
};
var state$3 = {
	on: "Włączony",
	off: "Wyłączony",
	standby: "Tryb czuwania",
	unavailable: "Niedostępny"
};
var pl = {
	card: card$3,
	settings: settings$3,
	editor: editor$3,
	state: state$3
};

var card$2 = {
	power_off: "Desligar",
	power_on: "Ligar",
	volume_down: "Baixar volume",
	volume_up: "Aumentar volume",
	mute: "Silenciar",
	unmute: "Ativar som",
	volume_label: "VOLUME",
	settings_title: "CONFIGURAÇÕES",
	source_select: "Selecionar fonte",
	more_sources: "+{count} mais",
	unavailable: "—"
};
var settings$2 = {
	bass: "GRAVES",
	treble: "AGUDOS",
	balance: "BALANÇO",
	speakers_a: "ALTO-FALANTES A",
	speakers_b: "ALTO-FALANTES B",
	tone_bypass: "BYPASS TONAL",
	dimmer: "DIMMER"
};
var editor$2 = {
	entity: "Entidade",
	model: "Modelo",
	theme: "Tema",
	show_settings: "Mostrar painel de configurações",
	hide_volume: "Ocultar controles de volume",
	theme_silver: "Prata",
	theme_black: "Preto",
	theme_champagne: "Champanhe",
	theme_minimal: "Mínimo",
	settings_entities: "Entidades de configurações",
	bass_entity: "Entidade Graves",
	treble_entity: "Entidade Agudos",
	balance_entity: "Entidade Balanço",
	speakers_a_entity: "Entidade Alto-falantes A",
	speakers_b_entity: "Entidade Alto-falantes B",
	dimmer_entity: "Entidade Dimmer",
	tone_bypass_entity: "Entidade Bypass Tonal"
};
var state$2 = {
	on: "Ligado",
	off: "Desligado",
	standby: "Espera",
	unavailable: "Indisponível"
};
var pt = {
	card: card$2,
	settings: settings$2,
	editor: editor$2,
	state: state$2
};

var card$1 = {
	power_off: "关闭电源",
	power_on: "开启电源",
	volume_down: "降低音量",
	volume_up: "增加音量",
	mute: "静音",
	unmute: "取消静音",
	volume_label: "音量",
	settings_title: "设置",
	source_select: "选择输入源",
	more_sources: "更多 {count} 个",
	unavailable: "—"
};
var settings$1 = {
	bass: "低音",
	treble: "高音",
	balance: "声道平衡",
	speakers_a: "音箱 A",
	speakers_b: "音箱 B",
	tone_bypass: "音调直通",
	dimmer: "显示调光"
};
var editor$1 = {
	entity: "实体",
	model: "型号",
	theme: "主题",
	show_settings: "显示设置面板",
	hide_volume: "隐藏音量控制",
	theme_silver: "银色",
	theme_black: "黑色",
	theme_champagne: "香槟金",
	theme_minimal: "极简",
	settings_entities: "设置实体",
	bass_entity: "低音实体",
	treble_entity: "高音实体",
	balance_entity: "平衡实体",
	speakers_a_entity: "音箱 A 实体",
	speakers_b_entity: "音箱 B 实体",
	dimmer_entity: "调光实体",
	tone_bypass_entity: "音调直通实体"
};
var state$1 = {
	on: "开启",
	off: "关闭",
	standby: "待机",
	unavailable: "不可用"
};
var zhHans = {
	card: card$1,
	settings: settings$1,
	editor: editor$1,
	state: state$1
};

var card = {
	power_off: "Выключить",
	power_on: "Включить",
	volume_down: "Уменьшить громкость",
	volume_up: "Увеличить громкость",
	mute: "Без звука",
	unmute: "Включить звук",
	volume_label: "ГРОМКОСТЬ",
	settings_title: "НАСТРОЙКИ",
	source_select: "Выбрать источник",
	more_sources: "+{count} ещё",
	unavailable: "—"
};
var settings = {
	bass: "БАСС",
	treble: "ВЫСОКИЕ",
	balance: "БАЛАНС",
	speakers_a: "ДИНАМИКИ A",
	speakers_b: "ДИНАМИКИ B",
	tone_bypass: "ОБХОД ТОНА",
	dimmer: "ДИММЕР"
};
var editor = {
	entity: "Сущность",
	model: "Модель",
	theme: "Тема",
	show_settings: "Показать панель настроек",
	hide_volume: "Скрыть управление громкостью",
	theme_silver: "Серебро",
	theme_black: "Чёрный",
	theme_champagne: "Шампань",
	theme_minimal: "Минимальный",
	settings_entities: "Сущности настроек",
	bass_entity: "Сущность басса",
	treble_entity: "Сущность высоких",
	balance_entity: "Сущность баланса",
	speakers_a_entity: "Сущность динамиков A",
	speakers_b_entity: "Сущность динамиков B",
	dimmer_entity: "Сущность диммера",
	tone_bypass_entity: "Сущность обхода тона"
};
var state = {
	on: "Вкл",
	off: "Выкл",
	standby: "Ожидание",
	unavailable: "Недоступно"
};
var ru = {
	card: card,
	settings: settings,
	editor: editor,
	state: state
};

const languages = {
    en,
    de,
    fr,
    es,
    it,
    nl,
    pl,
    pt,
    "zh-Hans": zhHans,
    ru,
};
const FALLBACK_LANG = "en";
function normalizeLanguageCode(lang) {
    if (!lang)
        return FALLBACK_LANG;
    const exactMatch = lang;
    if (exactMatch in languages)
        return exactMatch;
    const lowerLang = lang.toLowerCase();
    const lowerExactMatch = lowerLang;
    if (lowerExactMatch in languages)
        return lowerExactMatch;
    const baseLang = lowerLang.split("-")[0];
    if (baseLang === "zh") {
        return "zh-Hans";
    }
    if (baseLang in languages)
        return baseLang;
    return FALLBACK_LANG;
}
function getLanguage(hass) {
    const lang = hass.locale?.language ?? hass.language ?? "en";
    return normalizeLanguageCode(lang);
}
function localize(hass, namespace, key, params) {
    const lang = getLanguage(hass);
    const dict = languages[lang] ?? languages[FALLBACK_LANG];
    const ns = dict[namespace];
    if (!ns)
        return key;
    let translation = ns[key];
    if (!translation) {
        const fallbackNs = languages[FALLBACK_LANG][namespace];
        translation = fallbackNs?.[key] ?? key;
    }
    if (params) {
        translation = translation.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
    }
    return translation;
}

let RotelCardEditor = class RotelCardEditor extends i {
    setConfig(config) {
        this._config = config;
    }
    valueChanged(ev) {
        if (!this._config)
            return;
        const value = ev.detail?.value;
        if (!value)
            return;
        const newConfig = { ...this._config, ...value };
        ne(this, "config-changed", { config: newConfig });
    }
    render() {
        if (!this._config || !this.hass)
            return b ``;
        const showSettings = this._config.show_settings === true;
        const t = (ns, key) => localize(this.hass, ns, key);
        const schema = [
            { name: "entity", label: t("editor", "entity"), selector: { entity: { domain: "media_player" } } },
            { name: "model", label: t("editor", "model"), selector: { text: {} } },
            {
                name: "theme",
                label: t("editor", "theme"),
                selector: {
                    select: {
                        options: ["silver", "black", "champagne", "minimal"],
                        mode: "dropdown",
                        translation_key: "theme",
                    },
                },
            },
            { name: "show_settings", label: t("editor", "show_settings"), selector: { boolean: {} } },
            { name: "hide_volume", label: t("editor", "hide_volume"), selector: { boolean: {} } },
        ];
        if (showSettings) {
            schema.push({ name: "settings_entities.bass", label: t("editor", "bass_entity"), selector: { entity: { domain: "number" } } }, { name: "settings_entities.treble", label: t("editor", "treble_entity"), selector: { entity: { domain: "number" } } }, { name: "settings_entities.balance", label: t("editor", "balance_entity"), selector: { entity: { domain: "number" } } }, { name: "settings_entities.speakers_a", label: t("editor", "speakers_a_entity"), selector: { entity: { domain: "switch" } } }, { name: "settings_entities.speakers_b", label: t("editor", "speakers_b_entity"), selector: { entity: { domain: "switch" } } }, { name: "settings_entities.dimmer", label: t("editor", "dimmer_entity"), selector: { entity: { domain: "select" } } }, { name: "settings_entities.tone_bypass", label: t("editor", "tone_bypass_entity"), selector: { entity: { domain: "switch" } } });
        }
        return b `
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
    }
    static get styles() {
        return i$3 `
      ha-form {
        display: block;
        padding: 16px;
      }
    `;
    }
};
__decorate([
    n({ attribute: false })
], RotelCardEditor.prototype, "hass", void 0);
__decorate([
    r$1()
], RotelCardEditor.prototype, "_config", void 0);
RotelCardEditor = __decorate([
    t$1("rotel-card-editor")
], RotelCardEditor);
window.customCardEditors = window.customCardEditors || {};
window.customCardEditors["rotel-amplifier-card"] = "rotel-card-editor";

const FIXED_VOLUME_ATTRIBUTES = [
    "fixed_volume",
    "fixedVolume",
    "pass_through",
    "passThrough",
    "is_fixed_volume",
];
function isFixedVolumeActive(attrs) {
    for (const key of FIXED_VOLUME_ATTRIBUTES) {
        const value = attrs[key];
        if (typeof value === "string")
            return value !== "off" && value !== "false" && value !== "0";
        if (typeof value === "boolean")
            return value;
        if (typeof value === "number")
            return value !== 0;
    }
    return false;
}
let RotelAmplifierCard = class RotelAmplifierCard extends i {
    constructor() {
        super(...arguments);
        /** Debounce timer for source selection to avoid spamming HA */
        this._sourceSelectTimer = null;
        /** Debounce timers for settings sliders */
        this._settingsDebounceTimers = new Map();
    }
    /** Apply theme preset as data-theme attribute on host */
    _applyThemePreset() {
        const theme = this._config?.theme ?? "silver";
        this.setAttribute("data-theme", theme);
    }
    setConfig(config) {
        if (!config.entity)
            throw new Error("entity is required");
        this._config = config;
        // Apply theme immediately on config change (before first render)
        this._applyThemePreset();
    }
    getCardSize() {
        // Base size + settings panel (approx 2 rows) if enabled and entities configured
        const baseSize = 4;
        if (this._config?.show_settings && this._config?.settings_entities) {
            const entityCount = Object.values(this._config.settings_entities).filter(Boolean).length;
            if (entityCount > 0)
                return baseSize + Math.ceil(entityCount / 3) + 1;
        }
        return baseSize;
    }
    static getConfigElement() {
        return document.createElement("rotel-card-editor");
    }
    /**
     * Maps config.custom_theme_vars to inline CSS custom properties on the
     * root <ha-card> element so users can theme the card via YAML without
     * touching the source code.
     */
    applyThemeVariables() {
        const card = this.shadowRoot?.querySelector("ha-card");
        if (!card)
            return;
        const variables = this._config?.custom_theme_vars;
        if (!variables || typeof variables !== "object")
            return;
        for (const [name, value] of Object.entries(variables)) {
            card.style.setProperty(name, String(value));
        }
    }
    static getStubConfig() {
        return { entity: "media_player.rotel", show_name: true, show_volume: true, show_inputs: true };
    }
    shouldUpdate(changed) {
        return !!this._config && (changed.has("hass") || changed.has("_config"));
    }
    updated(changed) {
        super.updated(changed);
        if (changed.has("_config")) {
            this._applyThemePreset();
            this.applyThemeVariables();
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._sourceSelectTimer) {
            clearTimeout(this._sourceSelectTimer);
            this._sourceSelectTimer = null;
        }
        for (const timer of this._settingsDebounceTimers.values()) {
            clearTimeout(timer);
        }
        this._settingsDebounceTimers.clear();
    }
    get _entity() {
        return this.hass?.states?.[this._config.entity];
    }
    get _fixedVolume() {
        return isFixedVolumeActive(this._entity?.attributes ?? {});
    }
    _call(service, data = {}) {
        this.hass.callService("media_player", service, { entity_id: this._config.entity, ...data });
    }
    _togglePower() { this._call("toggle"); }
    _volumeUp() { this._call("volume_up"); }
    _volumeDown() { this._call("volume_down"); }
    _mute() {
        const muted = this._entity?.attributes?.is_volume_muted;
        this._call("volume_mute", { is_volume_muted: !muted });
    }
    _selectSource(source) {
        // Debounce: ignore rapid clicks within 300ms
        if (this._sourceSelectTimer) {
            clearTimeout(this._sourceSelectTimer);
        }
        this._sourceSelectTimer = setTimeout(() => {
            this._call("select_source", { source });
            this._sourceSelectTimer = null;
        }, 300);
    }
    _setVolume(e) {
        if (this._fixedVolume)
            return;
        const v = parseFloat(e.target.value);
        this._call("volume_set", { volume_level: v / 96 });
    }
    /** Debounce helper for settings changes */
    _debounceSetting(entityId, callback, delay = 300) {
        const existing = this._settingsDebounceTimers.get(entityId);
        if (existing)
            clearTimeout(existing);
        const timer = setTimeout(() => {
            callback();
            this._settingsDebounceTimers.delete(entityId);
        }, delay);
        this._settingsDebounceTimers.set(entityId, timer);
    }
    _callSettingsService(domain, service, entityId, data = {}) {
        this.hass.callService(domain, service, { entity_id: entityId, ...data });
    }
    _handleNumberChange(entityId, e) {
        const value = parseFloat(e.target.value);
        this._debounceSetting(entityId, () => {
            this._callSettingsService("number", "set_value", entityId, { value });
        });
    }
    _handleSwitchChange(entityId, e) {
        const checked = e.target.checked;
        this._callSettingsService("switch", checked ? "turn_on" : "turn_off", entityId);
    }
    _handleSelectChange(entityId, e) {
        const value = e.target.value;
        this._callSettingsService("select", "select_option", entityId, { option: value });
    }
    render() {
        if (!this._config || !this.hass)
            return b ``;
        const e = this._entity;
        const state = e?.state ?? "unavailable";
        const attrs = e?.attributes ?? {};
        const volume = attrs.volume_level ?? 0;
        const source = attrs.source ?? "—";
        const sources = attrs.source_list ?? [];
        const muted = !!attrs.is_volume_muted;
        const on = state !== "off" && state !== "standby" && state !== "unavailable";
        const fixedVolume = this._fixedVolume;
        const model = this._config.model || attrs.model || attrs.device_model || attrs.friendly_name || "";
        const settingsEntities = this._config.settings_entities ?? {};
        const showSettings = this._config.show_settings === true;
        // Fetch settings entity states
        const bassState = settingsEntities.bass ? this.hass.states[settingsEntities.bass] : null;
        const trebleState = settingsEntities.treble ? this.hass.states[settingsEntities.treble] : null;
        const balanceState = settingsEntities.balance ? this.hass.states[settingsEntities.balance] : null;
        const speakersAState = settingsEntities.speakers_a ? this.hass.states[settingsEntities.speakers_a] : null;
        const speakersBState = settingsEntities.speakers_b ? this.hass.states[settingsEntities.speakers_b] : null;
        const dimmerState = settingsEntities.dimmer ? this.hass.states[settingsEntities.dimmer] : null;
        const toneBypassState = settingsEntities.tone_bypass ? this.hass.states[settingsEntities.tone_bypass] : null;
        // Check if any settings entities are actually configured and available
        const configuredSettings = [
            bassState, trebleState, balanceState,
            speakersAState, speakersBState, toneBypassState, dimmerState
        ].filter(Boolean);
        const hasSettingsToShow = showSettings && configuredSettings.length > 0;
        // Limit to 12 sources (2 rows × 6 columns) as per the CSS grid
        const displaySources = sources.slice(0, 12);
        const hasMoreSources = sources.length > 12;
        const t = (ns, key, params) => localize(this.hass, ns, key, params);
        return b `
      <ha-card>
        <div class="wrap">
          <div class="header">
            <div class="brand-group">
              <span class="brand">ROTEL</span>
              ${model ? b `<span class="model">${model}</span>` : ""}
            </div>
            <ha-icon-button
              class="power ${on ? "on" : "off"}"
              .label=${on ? t("card", "power_off") : t("card", "power_on")}
              @click=${this._togglePower}
            >
              <ha-icon icon="mdi:power"></ha-icon>
            </ha-icon-button>
          </div>
          <div class="volume">
            <div class="vnum">${Math.round(volume * 96)}</div>
            <div class="vlabel">${t("card", "volume_label")}</div>
            <input type="range" min="0" max="96" step="1" .value=${String(Math.round(volume * 96))}
              ?disabled=${fixedVolume} @input=${this._setVolume} />
          </div>
          <div class="controls">
            <ha-icon-button class="control-btn vol" .label=${t("card", "volume_down")} ?disabled=${fixedVolume} @click=${this._volumeDown}>
              <ha-icon icon="mdi:volume-minus"></ha-icon>
            </ha-icon-button>
            <ha-icon-button class="control-btn vol mute" .label=${muted ? t("card", "unmute") : t("card", "mute")} ?disabled=${fixedVolume} @click=${this._mute}>
              <ha-icon icon=${muted ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
            </ha-icon-button>
            <ha-icon-button class="control-btn vol" .label=${t("card", "volume_up")} ?disabled=${fixedVolume} @click=${this._volumeUp}>
              <ha-icon icon="mdi:volume-plus"></ha-icon>
            </ha-icon-button>
          </div>
          <div class="rotel-panel">
            <div class="source-grid">
              ${displaySources.map((s) => b `
                  <div class="source-item ${s === source ? "active" : ""}">
                    <span class="source-label">${s}</span>
                    <div class="source-led" aria-hidden="true"></div>
                    <button
                      class="rotel-btn"
                      aria-label=${t("card", "source_select", { source: s })}
                      @click=${() => this._selectSource(s)}
                    ></button>
                  </div>
              `)}
            </div>
            ${hasMoreSources ? b `
              <div class="source-truncation" aria-live="polite">
                ${t("card", "more_sources", { count: sources.length - 12 })}
              </div>
            ` : ""}
          </div>
          ${hasSettingsToShow ? b `
            <div class="settings-panel">
              <div class="settings-header">
                <span class="settings-title">${t("card", "settings_title")}</span>
              </div>
              <div class="settings-grid">
                ${this._renderNumberSetting(t("settings", "bass"), bassState, settingsEntities.bass)}
                ${this._renderNumberSetting(t("settings", "treble"), trebleState, settingsEntities.treble)}
                ${this._renderNumberSetting(t("settings", "balance"), balanceState, settingsEntities.balance)}
                ${this._renderSwitchSetting(t("settings", "speakers_a"), speakersAState, settingsEntities.speakers_a)}
                ${this._renderSwitchSetting(t("settings", "speakers_b"), speakersBState, settingsEntities.speakers_b)}
                ${this._renderSwitchSetting(t("settings", "tone_bypass"), toneBypassState, settingsEntities.tone_bypass)}
                ${this._renderSelectSetting(t("settings", "dimmer"), dimmerState, settingsEntities.dimmer)}
              </div>
            </div>
          ` : ""}
        </div>
      </ha-card>
    `;
    }
    _renderNumberSetting(label, stateObj, entityId) {
        if (!stateObj || !entityId)
            return b ``;
        const unavailable = stateObj.state === "unavailable" || stateObj.state === "unknown";
        const value = Number(stateObj.state);
        const min = Number(stateObj.attributes.min) ?? -10;
        const max = Number(stateObj.attributes.max) ?? 10;
        const step = Number(stateObj.attributes.step) ?? 1;
        const unavailLabel = localize(this.hass, "card", "unavailable");
        return b `
      <div class="setting-item ${unavailable ? "unavailable" : ""}">
        <div class="setting-label">${label}</div>
        <div class="setting-value">${unavailable ? unavailLabel : stateObj.state}</div>
        <ha-slider
          min=${min}
          max=${max}
          step=${step}
          .value=${value}
          pin
          ?disabled=${unavailable}
          @change=${(e) => this._handleNumberChange(entityId, e)}
        ></ha-slider>
      </div>
    `;
    }
    _renderSwitchSetting(label, stateObj, entityId) {
        if (!stateObj || !entityId)
            return b ``;
        const unavailable = stateObj.state === "unavailable" || stateObj.state === "unknown";
        return b `
      <div class="setting-item switch-item ${unavailable ? "unavailable" : ""}">
        <div class="setting-label">${label}</div>
        <ha-switch
          .checked=${stateObj.state === "on"}
          ?disabled=${unavailable}
          @change=${(e) => this._handleSwitchChange(entityId, e)}
        ></ha-switch>
      </div>
    `;
    }
    _renderSelectSetting(label, stateObj, entityId) {
        if (!stateObj || !entityId)
            return b ``;
        const unavailable = stateObj.state === "unavailable" || stateObj.state === "unknown";
        const options = stateObj.attributes.options ?? [];
        const unavailLabel = localize(this.hass, "card", "unavailable");
        return b `
      <div class="setting-item ${unavailable ? "unavailable" : ""}">
        <div class="setting-label">${label}</div>
        <div class="setting-value">${unavailable ? unavailLabel : stateObj.state}</div>
        <ha-select
          .value=${stateObj.state}
          ?disabled=${unavailable}
          @change=${(e) => this._handleSelectChange(entityId, e)}
        >
          ${options.map((opt) => b `
            <mwc-list-item .value=${opt}>${opt}</mwc-list-item>
          `)}
        </ha-select>
      </div>
    `;
    }
    static get styles() {
        return i$3 `
      :host { display: block; }

      /* Theme presets via data-theme attribute */
      :host([data-theme="silver"]) {
        --rotel-bg: linear-gradient(145deg, #e8e8e8, #d0d0d0);
        --rotel-text: #1a1a1a;
        --rotel-text-muted: #555;
        --rotel-border: #bbb;
        --rotel-accent: #c9a227;
        --rotel-display-text: #c9a227;
        --rotel-button-color: #f0f0f0;
        --rotel-border-button: #ccc;
        --rotel-icon-color: #333;
        --rotel-display-bg: linear-gradient(135deg, #f5f5f5, #e0e0e0);
        --rotel-panel-bg: linear-gradient(135deg, #d4d4d4 0%, #b8b8b8 100%);
        --rotel-panel-text: #333;
        --rotel-settings-bg: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
        --rotel-settings-border: #bbb;
      }
      :host([data-theme="black"]) {
        --rotel-bg: linear-gradient(145deg, #1a1a1a, #0d0d0d);
        --rotel-text: #e0e0e0;
        --rotel-text-muted: #888;
        --rotel-border: #333;
        --rotel-accent: #c9a227;
        --rotel-display-text: #c9a227;
        --rotel-button-color: #2a2a2a;
        --rotel-border-button: #444;
        --rotel-icon-color: #cfcfcf;
        --rotel-display-bg: transparent;
        --rotel-panel-bg: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
        --rotel-panel-text: #e0e0e0;
        --rotel-settings-bg: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
        --rotel-settings-border: #333;
      }
      :host([data-theme="champagne"]) {
        --rotel-bg: linear-gradient(145deg, #f5e6d3, #e8d4bc);
        --rotel-text: #2d2520;
        --rotel-text-muted: #6b5b4f;
        --rotel-border: #d4c4b0;
        --rotel-accent: #b8860b;
        --rotel-display-text: #b8860b;
        --rotel-button-color: #f0e0d0;
        --rotel-border-button: #d4c4b0;
        --rotel-icon-color: #4a3c30;
        --rotel-display-bg: linear-gradient(135deg, #faf0e6, #f0e0d0);
        --rotel-panel-bg: linear-gradient(135deg, #e8d4bc 0%, #dcc0a8 100%);
        --rotel-panel-text: #2d2520;
        --rotel-settings-bg: linear-gradient(135deg, #f5e6d3 0%, #e8d4bc 100%);
        --rotel-settings-border: #d4c4b0;
      }
      :host([data-theme="minimal"]) {
        --rotel-bg: var(--card-background-color, #ffffff);
        --rotel-text: var(--primary-text-color, #212121);
        --rotel-text-muted: var(--secondary-text-color, #757575);
        --rotel-border: var(--divider-color, #e0e0e0);
        --rotel-accent: var(--primary-color, #1976d2);
        --rotel-display-text: var(--primary-color, #1976d2);
        --rotel-button-color: var(--card-background-color, #ffffff);
        --rotel-border-button: var(--divider-color, #e0e0e0);
        --rotel-icon-color: var(--primary-text-color, #212121);
        --rotel-display-bg: transparent;
        --rotel-panel-bg: var(--card-background-color, #ffffff);
        --rotel-panel-text: var(--primary-text-color, #212121);
        --rotel-settings-bg: var(--card-background-color, #ffffff);
        --rotel-settings-border: var(--divider-color, #e0e0e0);
      }

      ha-card {
        background: var(--rotel-bg);
        color: var(--rotel-text);
        border: 1px solid var(--rotel-border);
        border-radius: 12px;
        padding: 16px;
        font-family: "Roboto", sans-serif;
      }
.wrap { display: flex; flex-direction: column; gap: 0.75rem; }
      .header { display: flex; justify-content: space-between; align-items: center; }
      .brand { font-size: 1.25rem; font-weight: 700; letter-spacing: 0.25rem; color: var(--rotel-accent, #c9a227); }
      .brand-group { display: flex; align-items: baseline; gap: 0.625rem; }
      .model { font-size: 0.75rem; letter-spacing: 1px; color: var(--rotel-text-muted, var(--secondary-text-color, #888)); }
      ha-icon-button {
        --mdc-icon-button-size: 2.5rem;
        --mdc-icon-size: 1.375rem;
        color: var(--rotel-icon-color, #cfcfcf);
      }
      ha-icon-button ha-icon { width: 1.375rem; height: 1.375rem; }
      ha-icon-button:hover { color: #fff; }
      ha-icon-button.power.on ha-icon { color: var(--success-color, green); }
      ha-icon-button.power.off ha-icon { color: var(--error-color, red); }
      ha-icon-button[disabled],
      ha-icon-button[disabled]:hover { color: var(--rotel-disabled, #5a5a5a); pointer-events: none; }
      .volume { text-align: center; background: var(--rotel-display-bg, transparent); }
      .vnum { font-size: 3rem; font-weight: 300; color: var(--rotel-display-text, #c9a227); }
      .vlabel { font-size: 0.6875rem; letter-spacing: 2px; color: var(--rotel-text-muted, var(--secondary-text-color, #888)); }
      input[type=range] { width: 100%; }
      input[type=range][disabled] { opacity: 0.4; cursor: not-allowed; }
      .controls { display: flex; align-items: center; justify-content: center; gap: 0.625rem; }
      .control-btn { background: var(--rotel-button-color, #2a2a2a); color: var(--rotel-text, var(--primary-text-color, #e0e0e0)); border: 1px solid var(--rotel-border-button, #444); border-radius: 0.375rem; padding: 0.375rem 0.75rem; cursor: pointer; }
      .control-btn.active { background: var(--rotel-accent, #c9a227); color: var(--rotel-active-text, #000); }
      .control-btn[disabled] { opacity: 0.4; cursor: not-allowed; }

      /* Rotel-style source selector panel */
      .rotel-panel {
        background: var(--rotel-panel-bg, linear-gradient(135deg, #d4d4d4 0%, #b8b8b8 100%));
        padding: 1.5rem;
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8),
                    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
      }
      .source-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        row-gap: 1.25rem;
        column-gap: 0.625rem;
        justify-items: center;
      }
      .source-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.375rem;
      }
      .source-label {
        font-family: 'Arial', sans-serif;
        font-size: 0.625rem;
        font-weight: 700;
        color: var(--rotel-panel-text, #333);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
      }
      .source-led {
        width: 0.375rem;
        height: 0.375rem;
        border-radius: 50%;
        background: var(--rotel-text-muted, #2a2a2a);
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.4);
        transition: all 0.3s ease;
      }
      .source-item.active .source-led {
        background: #0078ff;
        box-shadow: 0 0 0.25rem #0078ff, 0 0 0.5rem #0078ff, inset 0 1px 2px rgba(255,255,255,0.8);
      }
      .rotel-btn {
        position: relative;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        border: none;
        outline: none;
        cursor: pointer;
        background: var(--rotel-button-color, linear-gradient(135deg, #fdfdfd 0%, #c3c3c3 100%));
        box-shadow: 0 0.25rem 0.3125rem rgba(0,0,0,0.3), inset 0 0.125rem 0.1875rem rgba(255,255,255,0.9), inset 0 -0.125rem 0.1875rem rgba(0,0,0,0.2);
        transition: transform 0.05s ease, box-shadow 0.05s ease;
      }
      .rotel-btn::before {
        content: '';
        position: absolute;
        top: -0.1875rem;
        left: -0.1875rem;
        right: -0.1875rem;
        bottom: -0.1875rem;
        border-radius: 50%;
        background: var(--rotel-border-button, linear-gradient(135deg, #999 0%, #e6e6e6 100%));
        z-index: -1;
        box-shadow: 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.8);
      }
      .rotel-btn:active {
        transform: translateY(0.125rem);
        box-shadow: 0 1px 1px rgba(0,0,0,0.2), inset 0 0.1875rem 0.3125rem rgba(0,0,0,0.5), inset 0 -1px 2px rgba(255,255,255,0.4);
      }
      .rotel-btn[disabled] {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .rotel-btn:focus-visible {
        outline: 2px solid var(--rotel-accent, #c9a227);
        outline-offset: 2px;
      }
      .source-truncation {
        margin-top: 1rem;
        text-align: center;
        font-size: 0.75rem;
        color: var(--rotel-text-muted, var(--secondary-text-color, #888));
      }

      /* Settings panel */
      .settings-panel {
        background: var(--rotel-settings-bg, linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%));
        border: 1px solid var(--rotel-settings-border, var(--rotel-border, #333));
        border-radius: var(--ha-card-border-radius, 12px);
        padding: 1rem;
        margin-top: 0.5rem;
      }
      .settings-header {
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--rotel-border, #333);
      }
      .settings-title {
        font-size: 0.6875rem;
        font-weight: 700;
        letter-spacing: 2px;
        color: var(--rotel-accent, #c9a227);
        text-transform: uppercase;
      }
      .settings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }
      .setting-item {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .setting-label {
        font-size: 0.625rem;
        font-weight: 700;
        letter-spacing: 1px;
        color: var(--rotel-text-muted, var(--secondary-text-color, #888));
        text-transform: uppercase;
      }
      .setting-value {
        font-size: 1rem;
        font-weight: 300;
        color: var(--rotel-display-text, #c9a227);
        text-align: right;
      }
      .setting-item > * {
        width: 100%;
      }
      .switch-item {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .switch-item .setting-label {
        margin-right: 1rem;
      }
      .switch-item ha-switch {
        --mdc-theme-primary: var(--rotel-accent, #c9a227);
      }
      ha-slider {
        --mdc-theme-primary: var(--rotel-accent, #c9a227);
        --mdc-theme-secondary: var(--rotel-accent, #c9a227);
      }
      ha-select {
        --mdc-theme-primary: var(--rotel-accent, #c9a227);
      }
      .setting-item.unavailable {
        opacity: 0.5;
        pointer-events: none;
      }
      .setting-item.unavailable .setting-value {
        color: var(--rotel-text-muted, var(--secondary-text-color, #888));
      }
    `;
    }
};
__decorate([
    n({ attribute: false })
], RotelAmplifierCard.prototype, "hass", void 0);
__decorate([
    r$1()
], RotelAmplifierCard.prototype, "_config", void 0);
RotelAmplifierCard = __decorate([
    t$1("rotel-amplifier-card")
], RotelAmplifierCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "rotel-amplifier-card",
    name: "Rotel Amplifier Card",
    description: "Hi-Fi card for Rotel amplifier",
});

export { RotelAmplifierCard };
