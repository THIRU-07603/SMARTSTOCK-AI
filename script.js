const products = [
  {name:"Milk 1L",sku:"MIL-001",store:"Anna Nagar",stock:80,demand:110,days:"0.7",status:"Low Stock"},
  {name:"Wheat Bread",sku:"BRD-014",store:"Anna Nagar",stock:38,demand:31,days:"1.2",status:"Low Stock"},
  {name:"Eggs 12 Pack",sku:"EGG-120",store:"Adyar",stock:62,demand:29,days:"2.1",status:"Low Stock"},
  {name:"Cooking Oil 1L",sku:"OIL-101",store:"Velachery",stock:240,demand:75,days:"3.2",status:"Overstock"},
  {name:"Peanut Butter 500g",sku:"PBT-050",store:"Anna Nagar",stock:100,demand:2,days:"50+",status:"Slow Moving"},
  {name:"Rice 5kg",sku:"RIC-005",store:"Porur",stock:185,demand:24,days:"7.7",status:"Healthy"},
  {name:"Sugar 1kg",sku:"SUG-001",store:"Adyar",stock:120,demand:18,days:"6.7",status:"Healthy"},
  {name:"Banana 1kg",sku:"BAN-001",store:"Velachery",stock:45,demand:15,days:"3.0",status:"Healthy"},
  {name:"Coffee 200g",sku:"COF-200",store:"Porur",stock:18,demand:7,days:"2.6",status:"Low Stock"},
  {name:"Biscuits Pack",sku:"BIS-010",store:"Adyar",stock:300,demand:6,days:"50+",status:"Overstock"}
];

const pages = ["dashboard","inventory","predictions","alerts","recommendations","stores","assistant"];
const titles = {
  dashboard:"Dashboard", inventory:"Inventory Management", predictions:"Demand Prediction",
  alerts:"Stockout Alerts", recommendations:"Recommendations", stores:"Multi-Store", assistant:"AI Assistant"
};

function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.section===id));
  document.getElementById("pageTitle").textContent=titles[id];
  window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>showPage(btn.dataset.section)));
document.querySelectorAll("[data-go]").forEach(btn=>btn.addEventListener("click",()=>showPage(btn.dataset.go)));

function statusClass(status){
  if(status==="Healthy") return "healthy";
  if(status==="Low Stock") return "low";
  if(status==="Overstock") return "over";
  return "slow";
}

function renderInventory(){
  const q=(document.getElementById("inventorySearch")?.value||"").toLowerCase();
  const filter=document.getElementById("statusFilter")?.value||"all";
  const rows=products.filter(p=>{
    const matches=(p.name+p.sku+p.store).toLowerCase().includes(q);
    return matches && (filter==="all"||p.status===filter);
  });
  document.getElementById("inventoryBody").innerHTML=rows.map(p=>`
    <tr>
      <td><b>${p.name}</b></td><td>${p.sku}</td><td>${p.store}</td>
      <td><b>${p.stock}</b></td><td>${p.demand}/day</td><td>${p.days} days</td>
      <td><span class="status ${statusClass(p.status)}">${p.status}</span></td>
    </tr>`).join("");
}
renderInventory();
document.getElementById("inventorySearch").addEventListener("input",renderInventory);
document.getElementById("statusFilter").addEventListener("change",renderInventory);

function toast(text){
  const el=document.getElementById("toast");
  el.textContent=text;el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2200);
}

document.getElementById("refreshBtn").addEventListener("click",()=>{toast("Dashboard data refreshed");renderInventory();});
document.getElementById("addProduct").addEventListener("click",()=>toast("Demo mode: product form can be connected to a database later."));

document.querySelectorAll(".outline-btn").forEach(btn=>btn.addEventListener("click",()=>{
  toast(`${btn.dataset.product}: recommendation added for review`);
}));

document.querySelectorAll(".approve").forEach(btn=>btn.addEventListener("click",()=>{
  btn.textContent="Approved ✓";btn.disabled=true;toast("Recommendation approved in demo mode");
}));

const answers = {
  "reorder":"Based on the current demo data, prioritize **Milk 1L (+50 units)** and **Wheat Bread (+45 units)**. Both have high stockout risk and short supplier lead times.",
  "stockout":"The highest stockout risks are **Milk 1L (0.7 days)**, **Wheat Bread (1.2 days)** and **Eggs 12 Pack (2.1 days)**.",
  "slow":"The main slow-moving item is **Peanut Butter 500g**. It has 100 units in stock but sells only around 2 units per day. Consider reducing future orders or running a promotion.",
  "excess":"**Cooking Oil 1L** and **Biscuits Pack** are showing excess inventory in this demo. Consider holding new purchases and reviewing transfer or promotion options."
};

function getAIAnswer(text){
  const t=text.toLowerCase();
  if(t.includes("reorder")) return answers.reorder;
  if(t.includes("stockout")||t.includes("run out")) return answers.stockout;
  if(t.includes("slow")) return answers.slow;
  if(t.includes("excess")||t.includes("overstock")) return answers.excess;
  if(t.includes("store")||t.includes("transfer")) return "Adyar currently needs more attention. The demo transfer suggestions include Milk 1L from Adyar to Anna Nagar and Peanut Butter from Velachery to Porur. Review demand before approving.";
  return "I can help with reorder decisions, stockout risks, slow-moving products, overstock, and store transfers. Try asking: “What should I reorder today?”";
}

function sendChat(){
  const input=document.getElementById("chatInput");
  const text=input.value.trim(); if(!text)return;
  const box=document.getElementById("chatMessages");
  box.innerHTML += `<div class="message user"><div class="bubble">${text.replace(/[<>]/g,"")}</div></div>`;
  input.value="";
  setTimeout(()=>{
    box.innerHTML += `<div class="message ai"><div class="bubble"><b>SmartStock AI</b><br>${getAIAnswer(text)}</div></div>`;
    box.scrollTop=box.scrollHeight;
  },350);
}
document.getElementById("sendChat").addEventListener("click",sendChat);
document.getElementById("chatInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendChat();});
document.querySelectorAll(".quick-prompts button").forEach(b=>b.addEventListener("click",()=>{document.getElementById("chatInput").value=b.textContent;sendChat();}));
