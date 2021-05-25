const passport = require("passport");



  		// function readClicked(){


      //     $.ajax({
      //       url: "/read",
      //       type: "GET",
      //       data: {},
      //       success: function(data){
      //         if (!data.retVal)
      //           alert("bad read");
      //         else {

      //       if (data.retVal.volleyball)
      //         $("#volleyball").prop("checked",true);
      //       else
      //         $("#volleyball").prop("checked",false);

      //       if (data.retVal.basketball)
      //         $("#basketball").prop("checked",true);
      //       else
      //         $("#basketball").prop("checked",false);

      //       if (data.retVal.soccer)
      //         $("#soccer").prop("checked",true);
      //       else
      //         $("#soccer").prop("checked",false);

      //           $("#grade").val(data.retVal.grade);

      
      //           alert("good read");
      //         }
      //       } ,     
      //       dataType: "json"
      //     });     
  		//   return false;
  		// }
      

      // function updateClicked(){

      //     $.ajax({
      //       url: "/update",
      //       type: "PUT",            

      //       data: {
      //       grade:$("#grade").val(),volleyball:$("#volleyball").prop("checked"),basketball:$("#basketball").prop("checked"),
      //       soccer:$("#soccer").prop("checked")

      //       },
      //       success: function(data){
      //         if (!data.retVal)
      //           alert("bad update");
      //         else
      //           alert("good update");
      //       } ,     
      //       dataType: "json"
      //     });     
      //   return false;
      // }

 		
function logoutClicked(){
	$.get("/logout",function(data){
		window.location = data.redirect;
	});
	return false;             
}

function changeClicked(){
  console.log(passport)
  $.ajax({
    url: "/changepsw",
    type: "PUT",            

    data: {
    password:$("#changepswBox").val()
    },
    success: function(data){
      if (!data.retVal)
        alert("bad update");
      else
        alert("good update");
        // window.location = data.redirect;
        // password = $("#changepswBox").val();

    } ,     
    dataType: "json"
  });     
return false;
}

  function createClicked(){
    $.get("/createclick",function(data){
		window.location = data.redirect;
	});
  


  }

$(document).ready(function(){ 
  console.log("session ready");
//  $("#createButton").click(createClicked);
  // $("#readButton").click(readClicked);
  // $("#updateButton").click(updateClicked);
   $("#passwordChange").click(changeClicked);
   $("#createGame").click(createClicked);
   $("#joinGame").click(joinClicked)
   //  $("#deleteButton").click(deleteClicked);

  // $("#changepswBox").keydown( function( event ) {
  //   console.log("working")
  //   if ( event.which === 13 ) {
  //     console.log("workin1g")
  //     changeClicked();
  //     event.preventDefault();
  //     return false;
  //   }});
	$.get("/userInfo",function(data){
      console.log("in userInfo");
		if (data.retVal.name) {
      // // console.log(data.retVal.grade);
      // // console.log(data.retVal.volleyball);
      // // console.log(data.retVal.basketball);
      // // console.log(data.retVal.soccer);
			// $("#session").html("Session " + data.retVal.name + " " + data.retVal.ident);

      // if (data.retVal.volleyball)
      //   $("#volleyball").prop("checked",true);
      // else
      //   $("#volleyball").prop("checked",false);

      // if (data.retVal.basketball)
      //   $("#basketball").prop("checked",true);
      // else
      //   $("#basketball").prop("checked",false);

      // if (data.retVal.soccer)
      //   $("#soccer").prop("checked",true);
      // else
      //   $("#soccer").prop("checked",false);

      // $("#grade").val(data.retVal.grade);

      

    }
	});

	$("#logout").click(logoutClicked);

  $("form").submit(function(event)
  {
//        if ($("#identifier").val() == "") {
//          alert("NO ID");
//          return false;
//        }
//        if ($("#name").val() == "") {
//          alert("NO NAME");
//          return false;
//        }

  
    return false;
  })



});  		
    


