(function () {
  "use strict";
  const STORAGE_KEY = "dash-dine-db-v1";
  const defaultFilters = () => ({ search:"", location:"all", cuisine:"all", sodium:1000, satFat:12, minCalories:400, includeUnknown:true, takeout:false, sort:"best", restaurant:null });
  const state = { data: loadData(), filters: defaultFilters() };
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const restaurantById = id => state.data.restaurants.find(r => r.id === id);
  const dishesForRestaurant = id => state.data.dishes.filter(d => d.restaurantId === id);
  const isCatalogOnly = restaurant => restaurant?.menuReviewStatus === "pending" && dishesForRestaurant(restaurant.id).length === 0;

  function cloneStarter(){ return JSON.parse(JSON.stringify(window.STARTER_DATA)); }
  function loadData(){
    try {
      const raw=localStorage.getItem(STORAGE_KEY);
      if(raw){
        const parsed=JSON.parse(raw);
        if(validateData(parsed)){
          const starter=cloneStarter();
          if((parsed.meta.version||0)<(starter.meta.version||0)){
            const restaurantIds=new Set(parsed.restaurants.map(r=>r.id));
            const oldPaneraSource=/\/c3-26-nutrition-guide-bof\.pdf$/;
            parsed.dishes=parsed.dishes.filter(d=>!(d.id==="panera-wrap"&&oldPaneraSource.test(d.sourceUrl||"")));
            const correctedDishIds=new Set(["panera-half-goddess","panera-half-harvest","panera-fuji"]);
            starter.dishes.forEach(fresh=>{
              if(!correctedDishIds.has(fresh.id))return;
              const existing=parsed.dishes.find(d=>d.id===fresh.id);
              if(existing&&oldPaneraSource.test(existing.sourceUrl||""))Object.assign(existing,fresh);
            });
            const dishIds=new Set(parsed.dishes.map(d=>d.id));
            starter.restaurants.forEach(r=>{
              if(!restaurantIds.has(r.id)){parsed.restaurants.push(r);return;}
              const existing=parsed.restaurants.find(item=>item.id===r.id);
              if(existing?.menuReviewStatus==="pending"&&r.menuReviewStatus==="partial"){
                existing.menuReviewStatus="partial";
                existing.catalogStatus=r.catalogStatus;
                existing.cuisine=r.cuisine;
                existing.menuUrl=r.menuUrl;
                existing.menuEvidenceVerified=r.menuEvidenceVerified;
              }
            });
            starter.dishes.forEach(d=>{if(!dishIds.has(d.id))parsed.dishes.push(d);});
            parsed.meta={...parsed.meta,version:starter.meta.version,reviewed:starter.meta.reviewed,note:starter.meta.note};
            localStorage.setItem(STORAGE_KEY,JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch(e){}
    return cloneStarter();
  }
  function validateData(data){ return data && data.meta && Array.isArray(data.restaurants) && Array.isArray(data.dishes); }
  function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); const status=$("#storageStatus"); if(status) status.textContent="Saved locally"; }
  function formatDate(date){ if(!date) return "Not recorded"; const d=new Date(date+"T12:00:00"); return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}); }
  function confidenceLabel(type){ return ({official:"Published",calculated:"Official components",estimate:"Estimate",unknown:"Unknown*"})[type] || "Unknown*"; }
  function isTakeout(r){ return r && r.service.some(s => /takeout|delivery|fast casual/i.test(s)); }
  function nutritionValue(value, unit, approximate=false){ if(value===null || value==="" || typeof value==="undefined") return "Unknown*"; return `${approximate ? "≈" : ""}${Number(value).toLocaleString()}${unit}`; }

  function scoreDish(d){
    const known=d.sodium!==null && d.satFat!==null;
    const caloriesKnown=d.calories!==null;
    let score=({official:48,calculated:42,estimate:18,unknown:5})[d.sourceType]||5;
    if(known){
      score += Math.max(0,28-(d.sodium/state.filters.sodium)*18);
      score += Math.max(0,18-(d.satFat/state.filters.satFat)*12);
      if(d.sodium<=state.filters.sodium) score+=10; else score-=25;
      if(d.satFat<state.filters.satFat) score+=10; else score-=25;
    }
    if(caloriesKnown){
      if(d.calories>=state.filters.minCalories) score+=10+Math.min(8,(d.calories-state.filters.minCalories)/50);
      else score-=20;
      const usefulCalories=Math.min(d.calories,800);
      if(known&&d.sodium>0) score+=Math.min(8,(usefulCalories/d.sodium)*8);
    }
    if((d.tags||[]).some(t=>/vegetable|fiber|plant|whole grain/i.test(t))) score+=5;
    if(d.modification) score+=2;
    return score;
  }
  function fitFor(d){
    if(d.sodium===null || d.satFat===null) return {label:"Needs verification*",cls:"unknown"};
    if(d.calories===null) return {label:"Calories unknown*",cls:"unknown"};
    if(d.sodium<=state.filters.sodium && d.satFat<state.filters.satFat && d.calories>=state.filters.minCalories) return {label:d.sourceType==="estimate"?"Estimated fit":"Best fit",cls:"strong"};
    if(d.sodium<=state.filters.sodium*1.2 && d.satFat<=state.filters.satFat+2) return {label:"Flexible fit",cls:"flex"};
    return {label:"Above current limit",cls:"over"};
  }
  function visibleDishes(){
    const f=state.filters, q=f.search.trim().toLowerCase();
    let dishes=state.data.dishes.filter(d=>{
      const r=restaurantById(d.restaurantId); if(!r) return false;
      const unknown=d.sodium===null || d.satFat===null || d.calories===null;
      if(f.restaurant && d.restaurantId!==f.restaurant) return false;
      if(f.location!=="all" && !r.cities.includes(f.location)) return false;
      if(f.cuisine!=="all" && r.cuisine!==f.cuisine) return false;
      if(f.takeout && !isTakeout(r)) return false;
      if(unknown && !f.includeUnknown) return false;
      if(!unknown && (d.sodium>f.sodium || d.satFat>=f.satFat)) return false;
      if(d.calories!==null && d.calories<f.minCalories) return false;
      if(q && ![d.name,d.description,r.name,r.cuisine,...(d.tags||[])].join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
    dishes.sort((a,b)=>{
      if(f.sort==="name") return restaurantById(a.restaurantId).name.localeCompare(restaurantById(b.restaurantId).name)||a.name.localeCompare(b.name);
      if(f.sort==="sodium") return (a.sodium??99999)-(b.sodium??99999);
      if(f.sort==="calories") return (b.calories??-1)-(a.calories??-1);
      if(f.sort==="recent") return (b.verified||"").localeCompare(a.verified||"");
      return scoreDish(b)-scoreDish(a);
    });
    return dishes;
  }
  function eligibleRestaurants(){
    const f=state.filters, q=f.search.trim().toLowerCase();
    return state.data.restaurants.filter(r=>{
      if(f.location!=="all"&&!r.cities.includes(f.location))return false;
      if(f.cuisine!=="all"&&r.cuisine!==f.cuisine)return false;
      if(f.takeout&&!isTakeout(r))return false;
      if(q){ const dishes=state.data.dishes.filter(d=>d.restaurantId===r.id); if(![r.name,r.cuisine,...dishes.map(d=>`${d.name} ${d.description}`)].join(" ").toLowerCase().includes(q)) return false; }
      return true;
    });
  }

  function renderFilters(){
    const preferred=["Rockville","Gaithersburg","Bethesda","North Bethesda"];
    const found=[...new Set(state.data.restaurants.flatMap(r=>r.cities))];
    const locations=["all",...preferred.filter(x=>found.includes(x)),...found.filter(x=>!preferred.includes(x)).sort()];
    $("#locationChips").innerHTML=locations.map(loc=>`<button class="chip ${state.filters.location===loc?"active":""}" data-location="${loc}">${loc==="all"?"All":loc}</button>`).join("");
    const cuisines=[...new Set(state.data.restaurants.map(r=>r.cuisine))].sort();
    $("#cuisineSelect").innerHTML=`<option value="all">All cuisines</option>${cuisines.map(c=>`<option ${state.filters.cuisine===c?"selected":""}>${esc(c)}</option>`).join("")}`;
    const restaurants=state.data.restaurants.slice().sort((a,b)=>a.name.localeCompare(b.name)||a.cities.join(" ").localeCompare(b.cities.join(" ")));
    $("#restaurantSelect").innerHTML=`<option value="all">All restaurants</option>${restaurants.map(r=>`<option value="${esc(r.id)}" ${state.filters.restaurant===r.id?"selected":""}>${esc(r.name)} — ${esc(r.cities.join(" / "))}${isCatalogOnly(r)?" · menu review pending":""}</option>`).join("")}`;
    $("#datasetDate").textContent=formatDate(state.data.meta.reviewed);
  }
  function renderRestaurants(dishes){
    const counts=dishes.reduce((acc,d)=>(acc[d.restaurantId]=(acc[d.restaurantId]||0)+1,acc),{});
    const restaurants=eligibleRestaurants().sort((a,b)=>(counts[b.id]||0)-(counts[a.id]||0)||a.name.localeCompare(b.name));
    const allCount=dishes.length;
    const selected=state.filters.restaurant?restaurantById(state.filters.restaurant):null;
    const featured=restaurants.slice(0,39);
    if(selected&&!featured.some(r=>r.id===selected.id))featured.unshift(selected);
    const cards=[`<button class="restaurant-card ${state.filters.restaurant===null?"active":""}" data-restaurant="all" role="listitem"><span class="restaurant-icon">All</span><strong>All restaurants</strong><small>${restaurants.length.toLocaleString()} matching places · use the selector for the full catalog</small><span class="restaurant-count">${allCount} reviewed ${allCount===1?"dish":"dishes"}</span></button>`];
    featured.forEach(r=>{ const count=counts[r.id]||0; const pending=isCatalogOnly(r); cards.push(`<button class="restaurant-card ${state.filters.restaurant===r.id?"active":""}" data-restaurant="${esc(r.id)}" role="listitem" title="${esc(r.address||r.name)}"><span class="restaurant-icon">${esc(r.name.slice(0,1))}</span><strong>${esc(r.name)}</strong><small>${esc(r.cuisine)} · ${esc(r.cities.join(" / "))}</small><span class="restaurant-count ${pending?"catalog-count":""}">${pending?"Menu review pending":`${count} reviewed ${count===1?"dish":"dishes"}`}</span></button>`); });
    $("#restaurantStrip").innerHTML=cards.join("");
  }
  function dishCard(d,index){
    const r=restaurantById(d.restaurantId), fit=fitFor(d), approx=d.sourceType==="calculated";
    const sourceClass=d.sourceType==="official"?"official":d.sourceType==="calculated"?"calculated":d.sourceType==="estimate"?"estimate":"unknown";
    return `<article class="dish-card">
      <div class="dish-card-top"><span class="rank">#${index+1}</span><span class="fit-badge ${fit.cls}">${fit.label}</span></div>
      <h3>${esc(d.name)}${d.sourceType==="unknown"?"*":""}</h3><p class="restaurant-line">${esc(r.name)} · ${esc(r.cities.join(" / "))}</p>
      <p class="description">${esc(d.description)}</p>
      ${d.locationApplicability?`<p class="availability-note">${esc(d.locationApplicability)}</p>`:""}
      <div class="nutrition-row"><div class="nutrition-cell ${d.sodium===null?"unknown-cell":""}"><strong>${nutritionValue(d.sodium," mg",approx)}</strong><small>Sodium</small></div><div class="nutrition-cell ${d.satFat===null?"unknown-cell":""}"><strong>${nutritionValue(d.satFat," g",approx)}</strong><small>Sat. fat</small></div><div class="nutrition-cell ${d.calories===null?"unknown-cell":""}"><strong>${nutritionValue(d.calories,"",approx)}</strong><small>Calories</small></div></div>
      <p class="modification"><strong>Order it this way</strong>${esc(d.modification)}</p>
      <div class="card-footer"><span class="confidence-pill ${sourceClass}">${confidenceLabel(d.sourceType)}</span><div><a class="source-link" href="${esc(d.sourceUrl)}" target="_blank" rel="noopener">Source ↗</a> <button class="more-button" data-detail="${esc(d.id)}">Details</button></div></div>
    </article>`;
  }
  function renderEmptyState(selected,dishes){
    const catalogOnly=selected&&isCatalogOnly(selected);
    const areaDirectoryOnly=catalogOnly&&selected.evidenceBasis==="Official area dining directory";
    $("#emptyIcon").textContent=catalogOnly?"◎":"⌕";
    $("#emptyTitle").textContent=catalogOnly?`${selected.name} is in the verified restaurant directory`:"No matches at these limits";
    $("#emptyCopy").textContent=areaDirectoryOnly?"A current official area or restaurant directory listed this location when reviewed. Its menu and nutrition have not yet been reviewed, so it is not ranked or presented as a DASH-friendly recommendation.":catalogOnly?"This location is supported by Montgomery County restaurant and inspection records, but its menu, public access, current opening status, and nutrition have not been reviewed. It is not ranked or presented as a DASH-friendly recommendation.":"Try lowering the calorie minimum, raising the sodium limit, including unknown nutrition, or clearing the restaurant selection.";
    const meta=$("#emptyMeta"),source=$("#emptySource"),reset=$("#emptyReset");
    meta.hidden=!catalogOnly;
    meta.textContent=catalogOnly?`${selected.address} · ${areaDirectoryOnly?"directory checked":"latest matched inspection"} ${formatDate(selected.verified)}`:"";
    source.hidden=!catalogOnly;
    source.href=catalogOnly?selected.sourceUrl:"#";
    source.textContent=areaDirectoryOnly?"Open directory source ↗":"Open county source ↗";
    reset.textContent=catalogOnly?"Back to all restaurants":"Reset filters";
    $("#emptyState").hidden=dishes.length>0;
  }
  function render(){
    renderFilters(); const dishes=visibleDishes(); const matchingRestaurants=eligibleRestaurants(); renderRestaurants(dishes);
    const restaurantCount=state.filters.restaurant?1:matchingRestaurants.length;
    $("#resultSummary").textContent=`${restaurantCount.toLocaleString()} matching ${restaurantCount===1?"restaurant":"restaurants"} · ${dishes.length.toLocaleString()} reviewed ${dishes.length===1?"dish":"dishes"}`;
    const selected=state.filters.restaurant?restaurantById(state.filters.restaurant):null;
    $("#dishHeading").textContent=selected?`Best fits at ${selected.name}`:"Best-fit dishes";
    $("#dishGrid").innerHTML=dishes.map(dishCard).join(""); renderEmptyState(selected,dishes);
  }
  function resetFilters(){ state.filters=defaultFilters(); syncControls(); render(); }
  function syncControls(){ $("#searchInput").value=state.filters.search; $("#restaurantSelect").value=state.filters.restaurant||"all"; $("#cuisineSelect").value=state.filters.cuisine; $("#sodiumRange").value=state.filters.sodium; $("#satFatRange").value=state.filters.satFat; $("#calorieRange").value=state.filters.minCalories; $("#unknownToggle").checked=state.filters.includeUnknown; $("#takeoutToggle").checked=state.filters.takeout; $("#sortSelect").value=state.filters.sort; updateRangeOutputs(); }
  function updateRangeOutputs(){ $("#sodiumOutput").textContent=`≤ ${Number(state.filters.sodium).toLocaleString()} mg`; $("#satFatOutput").textContent=`< ${state.filters.satFat} g`; $("#calorieOutput").textContent=state.filters.minCalories===0?"No minimum":`≥ ${state.filters.minCalories} kcal`; }
  function showDetail(id){
    const d=state.data.dishes.find(x=>x.id===id),r=d&&restaurantById(d.restaurantId); if(!d||!r)return; const fit=fitFor(d),approx=d.sourceType==="calculated";
    $("#detailDialog").innerHTML=`<form method="dialog"><button class="dialog-close" aria-label="Close">×</button></form><div class="detail-hero"><p class="eyebrow">${esc(r.cuisine)} · ${esc(r.cities.join(" / "))}</p><h2>${esc(d.name)}${d.sourceType==="unknown"?"*":""}</h2><span class="fit-badge ${fit.cls}">${fit.label}</span></div><div class="detail-content"><div class="detail-meta"><div><strong>${nutritionValue(d.sodium," mg",approx)}</strong><small>Sodium</small></div><div><strong>${nutritionValue(d.satFat," g",approx)}</strong><small>Saturated fat</small></div><div><strong>${nutritionValue(d.calories," kcal",approx)}</strong><small>Calories</small></div><div><strong>${confidenceLabel(d.sourceType)}</strong><small>Evidence</small></div></div><div class="detail-columns"><div class="detail-box"><h3>Why it’s here</h3><p>${esc(d.description)}</p></div><div class="detail-box"><h3>Ordering notes</h3><p>${esc(d.modification)}</p></div></div><p><strong>${esc(r.name)}</strong><br><span class="detail-disclaimer">${esc(r.address)} · ${esc((r.service||[]).join(" · "))}</span></p>${d.locationApplicability?`<p class="detail-disclaimer"><strong>Location note:</strong> ${esc(d.locationApplicability)}.</p>`:""}<p class="detail-disclaimer">Verified ${formatDate(d.verified)}. ${d.sourceType==="calculated"?"The total is the sum of official component values; actual scoops vary.":d.sourceType==="unknown"?"Complete sodium and saturated-fat facts were not found in the reviewed restaurant source; calories are shown only when the source published them. This is not a verified DASH-friendly choice.":d.sourceType==="estimate"?"This is a user-entered estimate, not a restaurant-published value.":"Values are for the restaurant’s standard published serving; preparation and availability may vary."}</p><p><a class="primary-button source-link" href="${esc(d.sourceUrl)}" target="_blank" rel="noopener">Open ${esc(d.sourceLabel||"source")} ↗</a></p></div>`;
    $("#detailDialog").showModal();
  }
  function toast(message){ const el=$("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2400); }

  function openAdmin(){ renderAdmin(); $("#adminDialog").showModal(); }
  function renderAdmin(){
    $("#adminDishList").innerHTML=state.data.dishes.slice().sort((a,b)=>restaurantById(a.restaurantId)?.name.localeCompare(restaurantById(b.restaurantId)?.name)||a.name.localeCompare(b.name)).map(d=>`<div class="admin-row"><span><strong>${esc(d.name)}${d.sourceType==="unknown"?"*":""}</strong><small>${esc(restaurantById(d.restaurantId)?.name||"Missing restaurant")}</small></span><span><small>Evidence</small>${confidenceLabel(d.sourceType)}</span><span><small>Sodium</small>${d.sodium===null?"Unknown":d.sodium+" mg"}</span><span class="row-actions"><button class="icon-button" data-edit-dish="${esc(d.id)}" aria-label="Edit ${esc(d.name)}">✎</button><button class="icon-button delete" data-delete-dish="${esc(d.id)}" aria-label="Delete ${esc(d.name)}">×</button></span></div>`).join("");
    $("#adminRestaurantList").innerHTML=state.data.restaurants.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(r=>`<div class="admin-row"><span><strong>${esc(r.name)}</strong><small>${esc(r.cities.join(" / "))}</small></span><span><small>Cuisine</small>${esc(r.cuisine)}</span><span><small>Dishes</small>${state.data.dishes.filter(d=>d.restaurantId===r.id).length}</span><span class="row-actions"><button class="icon-button" data-edit-restaurant="${esc(r.id)}" aria-label="Edit ${esc(r.name)}">✎</button><button class="icon-button delete" data-delete-restaurant="${esc(r.id)}" aria-label="Delete ${esc(r.name)}">×</button></span></div>`).join("");
  }
  function slug(text){ return text.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+Date.now().toString(36).slice(-4); }
  const field=(name,label,value="",opts={})=>`<label class="form-field ${opts.full?"full":""}">${label}${opts.help?`<small>${opts.help}</small>`:""}${opts.type==="textarea"?`<textarea name="${name}">${esc(value)}</textarea>`:opts.options?`<select name="${name}">${opts.options.map(o=>`<option value="${esc(o.value)}" ${o.value===value?"selected":""}>${esc(o.label)}</option>`).join("")}</select>`:`<input name="${name}" type="${opts.type||"text"}" value="${esc(value)}" ${opts.required?"required":""} ${opts.min!==undefined?`min="${opts.min}"`:""}>`}</label>`;
  function openRecordForm(type,id){
    const edit=!!id; $("#formEyebrow").textContent=type==="dish"?"Dish record":"Restaurant record"; $("#formTitle").textContent=`${edit?"Edit":"Add"} ${type}`; $("#recordForm").dataset.type=type; $("#recordForm").dataset.id=id||"";
    if(type==="dish"){
      const d=edit?state.data.dishes.find(x=>x.id===id):{};
      $("#formFields").innerHTML=field("name","Dish name",d.name||"",{required:true})+field("restaurantId","Restaurant",d.restaurantId||state.data.restaurants[0]?.id,{options:state.data.restaurants.map(r=>({value:r.id,label:r.name}))})+field("description","Menu description",d.description||"",{type:"textarea",full:true,required:true})+field("sodium","Sodium (mg)",d.sodium??"",{type:"number",min:0,help:"Leave blank if unknown"})+field("satFat","Saturated fat (g)",d.satFat??"",{type:"number",min:0,help:"Leave blank if unknown"})+field("calories","Calories",d.calories??"",{type:"number",min:0,help:"Leave blank if unknown"})+field("sourceType","Evidence type",d.sourceType||"unknown",{options:[{value:"official",label:"Restaurant-published"},{value:"calculated",label:"Calculated from official components"},{value:"estimate",label:"Estimate"},{value:"unknown",label:"Unknown*"}]})+field("verified","Verified date",d.verified||new Date().toISOString().slice(0,10),{type:"date"})+field("sourceUrl","Source URL",d.sourceUrl||"",{type:"url",full:true,required:true})+field("sourceLabel","Source label",d.sourceLabel||"Official menu",{full:true})+field("modification","Ordering modifications",d.modification||"",{type:"textarea",full:true})+field("tags","Tags, comma-separated",(d.tags||[]).join(", "),{full:true});
    } else {
      const r=edit?state.data.restaurants.find(x=>x.id===id):{};
      $("#formFields").innerHTML=field("name","Restaurant name",r.name||"",{required:true})+field("cuisine","Cuisine",r.cuisine||"",{required:true})+field("cities","Cities, comma-separated",(r.cities||[]).join(", "),{required:true,full:true})+field("service","Service types, comma-separated",(r.service||[]).join(", "),{full:true})+field("address","Address",r.address||"",{full:true})+field("sourceUrl","Official location/source URL",r.sourceUrl||"",{type:"url",full:true,required:true})+field("menuUrl","Official menu URL",r.menuUrl||"",{type:"url",full:true})+field("verified","Verified date",r.verified||new Date().toISOString().slice(0,10),{type:"date"});
    }
    $("#formDialog").showModal();
  }
  function saveRecord(event){
    event.preventDefault(); const form=event.currentTarget, type=form.dataset.type, id=form.dataset.id, values=Object.fromEntries(new FormData(form).entries());
    if(type==="dish"){
      const record={id:id||slug(values.name),restaurantId:values.restaurantId,name:values.name.trim(),description:values.description.trim(),sodium:values.sodium===""?null:Number(values.sodium),satFat:values.satFat===""?null:Number(values.satFat),calories:values.calories===""?null:Number(values.calories),sourceType:values.sourceType,verified:values.verified,sourceUrl:values.sourceUrl.trim(),sourceLabel:values.sourceLabel.trim(),modification:values.modification.trim(),tags:values.tags.split(",").map(x=>x.trim()).filter(Boolean)};
      const idx=state.data.dishes.findIndex(x=>x.id===id); if(idx>=0)state.data.dishes[idx]=record;else state.data.dishes.push(record);
    } else {
      const record={id:id||slug(values.name),name:values.name.trim(),cuisine:values.cuisine.trim(),cities:values.cities.split(",").map(x=>x.trim()).filter(Boolean),service:values.service.split(",").map(x=>x.trim()).filter(Boolean),address:values.address.trim(),sourceUrl:values.sourceUrl.trim(),menuUrl:values.menuUrl.trim()||values.sourceUrl.trim(),verified:values.verified};
      const idx=state.data.restaurants.findIndex(x=>x.id===id); if(idx>=0)state.data.restaurants[idx]=record;else state.data.restaurants.push(record);
    }
    saveData(); $("#formDialog").close(); renderAdmin(); render(); toast("Record saved locally");
  }
  function exportData(){ const blob=new Blob([JSON.stringify(state.data,null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`dash-dine-data-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url); toast("Database exported"); }
  function importData(file){ const reader=new FileReader(); reader.onload=()=>{ try{const parsed=JSON.parse(reader.result);if(!validateData(parsed))throw new Error();state.data=parsed;saveData();renderAdmin();render();toast("Database imported");}catch(e){toast("That file is not a valid Dash & Dine export");} }; reader.readAsText(file); }

  document.addEventListener("click",e=>{
    const loc=e.target.closest("[data-location]"); if(loc){state.filters.location=loc.dataset.location;state.filters.restaurant=null;render();}
    const rest=e.target.closest("[data-restaurant]"); if(rest){state.filters.restaurant=rest.dataset.restaurant==="all"?null:rest.dataset.restaurant;render();$("#dishHeading").scrollIntoView({behavior:"smooth",block:"start"});}
    const detail=e.target.closest("[data-detail]"); if(detail)showDetail(detail.dataset.detail);
    const editD=e.target.closest("[data-edit-dish]"); if(editD)openRecordForm("dish",editD.dataset.editDish);
    const editR=e.target.closest("[data-edit-restaurant]"); if(editR)openRecordForm("restaurant",editR.dataset.editRestaurant);
    const delD=e.target.closest("[data-delete-dish]"); if(delD&&confirm("Delete this dish from the local database?")){state.data.dishes=state.data.dishes.filter(d=>d.id!==delD.dataset.deleteDish);saveData();renderAdmin();render();toast("Dish deleted");}
    const delR=e.target.closest("[data-delete-restaurant]"); if(delR){const linked=state.data.dishes.filter(d=>d.restaurantId===delR.dataset.deleteRestaurant).length;if(confirm(`Delete this restaurant and its ${linked} linked dish records?`)){state.data.restaurants=state.data.restaurants.filter(r=>r.id!==delR.dataset.deleteRestaurant);state.data.dishes=state.data.dishes.filter(d=>d.restaurantId!==delR.dataset.deleteRestaurant);saveData();renderAdmin();render();toast("Restaurant deleted");}}
  });
  $("#searchInput").addEventListener("input",e=>{state.filters.search=e.target.value;state.filters.restaurant=null;render();});
  $("#restaurantSelect").addEventListener("change",e=>{state.filters.restaurant=e.target.value==="all"?null:e.target.value;render();$("#dishHeading").scrollIntoView({behavior:"smooth",block:"start"});});
  $("#cuisineSelect").addEventListener("change",e=>{state.filters.cuisine=e.target.value;state.filters.restaurant=null;render();});
  $("#sodiumRange").addEventListener("input",e=>{state.filters.sodium=Number(e.target.value);updateRangeOutputs();render();});
  $("#satFatRange").addEventListener("input",e=>{state.filters.satFat=Number(e.target.value);updateRangeOutputs();render();});
  $("#calorieRange").addEventListener("input",e=>{state.filters.minCalories=Number(e.target.value);updateRangeOutputs();render();});
  $("#unknownToggle").addEventListener("change",e=>{state.filters.includeUnknown=e.target.checked;render();});
  $("#takeoutToggle").addEventListener("change",e=>{state.filters.takeout=e.target.checked;state.filters.restaurant=null;render();});
  $("#sortSelect").addEventListener("change",e=>{state.filters.sort=e.target.value;render();});
  $("#resetFilters").addEventListener("click",resetFilters); $("#emptyReset").addEventListener("click",resetFilters);
  $("#aboutButton").addEventListener("click",()=>$("#aboutDialog").showModal()); $("#sourcesButton").addEventListener("click",()=>$("#sourcesDialog").showModal());
  $("#adminButton").addEventListener("click",openAdmin); $("#footerAdmin").addEventListener("click",openAdmin);
  $$(".admin-tabs button").forEach(btn=>btn.addEventListener("click",()=>{$$(".admin-tabs button").forEach(b=>b.setAttribute("aria-selected",String(b===btn)));$$(`.admin-panel`).forEach(p=>p.classList.toggle("active",p.dataset.panel===btn.dataset.tab));}));
  $("#addDishButton").addEventListener("click",()=>openRecordForm("dish")); $("#addRestaurantButton").addEventListener("click",()=>openRecordForm("restaurant"));
  $("#formClose").addEventListener("click",()=>$("#formDialog").close()); $("#formCancel").addEventListener("click",()=>$("#formDialog").close()); $("#recordForm").addEventListener("submit",saveRecord);
  $("#exportButton").addEventListener("click",exportData); $("#importInput").addEventListener("change",e=>{if(e.target.files[0])importData(e.target.files[0]);e.target.value="";});
  $("#restoreButton").addEventListener("click",()=>{if(confirm("Replace all local edits with the starter database?")){state.data=cloneStarter();saveData();renderAdmin();render();toast("Starter data restored");}});
  [$("#detailDialog"),$("#aboutDialog"),$("#sourcesDialog"),$("#adminDialog"),$("#formDialog")].forEach(dialog=>dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();}));
  syncControls(); render();
})();
