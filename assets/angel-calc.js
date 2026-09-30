(function(){function init(){if(!document.getElementById("go"))return;
var M={1:["New beginnings","Fresh starts, confidence and taking the lead."],2:["Balance and harmony","Partnership, patience and cooperation."],3:["Creativity and joy","Self-expression, communication and growth."],4:["Stability","Discipline, hard work and strong foundations."],5:["Change and freedom","Curiosity, adventure and movement."],6:["Love and home","Family, care and responsibility."],7:["Wisdom","Reflection, spirituality and inner growth."],8:["Abundance","Achievement, success and personal power."],9:["Completion","Generosity, compassion and letting go."],11:["Intuition (master number)","Awakening, inspiration and insight."],22:["Master builder","Big vision and building something lasting."],33:["Master teacher","Compassion, teaching and healing."]};
function red(n){while(n>9&&n!==11&&n!==22&&n!==33){n=String(n).split("").reduce(function(a,d){return a+ +d},0)}return n}
var t1=document.getElementById("t1"),t2=document.getElementById("t2"),p1=document.getElementById("p1"),p2=document.getElementById("p2"),res=document.getElementById("res"),mode=1;
function tab(m){mode=m;t1.classList.toggle("on",m==1);t2.classList.toggle("on",m==2);p1.hidden=m!=1;p2.hidden=m!=2;res.classList.remove("on")}
t1.onclick=function(){tab(1)};t2.onclick=function(){tab(2)};
document.getElementById("go").onclick=function(){
var s=0,v;
if(mode==1){v=document.getElementById("dob").value;if(!v){alert("Please choose your date of birth.");return}
s=v.replace(/\D/g,"").split("").reduce(function(a,d){return a+ +d},0)}
else{v=document.getElementById("nm").value.toUpperCase().replace(/[^A-Z]/g,"");if(!v){alert("Please enter your name.");return}
for(var i=0;i<v.length;i++)s+=v.charCodeAt(i)-64}
var n=red(s),mo,nmv;
if(mode==1){mo=+document.getElementById("dob").value.split("-")[1];nmv=document.getElementById("nm1").value.trim()}
else{mo=+document.getElementById("mo").value;nmv=document.getElementById("nm").value.trim().split(/\s+/)[0]}
var B={1:["Garnet","#9b1c31"],2:["Amethyst","#8a5cc7"],3:["Aquamarine","#7fd4e6"],4:["Diamond","#e6f3ff"],5:["Emerald","#1f9e63"],6:["Pearl","#f1ece4"],7:["Ruby","#c2133a"],8:["Peridot","#a7c93b"],9:["Sapphire","#1f4fbf"],10:["Opal","#dfe9f5"],11:["Citrine","#f0a91e"],12:["Turquoise","#2fbfb3"]};
document.getElementById("jd").textContent=n+"-diamond design: one diamond for each step of your number "+n+", set in a pendant, bracelet or ring.";
var jn=document.getElementById("jn");
document.getElementById("jnli").hidden=!nmv;
if(nmv)jn.textContent="Name necklace: "+nmv+" in gold or silver, with "+n+" small diamonds as accents.";
var bl=document.getElementById("jbli");bl.hidden=!mo||!B[mo];
if(mo&&B[mo]){document.getElementById("jb").textContent="Birthstone: "+B[mo][0]+". Pair it with your number for a personal piece.";document.getElementById("jbc").style.background=B[mo][1]}
document.getElementById("num").textContent=n;
document.getElementById("ttl").textContent=M[n][0];
document.getElementById("mean").textContent=M[n][1];
res.classList.add("on");
};
}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();})();