function t(t,i,e){return Math.max(t,Math.min(i,e))}var i=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(i){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=i;const s=t(0,this.currentTime/this.duration,1);e=s>=1;const o=e?1:this.easing(s);this.value=this.from+(this.to-this.from)*o}else this.lerp?(this.value=function(t,i,e,s){return function(t,i,e){return(1-e)*t+e*i}(t,i,1-Math.exp(-e*s))}(this.value,this.to,60*this.lerp,i),Math.round(this.value)===this.to&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(t,i,{lerp:e,duration:s,easing:o,onStart:n,onUpdate:r}){this.from=this.value=t,this.to=i,this.lerp=e,this.duration=s,this.easing=o,this.currentTime=0,this.isRunning=!0,n?.(),this.onUpdate=r}};var e=class{constructor(t,i,{autoResize:e=!0,debounce:s=250}={}){this.wrapper=t,this.content=i,e&&(this.debouncedResize=function(t,i){let e;return function(...s){let o=this;clearTimeout(e),e=setTimeout((()=>{e=void 0,t.apply(o,s)}),i)}}(this.resize,s),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize,!1)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},s=class{events={};emit(t,...i){let e=this.events[t]||[];for(let t=0,s=e.length;t<s;t++)e[t]?.(...i)}on(t,i){return this.events[t]?.push(i)||(this.events[t]=[i]),()=>{this.events[t]=this.events[t]?.filter((t=>i!==t))}}off(t,i){this.events[t]=this.events[t]?.filter((t=>i!==t))}destroy(){this.events={}}},o=100/6,n={passive:!1},r=class{constructor(t,i={wheelMultiplier:1,touchMultiplier:1}){this.element=t,this.options=i,window.addEventListener("resize",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,n),this.element.addEventListener("touchstart",this.onTouchStart,n),this.element.addEventListener("touchmove",this.onTouchMove,n),this.element.addEventListener("touchend",this.onTouchEnd,n)}touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new s;on(t,i){return this.emitter.on(t,i)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize,!1),this.element.removeEventListener("wheel",this.onWheel,n),this.element.removeEventListener("touchstart",this.onTouchStart,n),this.element.removeEventListener("touchmove",this.onTouchMove,n),this.element.removeEventListener("touchend",this.onTouchEnd,n)}onTouchStart=t=>{const{clientX:i,clientY:e}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=i,this.touchStart.y=e,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})};onTouchMove=t=>{const{clientX:i,clientY:e}=t.targetTouches?t.targetTouches[0]:t,s=-(i-this.touchStart.x)*this.options.touchMultiplier,o=-(e-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=i,this.touchStart.y=e,this.lastDelta={x:s,y:o},this.emitter.emit("scroll",{deltaX:s,deltaY:o,event:t})};onTouchEnd=t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})};onWheel=t=>{let{deltaX:i,deltaY:e,deltaMode:s}=t;i*=1===s?o:2===s?this.window.width:1,e*=1===s?o:2===s?this.window.height:1,i*=this.options.wheelMultiplier,e*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:i,deltaY:e,event:t})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},Lenis=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;__rafID=null;isTouching;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new i;emitter=new s;dimensions;virtualScroll;constructor({wrapper:t=window,content:i=document.documentElement,eventsTarget:s=t,smoothWheel:o=!0,syncTouch:n=!1,syncTouchLerp:l=.075,touchInertiaMultiplier:h=35,duration:a,easing:c=t=>Math.min(1,1.001-Math.pow(2,-10*t)),lerp:p=.1,infinite:d=!1,orientation:u="vertical",gestureOrientation:m="vertical",touchMultiplier:v=1,wheelMultiplier:S=1,autoResize:w=!0,prevent:g,virtualScroll:f,overscroll:y=!0,autoRaf:E=!1,anchors:T=!1,__experimental__naiveDimensions:z=!1}={}){window.lenisVersion="1.1.20",t&&t!==document.documentElement||(t=window),this.options={wrapper:t,content:i,eventsTarget:s,smoothWheel:o,syncTouch:n,syncTouchLerp:l,touchInertiaMultiplier:h,duration:a,easing:c,lerp:p,infinite:d,gestureOrientation:m,orientation:u,touchMultiplier:v,wheelMultiplier:S,autoResize:w,prevent:g,virtualScroll:f,overscroll:y,autoRaf:E,anchors:T,__experimental__naiveDimensions:z},this.dimensions=new e(t,i,{autoResize:w}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.anchors&&this.options.wrapper===window&&this.options.wrapper.addEventListener("click",this.onClick,!1),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll=new r(s,{touchMultiplier:v,wheelMultiplier:S}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoRaf&&(this.__rafID=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown,!1),this.options.anchors&&this.options.wrapper===window&&this.options.wrapper.removeEventListener("click",this.onClick,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this.__rafID&&cancelAnimationFrame(this.__rafID)}on(t,i){return this.emitter.on(t,i)}off(t,i){return this.emitter.off(t,i)}onScrollEnd=t=>{t instanceof CustomEvent||"smooth"!==this.isScrolling&&!1!==this.isScrolling||t.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};setScroll(t){this.isHorizontal?this.options.wrapper.scrollTo({left:t,behavior:"instant"}):this.options.wrapper.scrollTo({top:t,behavior:"instant"})}onClick=t=>{const i=t.composedPath().find((t=>t instanceof HTMLAnchorElement&&t.getAttribute("href")?.startsWith("#")));if(i){const t=i.getAttribute("href");if(t){const i="object"==typeof this.options.anchors&&this.options.anchors?this.options.anchors:void 0;this.scrollTo(t,i)}}};onPointerDown=t=>{1===t.button&&this.reset()};onVirtualScroll=t=>{if("function"==typeof this.options.virtualScroll&&!1===this.options.virtualScroll(t))return;const{deltaX:i,deltaY:e,event:s}=t;if(this.emitter.emit("virtual-scroll",{deltaX:i,deltaY:e,event:s}),s.ctrlKey)return;if(s.lenisStopPropagation)return;const o=s.type.includes("touch"),n=s.type.includes("wheel");this.isTouching="touchstart"===s.type||"touchmove"===s.type;const r=0===i&&0===e;if(this.options.syncTouch&&o&&"touchstart"===s.type&&r&&!this.isStopped&&!this.isLocked)return void this.reset();const l="vertical"===this.options.gestureOrientation&&0===e||"horizontal"===this.options.gestureOrientation&&0===i;if(r||l)return;let h=s.composedPath();h=h.slice(0,h.indexOf(this.rootElement));const a=this.options.prevent;if(h.find((t=>t instanceof HTMLElement&&("function"==typeof a&&a?.(t)||t.hasAttribute?.("data-lenis-prevent")||o&&t.hasAttribute?.("data-lenis-prevent-touch")||n&&t.hasAttribute?.("data-lenis-prevent-wheel")))))return;if(this.isStopped||this.isLocked)return void s.preventDefault();if(!(this.options.syncTouch&&o||this.options.smoothWheel&&n))return this.isScrolling="native",this.animate.stop(),void(s.lenisStopPropagation=!0);let c=e;"both"===this.options.gestureOrientation?c=Math.abs(e)>Math.abs(i)?e:i:"horizontal"===this.options.gestureOrientation&&(c=i),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&(this.animatedScroll>0&&this.animatedScroll<this.limit||0===this.animatedScroll&&e>0||this.animatedScroll===this.limit&&e<0))&&(s.lenisStopPropagation=!0),s.preventDefault();const p=o&&this.options.syncTouch,d=o&&"touchend"===s.type&&Math.abs(c)>5;d&&(c=this.velocity*this.options.touchInertiaMultiplier),this.scrollTo(this.targetScroll+c,{programmatic:!1,...p?{lerp:d?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(null!==this._resetVelocityTimeout&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent)this._preventNextNativeScrollEvent=!1;else if(!1===this.isScrolling||"native"===this.isScrolling){const t=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-t,this.direction=Math.sign(this.animatedScroll-t),this.isStopped||(this.isScrolling="native"),this.emit(),0!==this.velocity&&(this._resetVelocityTimeout=setTimeout((()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()}),400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){this.isStopped&&(this.reset(),this.isStopped=!1)}stop(){this.isStopped||(this.reset(),this.isStopped=!0)}raf=t=>{const i=t-(this.time||t);this.time=t,this.animate.advance(.001*i),this.options.autoRaf&&(this.__rafID=requestAnimationFrame(this.raf))};scrollTo(i,{offset:e=0,immediate:s=!1,lock:o=!1,duration:n=this.options.duration,easing:r=this.options.easing,lerp:l=this.options.lerp,onStart:h,onComplete:a,force:c=!1,programmatic:p=!0,userData:d}={}){if(!this.isStopped&&!this.isLocked||c){if("string"==typeof i&&["top","left","start"].includes(i))i=0;else if("string"==typeof i&&["bottom","right","end"].includes(i))i=this.limit;else{let t;if("string"==typeof i?t=document.querySelector(i):i instanceof HTMLElement&&i?.nodeType&&(t=i),t){if(this.options.wrapper!==window){const t=this.rootElement.getBoundingClientRect();e-=this.isHorizontal?t.left:t.top}const s=t.getBoundingClientRect();i=(this.isHorizontal?s.left:s.top)+this.animatedScroll}}if("number"==typeof i){if(i+=e,i=Math.round(i),this.options.infinite?p&&(this.targetScroll=this.animatedScroll=this.scroll):i=t(0,i,this.limit),i===this.targetScroll)return h?.(this),void a?.(this);if(this.userData=d??{},s)return this.animatedScroll=this.targetScroll=i,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),a?.(this),this.userData={},void requestAnimationFrame((()=>{this.dispatchScrollendEvent()}));p||(this.targetScroll=i),this.animate.fromTo(this.animatedScroll,i,{duration:n,easing:r,lerp:l,onStart:()=>{o&&(this.isLocked=!0),this.isScrolling="smooth",h?.(this)},onUpdate:(t,i)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=t-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=t,this.setScroll(this.scroll),p&&(this.targetScroll=t),i||this.emit(),i&&(this.reset(),this.emit(),a?.(this),this.userData={},requestAnimationFrame((()=>{this.dispatchScrollendEvent()})),this.preventNextNativeScrollEvent())}})}}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame((()=>{this._preventNextNativeScrollEvent=!1}))}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.__experimental__naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return"horizontal"===this.options.orientation}get actualScroll(){const t=this.options.wrapper;return this.isHorizontal?t.scrollX??t.scrollLeft:t.scrollY??t.scrollTop}get scroll(){return this.options.infinite?(t=this.animatedScroll,i=this.limit,(t%i+i)%i):this.animatedScroll;var t,i}get progress(){return 0===this.limit?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(t){this._isScrolling!==t&&(this._isScrolling=t,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(t){this._isStopped!==t&&(this._isStopped=t,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(t){this._isLocked!==t&&(this._isLocked=t,this.updateClassName())}get isSmooth(){return"smooth"===this.isScrolling}get className(){let t="lenis";return this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),"smooth"===this.isScrolling&&(t+=" lenis-smooth"),t}updateClassName(){this.cleanUpClassName(),this.rootElement.className=`${this.rootElement.className} ${this.className}`.trim()}cleanUpClassName(){this.rootElement.className=this.rootElement.className.replace(/lenis(-\w+)?/g,"").trim()}};globalThis.Lenis=Lenis,globalThis.Lenis.prototype=Lenis.prototype;//# sourceMappingURL=lenis.min.js.map

/* адрес, откуда загружен этот файл: картинки и PDF лежат рядом, так что хостинг меняется только в первом блоке Тильды */
const AP_BASE = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');
const boot = () => {
  document.querySelectorAll('[data-src]').forEach(e => { e.src = AP_BASE + e.getAttribute('data-src'); });
  document.querySelectorAll('[data-poster]').forEach(e => { e.poster = AP_BASE + e.getAttribute('data-poster'); });
'use strict';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine   = matchMedia('(hover: hover) and (pointer: fine)').matches;
const tablet = () => matchMedia('(max-width: 1100px)').matches;
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- масштаб первого экрана: ширина и высота окна ---------- */
const stage = $('#stage');
function fit() {
  const hs = Math.max(.5, Math.min(innerWidth / 1920, innerHeight / 1060, 1.4));
  root.style.setProperty('--hs', hs.toFixed(4));
}
fit(); addEventListener('resize', fit);

/* ---------- плавный скролл (Lenis) ---------- */
let lenis = null;
if (window.Lenis && !reduce) {
  lenis = new Lenis({ lerp: .085, wheelMultiplier: 1, touchMultiplier: 1.4, smoothWheel: true });
  const tick = t => { lenis.raf(t); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href'); if (id.length < 2) return;
  const t = $(id); if (!t) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(id === '#top' ? 0 : t, { duration: 1.5, easing: x => 1 - Math.pow(1 - x, 4) });
  else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}));

/* ---------- запуск вступления, когда готовы шрифты и главное фото ---------- */
const ready = () => document.body.classList.add('is-ready');
Promise.race([
  Promise.all([document.fonts ? document.fonts.ready : 0, new Promise(r => { const i = $('.ph .par img'); !i || i.complete ? r() : (i.onload = i.onerror = r); })]),
  new Promise(r => setTimeout(r, 1600))
]).then(() => requestAnimationFrame(ready));

/* ---------- показ элементов при прокрутке ---------- */
/* threshold 0: у картинок со шторкой (clip-path) видимая площадь = 0, по доле их не поймать */
const mk = (th, mg, stagger) => { const o = new IntersectionObserver(es => {
  /* если несколько блоков появились в кадре разом, показываем их друг за другом */
  const hit = es.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
  hit.forEach((e, i) => {
    if (stagger && !e.target.style.getPropertyValue('--d') && !getComputedStyle(e.target).getPropertyValue('--d').trim()) e.target.style.setProperty('--d', (i * .18).toFixed(2) + 's');
    e.target.classList.add('in'); o.unobserve(e.target);
  });
}, { threshold: th, rootMargin: mg }); return o; };
const io = mk(0, innerWidth <= 1100 ? '0px 0px -4% 0px' : '0px 0px -10% 0px', true);
$$('.rv, .rv-img, .draw, .thread, .label').forEach(el => { if (!el.closest('.works__track')) io.observe(el); });
{ /* контуры карточек «Обо мне»: свой наблюдатель, чтобы не наследовать задержку карточек */
  const lines = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.about__cards').forEach(el => lines.observe(el));
}
// «Другие работы»: все карточки появляются одинаково (та же длительность, без нарастающей задержки),
// а те, что за краем экрана, раскрываются при прокрутке ленты так же, как первые
{
  const trk = $('#track');
  if (trk) {
    const reveal = new IntersectionObserver(es => {
      let i = 0;
      es.filter(e => e.isIntersecting).forEach(e => {
        const img = e.target.querySelector('.rv-img'), cap = e.target.querySelector('.rv');
        const d = i * .1;
        img.style.setProperty('--d', d + 's'); cap.style.setProperty('--d', (d + .25) + 's');
        img.classList.add('in'); cap.classList.add('in');
        reveal.unobserve(e.target); i++;
      });
    }, { root: trk, threshold: .12 });
    const start = new IntersectionObserver((es, o) => {
      if (!es.some(e => e.isIntersecting)) return;
      o.disconnect(); $$('.work').forEach(w => reveal.observe(w));
    }, { rootMargin: '0px 0px -10% 0px' });
    start.observe(trk);
  }
}
if ($('.dark')) mk(.2, '0px').observe($('.dark'));

/* ---------- шапка: прячется вниз, возвращается вверх, темнеет на тёмном ---------- */
const hdr = $('#hdr'), dark = $('.dark');
let lastY = scrollY;
function onScrollHeader() {
  const y = scrollY;
  if (y > 140 && y > lastY + 4) hdr.classList.add('is-hidden');
  else if (y < lastY - 4 || y < 60) hdr.classList.remove('is-hidden');
  lastY = y;
  hdr.classList.toggle('is-solid', y > 40);
  const r = dark ? dark.getBoundingClientRect() : null;
  const on = !!r && r.top < 50 && r.bottom > 50;
  hdr.classList.toggle('on-dark', on);
  // активный пункт меню
  const secs = [['projects', '#projects'], ['about', '#about'], ['contacts', '#contacts']];
  let act = null;
  secs.forEach(([id]) => { const el = $('#' + id); if (!el) return; const b = el.getBoundingClientRect(); if (b.top < innerHeight * .45 && b.bottom > innerHeight * .45) act = id; });
  $$('.hdr__nav a').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + act));
}

/* ---------- параллакс: скролл + мышь ---------- */
let ticking = false;
function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
/* липкая колонка описания на страницах кейсов: когда раздел подходит к концу, текст плавно уходит в прозрачность */
const stickySides = $$('.case__row--s > .case__side');
function fadeSides() {
  if (!stickySides.length) return;
  const wide = innerWidth > 1100;
  stickySides.forEach(side => {
    const kids = side.children;
    if (!wide || reduce) { for (const k of kids) k.style.opacity = ''; return; }
    const row = side.parentElement, rb = row.getBoundingClientRect(), h = side.offsetHeight;
    const u = parseFloat(getComputedStyle(side).top) / 130;                  /* 1 px макета в реальных пикселях */
    const until = rb.bottom - (parseFloat(getComputedStyle(side).top) + h);  /* сколько ещё прокрутить до момента, когда колонка отпустит */
    const range = 420 * u;
    let o = row.offsetHeight <= h + 40 * u ? 1 : Math.max(0, Math.min(1, until / range));
    for (const k of kids) k.style.opacity = o >= 1 ? '' : o.toFixed(3);
  });
}
function update() {
  ticking = false;
  const y = scrollY, vh = innerHeight;
  onScrollHeader();
  fadeSides();
  /* самый низ страницы: последние элементы со сдвигом снизу могут не дойти до порога наблюдателя */
  if (innerHeight + y >= document.documentElement.scrollHeight - 6) $$('.rv:not(.in),.draw:not(.in),.rv-img:not(.in)').forEach(el => { if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('in'); io.unobserve(el); } });
  if (reduce) return;
  sy = y; applyHero();
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);

/* ---------- параллакс первого экрана и девушки в контактах ---------- */
/* значения пишем прямо в transform нескольких элементов: быстро, без пересчёта стилей всей страницы */
let nx = 0, ny = 0, cx = 0, cy = 0, gx = 0, gy = 0, sy = 0, cgVis = false;
const layers = $$('.stage .par').map(el => ({ el, dx: +el.style.getPropertyValue('--dx') || 0, dy: +el.style.getPropertyValue('--dy') || 0, ds: +el.style.getPropertyValue('--ds') || 0 }));
const marks = $$('.stage .mk.f');
function applyHero() {
  if (reduce) return;
  if (tablet()) { layers.forEach(l => l.el.style.transform = ''); marks.forEach(m => m.style.translate = ''); return; }
  layers.forEach(l => { l.el.style.transform = `translate3d(${(cx * l.dx).toFixed(2)}px,${(cy * l.dy + sy * l.ds).toFixed(2)}px,0)`; });
  marks.forEach(m => { m.style.translate = `${(cx * -22).toFixed(2)}px ${(cy * -14 + sy * .03).toFixed(2)}px`; });
}
addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  nx = (e.clientX / innerWidth - .5) * 2; ny = (e.clientY / innerHeight - .5) * 2;
}, { passive: true });
const cgirl = $('#cgirl'), cgImg = $('.cgirl__img');
if (cgirl) new IntersectionObserver(es => es.forEach(e => { cgVis = e.isIntersecting; })).observe(cgirl);
function loop() {
  requestAnimationFrame(loop);
  if (document.hidden || reduce || !fine) return;
  if (scrollY < innerHeight * 1.1 && !tablet()) {            /* первый экран: догоняем мышь, пока она двигается */
    const ex = nx - cx, ey = ny - cy;
    if (Math.abs(ex) > .0008 || Math.abs(ey) > .0008) { cx += ex * .08; cy += ey * .08; applyHero(); }
  }
  if (cgVis) {                                                /* контакты: девушка чуть следит за мышью */
    const ex = nx * 7 - gx, ey = ny * 4 - gy;
    if (Math.abs(ex) > .02 || Math.abs(ey) > .02) { gx += ex * .08; gy += ey * .08; cgImg.style.transform = `translate3d(${gx.toFixed(2)}px,${gy.toFixed(2)}px,0)`; }
  }
}
requestAnimationFrame(loop);
update();

/* магнитные элементы */
if (fine && !reduce) {
  $$('[data-magnet]').forEach(el => {
    const k = parseFloat(el.dataset.magnet) || .25;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * k, y = (e.clientY - (r.top + r.height / 2)) * k;
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ---------- подсказки (тост) ---------- */
const toast = $('#toast'); let tt;
/* неразрывные пробелы после коротких предлогов и союзов, чтобы они не висели в конце строки */
const NB_WORDS = 'в|во|к|ко|с|со|у|о|об|обо|и|а|но|на|по|за|от|до|из|не|ни|же|бы|ли|для|над|под|при|про|без|или|что|как';
const NB_RE = new RegExp('(?<![A-Za-z0-9_А-Яа-яЁё-])(' + NB_WORDS + ')[ \\t]+(?=\\S)', 'gi');
const nb = t => String(t).replace(NB_RE, '$1\u00A0').replace(NB_RE, '$1\u00A0').replace(/(\d)[ \t]+(?=[А-Яа-яЁё])/g, '$1\u00A0').replace(/(?<=\S)[ \t]+(?=[—–](?:\s|$))/g, '\u00A0');
/* то же самое для текста, который уже лежит на странице (на случай блоков в Тильде без неразрывных пробелов в разметке) */
{
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => {
    const p = n.parentElement; return p && !/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|TITLE)$/.test(p.tagName) && /[А-Яа-яЁё]/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
  const list = []; while (w.nextNode()) list.push(w.currentNode);
  list.forEach(n => { const v = nb(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; });
}
function say(msg) { msg = nb(msg); if (!toast) return; toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('is-on'), 2200); }
/* резюме под разные вакансии: ссылка на сайт с ?cv=senior | communication | brand | lead подставляет нужный PDF во все кнопки «Скачать CV».
   Без параметра открывается основное резюме (senior). Выбор помнится до конца визита. */
{
  const CV = { senior: AP_BASE + 'cv/senior.pdf', communication: AP_BASE + 'cv/communication.pdf', brand: AP_BASE + 'cv/brand.pdf', lead: AP_BASE + 'cv/lead.pdf' };
  const ALIAS = { comm: 'communication', teamlead: 'lead', 'team-lead': 'lead', tl: 'lead' };
  const norm = v => { v = (v || '').toLowerCase().trim(); return CV[ALIAS[v] || v] ? (ALIAS[v] || v) : null; };
  let key = null;
  try { key = norm(new URLSearchParams(location.search).get('cv')); if (key) sessionStorage.setItem('cv', key); else key = norm(sessionStorage.getItem('cv')); } catch (e) { /* без хранилища работает по параметру */ }
  const file = CV[key || 'senior'];
  /* ссылка с ?cv=lead: подпись на первом экране «Тимлид дизайн-команды» вместо «Бренд / Коммуникационный дизайнер» */
  if (key === 'lead') {
    const sp = document.querySelectorAll('.tag--l .ln > span');
    if (sp.length > 1) { sp[0].textContent = 'Тимлид'; sp[1].textContent = 'дизайн-команды'; }
  }
  /* ссылка с ?cv=senior: «Senior designer / бренд и коммуникации» */
  if (key === 'senior') {
    const sp = document.querySelectorAll('.tag--l .ln > span');
    if (sp.length > 1) { sp[0].textContent = 'Senior designer'; sp[1].textContent = 'бренд / коммуникации'; }
  }
  $$('[data-cv]').forEach(a => { a.href = file; a.target = '_blank'; a.rel = 'noopener'; });
}
/* личное приветствие: ссылка с ?to=ony меняет «Привет!» на первом экране на «Привет, ONY!» (жирно). Текст только буквы, цифры, пробел . & - _ до 24 знаков */
{
  let who = '';
  try {
    const q = new URLSearchParams(location.search).get('to');
    if (q !== null) { who = /^[\p{L}\p{N} .&_-]{1,24}$/u.test(q.trim()) ? q.trim() : ''; sessionStorage.setItem('to', who); }
    else who = sessionStorage.getItem('to') || '';
    /* исправление: ссылка, отправленная по ошибке с чужим названием, показывает приветствие нужной компании */
    const FIX = { 'команда супрематики': 'команда DUGA' };
    if (who && FIX[who.toLowerCase()]) who = FIX[who.toLowerCase()];
  } catch (e) { /* без хранилища работает по параметру */ }
  /* своя фраза целиком: ?hi=ООО Какие люди, привет! (до 40 знаков: буквы, цифры, пробел . , ! & - _ « » ") */
  let hi = '';
  try {
    const h = new URLSearchParams(location.search).get('hi');
    if (h !== null) { hi = /^[\p{L}\p{N} .,!&_\-«»"']{1,40}$/u.test(h.trim()) ? h.trim() : ''; sessionStorage.setItem('hi', hi); }
    else hi = sessionStorage.getItem('hi') || '';
  } catch (e) { /* без хранилища работает по параметру */ }
  const par = $('.tag--r .par');
  if (hi && par) {
    const spans = par.querySelectorAll('.ln > span');
    if (spans.length > 1) {
      spans[0].textContent = hi;
      spans[0].style.fontWeight = '700'; spans[0].style.color = 'var(--ink)';
      spans[1].textContent = 'Буду рада поработать с\u00a0вами!';
    }
  } else if (who && par) {
    const spans = par.querySelectorAll('.ln > span');
    if (spans.length > 1) {
      spans[0].textContent = 'Привет, ' + who + '!';
      spans[0].style.fontWeight = '700'; spans[0].style.color = 'var(--ink)';
      spans[1].textContent = 'Буду рада поработать с\u00a0вами!';
    }
  }
}
/* видео на страницах кейсов: играет, пока в кадре */
{
  const vids = $$('video[data-autoplay]');
  if (vids.length && 'IntersectionObserver' in window) {
    const vo = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting && !reduce) v.play().catch(() => {}); else v.pause(); }), { threshold: .25 });
    vids.forEach(v => vo.observe(v));
  }
}
/* ссылки, которых ещё нет */
/* просмотр картинок кейса на планшете и телефоне */
(function () {
  const imgs = $$('.case .cimg > img');
  if (!imgs.length) return;
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', 'Просмотр картинки');
  lb.innerHTML = '<div class="lb__sc"><img alt=""></div><button class="lb__x" type="button" aria-label="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"><path d="M4 4l16 16M20 4L4 20"/></svg></button><div class="lb__hint">Двигайте пальцем, чтобы рассмотреть</div>';
  document.body.appendChild(lb);
  const sc = lb.querySelector('.lb__sc'), big = sc.querySelector('img'), hint = lb.querySelector('.lb__hint');
  const close = () => { lb.classList.remove('is-open'); document.body.classList.remove('lock'); if (lenis) lenis.start(); };
  imgs.forEach(im => im.addEventListener('click', () => {
    if (innerWidth > 1100) return;
    big.src = im.currentSrc || im.src; big.alt = im.alt;
    const k = innerWidth < 700 ? 2.5 : 1.6;
    big.style.width = Math.max(innerWidth, Math.min(im.naturalWidth || 2400, innerWidth * k)) + 'px';
    hint.classList.remove('is-off'); setTimeout(() => hint.classList.add('is-off'), 2600);
    lb.classList.add('is-open'); document.body.classList.add('lock'); if (lenis) lenis.stop();
    sc.scrollTop = 0; sc.scrollLeft = (sc.scrollWidth - sc.clientWidth) / 2;
  }));
  lb.querySelector('.lb__x').addEventListener('click', close);
  sc.addEventListener('click', e => { if (e.target === sc) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('is-open')) close(); });
})();
$$('a[data-soon]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); say('Здесь будет ссылка'); }));
$$('[data-case]').forEach(a => a.addEventListener('click', e => { if (a.getAttribute('href') === '#') { e.preventDefault(); say('Страница кейса подключается ссылкой в Тильде'); } }));

/* ---------- лента «Другие работы»: перетаскивание с инерцией ---------- */
if ($('#track')) {
const track = $('#track'), bar = $('#bar');
let down = false, moved = false, sx = 0, sl = 0, vx = 0, lx = 0, raf = 0;
function barUpdate() {
  const max = track.scrollWidth - track.clientWidth;
  const w = Math.max(.12, track.clientWidth / track.scrollWidth);
  bar.style.setProperty('--bw', (w * 100) + '%');
  const bwpx = bar.parentElement.clientWidth * w;
  bar.style.setProperty('--bx', ((bar.parentElement.clientWidth - bwpx) * (max ? track.scrollLeft / max : 0)) + 'px');
}
track.addEventListener('scroll', barUpdate, { passive: true });
addEventListener('resize', barUpdate); barUpdate();
track.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse') return;
  down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; vx = 0; lx = e.clientX;
  cancelAnimationFrame(raf);
});
addEventListener('pointermove', e => {
  if (!down) return;
  const dx = e.clientX - sx;
  if (Math.abs(dx) > 5) { moved = true; track.classList.add('is-drag'); }
  track.scrollLeft = sl - dx;
  vx = lerp(vx, e.clientX - lx, .5); lx = e.clientX;
});
addEventListener('pointerup', () => {
  if (!down) return; down = false;
  const step = () => { vx *= .93; track.scrollLeft -= vx; if (Math.abs(vx) > .4) raf = requestAnimationFrame(step); else track.classList.remove('is-drag'); };
  if (moved) raf = requestAnimationFrame(step);
});
track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopImmediatePropagation(); moved = false; } }, true);
track.addEventListener('wheel', e => {                       // вертикальное колесо над лентой не ломаем
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.preventDefault(), track.scrollLeft += e.deltaX;
}, { passive: false });

}   /* конец: лента */

