/* the following is used to ensure the namespaces exist */

if(typeof Carnix.Neverwinter === "undefined"){
	Carnix.Neverwinter = {};
}

/*	@name			Cloaks
 *	@author			Michael Langford
 *	@namespace 		Carnix.Cloaks
 *	@description	Class constructor for the Cloak Empire Citizen Information Center
 *	@requires		jQuery 1.7+
 *	@this			window
 */

Carnix.Neverwinter = function(config){
	static: {};
	config: {};
	this.config = $.extend(true,this.config,config);
	this.config = $.extend(true,this.config,this.static);
}


Carnix.Neverwinter.prototype.getDateFromString = function(str){
	var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
	var pattern = "^([a-zA-Z]{3})\\s*(\\d{2}),\\s*(\\d{4})$";
	var re = new RegExp(pattern);
	var DateParts = re.exec(str).slice(1);
	var Year = DateParts[2];
	var Month = $.inArray(DateParts[0].toLowerCase(), months);
	var Day = DateParts[1];
	return new Date(Year, Month, Day);
};

Carnix.Neverwinter.prototype.applyRowNumbers = function(str){
	/* the table is too long for this to run -- it crashes FF bigtime, probably IE too, but who the hell cares about IE users anyway -- the weak (or stupid in this case) shall perish. */
	var $rows = $("#roster_table tbody tr");
	var row_length = $rows.length;
	var increment = 1;
	for(var i=0; i<row_length; i++){
		var $row = $($rows[i]);
		if($row.is(":visible")){
			var element = $row.get(0);
			var td = element.firstChild;
			console.log(td,i,increment);
			td.innerHTML = increment;
//						console.log($row.get(),i,increment);
//						$row.get().firstChild.innerHTML(increment);
			increment++;
		}
	}
};

Carnix.Neverwinter.prototype.ExecuteSearch = function(value,type){
	$("#roster_table tbody tr").removeClass("hide");
	if(value.length > 0){
		var $results = $("#roster_table tbody tr[data-"+type+"*='"+value+"']");
		$("#roster_table tbody tr").not($results).addClass("hide");
	}
},

Carnix.Neverwinter.prototype.TableHandlers = function(){
	var stupidtable = $("#roster_table").stupidtable({
		"date":function(a,b){
			aDate = this.getDateFromString(a);
			bDate = this.getDateFromString(b);
			return aDate - bDate;
		}
	});

	stupidtable.bind('aftertablesort', function (event, data) {
		var th = $(this).find("th");
		th.find(".arrow").remove();
		var arrow = data.direction === "asc" ? "↑" : "↓";
		th.eq(data.column).append('<span class="arrow">' + arrow +'</span>');
		//this.applyRowNumbers();
	});


	$("#filtertext").on('change', $.proxy(function(event){
		var value = $("#filtertext").val();
		var type = $("#filtertype").val();
		this.ExecuteSearch(value,type);
		//this.applyRowNumbers();
	},this));
}

/* Helpers */
//Extends jQuery to provide a case-insenstive version of the :contains psudo-selector.
//Useage: $("element:contains_nocase(string_to_search_for)")
if($().jquery.split(".")[0]*1<2&&$().jquery.split(".")[1]*1<8){
	jQuery.expr[':'].contains_nocase = function(a, i, m) {
	    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
	};
}else{//jQuery 1.8+
	jQuery.expr[":"].contains_nocase = jQuery.expr.createPseudo(function(arg){
	    return function(e){
	        return jQuery(e).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
	    };
	});
}
