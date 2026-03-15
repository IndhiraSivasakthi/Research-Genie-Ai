async function sendRequest(){

let content=document.getElementById("content").value;
let operation=document.getElementById("operation").value;

let loader=document.getElementById("loader");
let resultDiv=document.getElementById("result");

loader.style.display="block";
resultDiv.innerHTML="";

try{

let response=await fetch("/api/research/process",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
content:content,
operation:operation
})

});

let result=await response.text();

/* convert **bold** to HTML bold */
result=result.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>");

/* convert bullet characters */
result=result.replace(/â€¢/g,"•");

/* convert new lines to HTML */
result=result.replace(/\n/g,"<br>");

resultDiv.innerHTML=result;

}catch(error){

resultDiv.innerHTML="Error connecting to AI service";

}

loader.style.display="none";

}