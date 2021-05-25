
let identList = [];

  		function readClicked(){


        if ($("#names").val() == null)
          return false;

console.log($("#names").val());
console.log($("select[name='names'] option:selected").index());
console.log(identList[$("select[name='names'] option:selected").index()].ident);


let zident = identList[$("select[name='names'] option:selected").index()].ident;
console.log("zident " + zident);

    $.get("/readAdmin",{ident:zident},

          function(data){
              if (!data.retVal)
                alert("bad read");
              else {
         
      
                alert("good read");
              }
            }  

          );



  		  return false;
  		}
      



 


function logoutClicked(){
	$.get("/logout",function(data){
		window.location = data.redirect;
	});
	return false;             
}


$(document).ready(function(){ 
  console.log("adminsession ready");
//  $("#createButton").click(createClicked);
  $("#readButton").click(readClicked);
   $("#deleteButton").click(deleteClicked);


	$.get("/adminInfo",function(data){
		if (data.username) {
      console.log("in adminInfo");
      $("#session").html("Admin Session " + data.username + " " + data.ident);
      identList = [];
//console.log(data.userList);
        for (let i=0;i<data.userList.length;i++) {
          console.log(data.userList[i].name);
          identList.push({ident:data.userList[i].ident});
          $('#names').append($('<option>', { value : data.userList[i].name }).text(data.userList[i].name));
        }



    }
	});

	$("#logout").click(logoutClicked);

  $("form").submit(function(event)
  {
       if ($("#identifier").val() == "") {
         alert("NO ID");
         return false;
       }
       if ($("#name").val() == "") {
         alert("NO NAME");
         return false;
       }

  
    return false;
  })


});
function deleteClicked(){
  console.log($("#names").val());
  console.log($("select[name='names'] option:selected").index());
  console.log(identList[$("select[name='names'] option:selected").index()].ident);
  
  
  let zident = identList[$("select[name='names'] option:selected").index()].ident;
  console.log("zident " + zident);
  
$.ajax({
  url: "/delete/:identifier",
  type: "DELETE",            

  data: {ident:zident},
  success: function(data){
    if (!data.retVal)
      alert("bad delete");
    else
      alert("good delete");
  } ,     
  dataType: "json"
});     
return false;
  		
}