/* ---------- модалка со слайдером ---------- */
if ($('#modal')) {
/* тексты и порядок кадров из окон в Figma; w — ширины колонок текста в макете */
const MAGAZINE_URL = AP_BASE + 'assets/magazine.pdf';   /* журнал целиком: открывается на просмотр в новой вкладке, не скачивается */
const WORKS = [
  { title: 'Серия плакатов для офиса имени С. П. Королёва', w: [532, 519, 519], cols: [
      'Главная задача этого проекта – связать рабочее пространство с историей освоения космоса и людьми, которые сделали его возможным.',
      'В основу дизайна легли исторические фотографии, цитаты и космические образы. Крупная типографика, растровые текстуры и глубокая синяя палитра.',
      'Каждый макет имеет собственную композицию и работает как самостоятельно, так и в составе общей экспозиции.'],
    slides: [AP_BASE + 'assets/posters-1.webp', AP_BASE + 'assets/posters-2.webp', AP_BASE + 'assets/posters-3.webp', AP_BASE + 'assets/posters-4.webp', AP_BASE + 'assets/posters-5.webp', AP_BASE + 'assets/posters-6.webp'] },
  { title: 'Фирменный стиль для архитектурного бюро', w: [518, 525, 519], cols: [
      'Айдентика архитектурного бюро BAU BÜRO. В основе визуального языка — работа с пространством, строгая геометрия и внимание к деталям.',
      'Логотип построен как изометрическое пространство: буквы расположены на его плоскостях и становятся частью архитектуры знака.',
      'Монохромная палитра, лаконичная типографика и две версии логотипа — объединяют полиграфию, вывески и сувенирную продукцию.'],
    slides: [AP_BASE + 'assets/bau-2.webp', AP_BASE + 'assets/bau-1.webp', AP_BASE + 'assets/bau-3.webp', AP_BASE + 'assets/bau-4.webp', AP_BASE + 'assets/bau-5.webp'] },
  { title: 'Дизайн презентаций', w: [518, 526, 519], cols: [
      'Собираю презентации, которые читаются с первого слайда: понятная структура, ритм и единая визуальная система на всю презентацию.',
      'Отчёты, питчи, брендбуки и продуктовые презентации для IT-компаний, исследовательских центров и стартапов.',
      'Создаю концепцию и стиль презентации, шаблоны слайдов, инфографику и визуализацию данных, авторские иллюстрации и 3D-объекты.'],
    slides: [AP_BASE + 'assets/decks-4.webp', AP_BASE + 'assets/decks-1.webp', AP_BASE + 'assets/decks-2.webp', AP_BASE + 'assets/decks-5.webp', AP_BASE + 'assets/decks-3.webp'] },
  { title: 'Дизайн и верстка журнала', w: [518, 525, 519], link: MAGAZINE_URL, cols: [
      'Разработала дизайн и сверстала издание на 164 страницы о молодёжных субкультурах: от обложки до исследовательских разделов.',
      'Продумала сетку, типографику и навигацию. Выделила цитаты и ключевые тезисы, чтобы облегчить чтение объёмного материала.',
      'Оформила графики, таблицы и схемы в едином стиле. Использовала цветовые акценты для сравнения данных и выделения связей.'],
    slides: [AP_BASE + 'assets/magazine-1.webp', AP_BASE + 'assets/magazine-2.webp', AP_BASE + 'assets/magazine-3.webp', AP_BASE + 'assets/magazine-4.webp', AP_BASE + 'assets/magazine-5.webp', AP_BASE + 'assets/magazine-6.webp'] },
  { title: 'Отрисовка мобильной игры «Тамагочи»', w: [554, 517, 488], cols: [
      'Разработала визуальное оформление мобильной игры о заботе о виртуальном питомце: от главного персонажа и до игровых иконок и элементов интерфейса.',
      'Создала образ рыжего котёнка с выразительной мимикой и мягкими формами. Тёплая палитра и детали комнаты поддерживают уютную атмосферу.',
      'Отрисовала набор иконок и их состояний, кнопки и шкалы потребностей питомца.'],
    slides: [AP_BASE + 'assets/tamagotchi-1.webp', AP_BASE + 'assets/tamagotchi-2.webp', AP_BASE + 'assets/tamagotchi-3.webp'] }
];
const modal = $('#modal'), mStage = $('#mStage'), mCols = $('#mCols'), mThumbs = $('#mThumbs'), mNav = $('#mNav'), mTitle = $('#mTitle span');
let cw = null, idx = 0, opener = null, busy = false;

function buildSlides() {
  mStage.innerHTML = ''; mThumbs.innerHTML = '';
  cw.slides.forEach((src, i) => {
    const s = document.createElement('div'); s.className = 'slide'; s.innerHTML = `<img src="${src}" alt="${cw.title}, кадр ${i + 1}" draggable="false">`;
    mStage.appendChild(s);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'thumb'; b.setAttribute('aria-label', 'Кадр ' + (i + 1));
    b.innerHTML = `<img src="${src}" alt="">`; b.addEventListener('click', () => go(i));
    mThumbs.appendChild(b);
  });
  mNav.classList.toggle('is-single', cw.slides.length < 2);
}
function arrows() { $('#mPrev').disabled = idx <= 0; $('#mNext').disabled = !cw || idx >= cw.slides.length - 1; }
function show(i) {
  const slides = $$('.slide', mStage), thumbs = $$('.thumb', mThumbs);
  slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
  thumbs.forEach((t, k) => t.classList.toggle('is-active', k === i));
  const t = thumbs[i]; if (t) mThumbs.scrollTo({ left: t.offsetLeft - (mThumbs.clientWidth - t.offsetWidth) / 2 });
  idx = i; arrows();
}
function go(i) { if (!cw || cw.slides.length < 2 || i < 0 || i >= cw.slides.length || i === idx) return; show(i); }

const preloaded = new Set();
function preload(n, count) { WORKS[n].slides.slice(0, count || 2).forEach(src => { if (preloaded.has(src)) return; preloaded.add(src); const im = new Image(); im.decoding = 'async'; im.src = src; }); }
function openModal(n, from) {
  cw = WORKS[n]; opener = from; idx = 0;
  mTitle.textContent = nb(cw.title);
  const mLink = $('#mLink'); if (mLink) { mLink.hidden = !cw.link; if (cw.link) mLink.href = cw.link; }
  mCols.style.gridTemplateColumns = cw.w.map(x => x + 'fr').join(' ');
  mCols.innerHTML = cw.cols.map((t, i) => `<p style="--d:${(.35 + i * .1).toFixed(2)}s">${nb(t)}</p>`).join('');
  buildSlides();
  document.body.classList.add('lock'); if (lenis) lenis.stop();
  modal.classList.add('is-open');
  const first = $$('.slide', mStage)[0]; first.classList.add('is-active');
  $$('.thumb', mThumbs)[0]?.classList.add('is-active'); arrows(); mThumbs.scrollLeft = 0; modal.scrollTop = 0;
  setTimeout(() => $('#mClose').focus({ preventScroll: true }), 50);
}
function closeModal() {
  modal.classList.remove('is-open'); document.body.classList.remove('lock'); if (lenis) lenis.start();
  if (opener) opener.focus({ preventScroll: true });
}
$$('.work').forEach(b => { b.addEventListener('click', () => openModal(+b.dataset.work, b)); ['pointerenter', 'focus', 'touchstart'].forEach(ev => b.addEventListener(ev, () => preload(+b.dataset.work, 3), { passive: true })); });
/* первые кадры всех работ грузим заранее, когда страница свободна */
(window.requestIdleCallback || (f => setTimeout(f, 1800)))(() => WORKS.forEach((_, n) => preload(n, 1)));
$('#mClose').addEventListener('click', closeModal);
$('#mPrev').addEventListener('click', () => go(idx - 1));
$('#mNext').addEventListener('click', () => go(idx + 1));
/* свайп по кадру */
let px = null;
mStage.addEventListener('pointerdown', e => { px = e.clientX; });
mStage.addEventListener('pointerup', e => { if (px === null) return; const d = e.clientX - px; px = null; if (Math.abs(d) > 50) go(idx + (d < 0 ? 1 : -1)); });

addEventListener('keydown', e => {
  if (!modal.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeModal();
  else if (e.key === 'ArrowRight') go(idx + 1);
  else if (e.key === 'ArrowLeft') go(idx - 1);
});
}   /* конец: модалка */

/* ---------- видео «Обо мне» ---------- */
if ($('#play') && $('#vmodal')) {
const vm = $('#vmodal'), vp = $('#vPlayer');
$('#play').addEventListener('click', e => {
  const src = e.currentTarget.dataset.video;
  if (!src) return say('Видео появится здесь совсем скоро');
  vp.src = src; vm.classList.add('is-open'); document.body.classList.add('lock'); if (lenis) lenis.stop(); vp.play().catch(() => {});
});
function closeVideo() { vm.classList.remove('is-open'); document.body.classList.remove('lock'); if (lenis) lenis.start(); vp.pause(); }
$('#vClose').addEventListener('click', closeVideo);
vm.addEventListener('click', e => { if (e.target === vm) closeVideo(); });

addEventListener('keydown', e => { if (vm.classList.contains('is-open') && e.key === 'Escape') closeVideo(); });
}   /* конец: видео */

/* ---------- копирование контактов ---------- */
$$('[data-copy]').forEach(a => a.addEventListener('click', async e => {
  if (e.metaKey || e.ctrlKey || e.button) return;
  e.preventDefault();
  const txt = a.dataset.copy;
  try { await navigator.clipboard.writeText(txt); say('Скопировано: ' + txt); return; } catch (err) { /* пробуем запасной способ */ }
  try {
    const t = document.createElement('textarea'); t.value = txt; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(t); t.select(); const ok = document.execCommand('copy'); t.remove();
    if (ok) { say('Скопировано: ' + txt); return; }
  } catch (err) { /* ниже откроем ссылку */ }
  location.href = a.href;
}));

};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
