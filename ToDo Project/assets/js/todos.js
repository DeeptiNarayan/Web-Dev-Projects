// Check off todo by clicking
$("ul").on("click", "li", function(){
	$(this).toggleClass("completed");
});


//click on X to delete Todo
$("ul").on("click", "span", function(event) {
	$(this).parent().fadeOut(500, function() {
		$(this).remove();
	});
	event.stopPropagation();
});

//add new todo
$("input[type='text']").keypress(function(event) {
	if(event.which == 13) {
		//grab text and append to li
		var todoText = $(this).val();
		$(this).val("");
		$("ul").append("<li><span><i class='fas fa-trash'></i> </span>" + todoText + "</li>");


	}
});


//add






