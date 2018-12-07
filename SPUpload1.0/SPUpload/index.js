// window.onload = function() {
//     var a = document.getElementById('bb');

//     function cc() {
//         a.style.height = (a.offsetWidth * 1.7)+'px';
//     }
//     cc();
// }
// var a=$('#bb');
// var newheight=a.offsetWidth * 1.7;
$(document).ready(function(){
	var a=$('#bb')[0];
	var newheight=a.offsetWidth * 1.7;
	$('#bb').height(newheight);

});

