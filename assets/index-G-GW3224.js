(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function r(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=r(s);fetch(s.href,a)}})();const d="https://placehold.co/210x295/1a1a2e/white?text=Sin+imagen",L=async e=>{const t=`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(e)}`,r=await fetch(t);if(!r.ok)throw new Error(`HTTP Error: ${r.status}`);return(await r.json()).map(({show:s})=>{var a,o;return{id:s.id,name:s.name,image:((a=s.image)==null?void 0:a.medium)??d,rating:((o=s.rating)==null?void 0:o.average)??null,genres:s.genres??[],status:s.status??""}})},v=async e=>{var s,a,o,c,m;const t=`https://api.tvmaze.com/shows/${e}`,r=await fetch(t);if(!r.ok)throw new Error(`HTTP Error: ${r.status}`);const n=await r.json();return{name:n.name,rating:((s=n.rating)==null?void 0:s.average)??null,image:((a=n.image)==null?void 0:a.medium)??d,imageLarge:((o=n.image)==null?void 0:o.original)??d,summary:n.summary??"",genres:n.genres??[],status:n.status??"",network:((c=n.network)==null?void 0:c.name)??((m=n.webChannel)==null?void 0:m.name)??"—"}},y=async e=>{const t=`https://api.tvmaze.com/shows/${e}/episodes`,r=await fetch(t);if(!r.ok)throw new Error(`HTTP Error: ${r.status}`);const s=(await r.json()).map(o=>{var c;return{number:o.number,season:o.season,name:o.name,rating:(c=o.rating)==null?void 0:c.average}});return Object.groupBy(s,o=>o.season)};let u="169";const g=document.querySelector("header"),l=document.querySelector(".episodes"),p=document.querySelector(".loading"),h=document.querySelector(".search-input"),i=document.querySelector(".search-results"),T=e=>e?`rating-${Math.floor(e)}`:"rating-0",E=e=>e?`Rating: ${e}`:"Sin valoración",H=e=>`
  <div class="show-poster">
    <img src="${e.imageLarge}" alt="Póster de ${e.name}" />
  </div>
  <div class="show-info">
    <div class="show-genres">
      ${e.genres.map(t=>`<span class="genre-tag">${t}</span>`).join("")}
    </div>
    <h1 class="show-title">${e.name}</h1>
    <div class="show-meta">
      ${e.rating?`<span class="show-rating">⭐ ${e.rating} / 10</span>`:""}
      <span class="show-network">${e.network}</span>
      <span class="show-status ${e.status==="Ended"?"ended":"running"}">${e.status}</span>
    </div>
  </div>
`,S=e=>`
  <div
    class="episode ${T(e.rating)}"
    title="E${String(e.number).padStart(2,"0")} · ${e.name} · ${E(e.rating)}"
  >
    ${e.number}
  </div>
`,w=(e,t)=>`
  <article class="season">
    <header class="season-header">T${t}</header>
    ${e.map(S).join("")}
  </article>
`,M=e=>`
  <button class="result-item" data-id="${e.id}">
    <img class="result-img" src="${e.image}" alt="${e.name}" />
    <div class="result-info">
      <span class="result-name">${e.name}</span>
      <span class="result-meta">
        ${e.rating?`⭐ ${e.rating}`:"Sin rating"}
        ${e.genres.length?`· ${e.genres.slice(0,2).join(", ")}`:""}
      </span>
    </div>
  </button>
`,$=async e=>{try{p.classList.remove("hidden"),g.innerHTML="",l.innerHTML="";const[t,r]=await Promise.all([v(e),y(e)]);g.setHTMLUnsafe(H(t));const n=Object.values(r).map((s,a)=>w(s,a+1));l.setHTMLUnsafe(n.join(""))}catch(t){console.error("Error al cargar la serie:",t),l.setHTMLUnsafe(`<p class="error">No se pudo cargar la serie.<br><small>${t.message}</small></p>`)}finally{p.classList.add("hidden")}};let f=null;const b=async e=>{if(e.trim().length<2){i.classList.add("hidden"),i.innerHTML="";return}try{const t=await L(e);t.length===0?i.setHTMLUnsafe('<p class="no-results">No se encontraron series</p>'):(i.setHTMLUnsafe(t.map(M).join("")),i.querySelectorAll(".result-item").forEach(r=>{r.addEventListener("click",()=>{u=r.dataset.id,h.value="",i.classList.add("hidden"),i.innerHTML="",$(u)})})),i.classList.remove("hidden")}catch(t){console.error("Error en búsqueda:",t)}};h.addEventListener("input",e=>{clearTimeout(f),f=setTimeout(()=>b(e.target.value),350)});document.addEventListener("click",e=>{e.target.closest(".search-wrapper")||i.classList.add("hidden")});$(u);
