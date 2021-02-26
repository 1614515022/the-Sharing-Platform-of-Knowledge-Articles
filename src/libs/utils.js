import $ from 'jquery'
function getSibiling(elem){
    let  r = [];   
    let  n = elem.parentNode.firstChild; 
    for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
            r.push(n);
        }
    }
    return r;
}

function getNowTime(){
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    if(month<10){
        month = '0'+month;
    }
    if(day<10){
        month = '0'+month;
    }
     return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second
}

const delay = (function() {  
	let timer = 0;  
	return function(callback, ms) {    
		clearTimeout(timer);    
		timer = setTimeout(callback, ms);  
	};
})();

function createNode(nodeText){
    return $('<li>' + nodeText + '</li>')
}


export{
    getSibiling,getNowTime,delay,createNode
}