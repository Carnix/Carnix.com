if(typeof Carnix === "undefined"){
	var Carnix = {};
	if(typeof Carnix.Classes === "undefined"){
		Carnix.Classes = {};
	}
}

Carnix.Classes.Checklist = function(config){
	this.Class={
		static:{},
		config:{
			settingsSavedMessage: "Your settings have been saved!",
			styles:{
				backgrounds:{
					border:"#cff",
					inside:"#fcf",
					defaultbg:"#fff",
					defaultborder:"#ddd"
				}
			},
			localStorageVariable: "CXListData",//variable name used to store settings
			settings:{
				columndata:[],
				numberOfColumns:0
			}
		},

		init: function(config){
			this.config = $.extend(true,this.config,config);
			this.config = $.extend(true,this.config,this.static);


			if(typeof localStorage[this.config.localStorageVariable] === "undefined"){
				localStorage[this.config.localStorageVariable] = JSON.stringify(this.config.settings);
			}
			else{
				this.config.settings = JSON.parse(localStorage[this.config.localStorageVariable]);
			}

			this.BuildUI();
			this.AttachEvents();
			return this; // return a reference to the Class.
		},

		BuildUI: function(isRebuild){
			var saveErrors = "";
			$(".list-container fieldset").empty();

			for(var i=0; i<this.config.settings.numberOfColumns; i++){
				var itemObj = this.config.settings.columndata[i];
				var column_name = itemObj.name
				var column_values = itemObj.values;
				$("#list_column_" + (i+1) + " span.name").html(column_name);

				for(var j=0; j<column_values.length; j++){
					var this_id = "column_"+i+"_item_"+j;
					var value = column_values[j];
					$("div#list_column_"+(i+1)+" fieldset").append('<input type="checkbox" name="'+this_id+'" id="'+this_id+'"><label for="'+this_id+'">'+value+'</label>');
				}
			}
			$('div.list-container').trigger('create');
			return saveErrors.length>0?false:true;
		},
		
		CheckOffItem: function(item,event){
			$item = $(item);
			var outside,inside;

			if($item.hasClass("ui-checkbox-off")){//logic is backwards here for some reason.
				outside = this.config.styles.backgrounds.border;
				inside = this.config.styles.backgrounds.inside;
			}else{
				outside = this.config.styles.backgrounds.defaultborder;
				inside = this.config.styles.backgrounds.defaultbg;
			}
			//console.log('{"background-color":'+inside+', "border": "1px "'+outside+'" solid"});')
			$item.css({
				"background-color": inside,
				"border": "1px " + outside + " solid"
			});
		},

		AllItemsChecked: function(){
			//@TODO:  This method will show some sort of YAY! thing when all the items are checked.
		},

		Configurator: function(){
			//@TODO: This method needs to get the data from localStorage and pre-populate the Settings panel if it exists, OR it needs to show the default settings otherwise.
			var numberOfColumns = 0;

			if(typeof this.config.settings.numberOfColumns !== "undefined"){
				numberOfColumns = this.config.settings.numberOfColumns;
				$("#settings_numberofcolumns").val(numberOfColumns+"");
				$("#settings_numberofcolumns-button span").html(numberOfColumns);
			}

			for(var i=0; i<numberOfColumns; i++){
				var itemObj = this.config.settings.columndata[i];
				var column_name = itemObj.name
				var column_values = itemObj.values;
				$("#column_name_"+i).val(column_name);
				var value_strings = column_values.toString().replace(",","\n","gm");
				$("#column_items_"+i).val(value_strings);
			}

			$("#settings_numberofcolumns").on("change",$.proxy(function(event){
				//this.Configurator.showSettingFields();
			},this));

		},

		ShowSysMsg: function(message){
			$("span.sys-message-text").html(message);
			$("div.sys-message").animate({top:'0px'}, {queue: true, duration: 500})
				.delay(3000)
				.animate({top:'-500px'},{queue: true, duration: 3000}, function(){
					$("span.sys-message-text").empty();
				});
		},

		SaveSettings: function($item,event){
			var saveErrors = "";
			this.config.settings.numberOfColumns = ($("#settings_numberofcolumns").val() * 1);//make sure it's a number
			this.config.settings.columndata = [];
			for(var i=0; i<this.config.settings.numberOfColumns; i++){
				this.config.settings.columndata[i] = {
					"name": $("input#column_name_"+i).val(),
					"values": $("textarea#column_items_"+i).val().split("\n")
				};
			}
			localStorage[this.config.localStorageVariable] = JSON.stringify(this.config.settings);
			this.ShowSysMsg(this.config.settingsSavedMessage);
			this.BuildUI(true);
			return saveErrors.length>0?false:true;
		},

		AttachEvents: function(){
			$(".ui-checkbox").on("click",$.proxy(function(event){
				$this = event.target;
				this.CheckOffItem($this,event);
			},this));

			$('.settings-icon').on("click.CXList.Directly",$.proxy(function(event){
				$this = event.target;
				this.Configurator($this,event);
			},this));

			$('.settings-icon').on("tap",$.proxy(function(event){
				$('.settings-icon').trigger("click.CXList.Directly");
			},this));

			$('.settings-icon').on("click.CXList.Triggered",$.proxy(function(event){
				$('html, body').stop().animate({
					scrollTop: 0
				}, 500, 'swing');
			},this));

			$("div.configurator a.btn-save").on("click",$.proxy(function(){
				if(!this.SaveSettings()){
					//error handling?
				}
				$('.settings-icon').trigger("click.CXList.Triggered");
			},this));

			$("div.configurator a.btn-cancel").on("click",$.proxy(function(){
				$('.settings-icon').trigger("click.CXList.Triggered");
			},this));

		}
	};
	return this.Class.init(config);
};
