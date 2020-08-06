var Carnix = function(config){
	this.static = {};
	this.config = {};
	this.config = $.extend(true,this.config,config);
	this.config = $.extend(true,this.config,this.static);
	this.config.this = this;
};

Carnix.prototype.SetHandlers = function(){
	$("#menu-close").on('click.CARNIX',$.proxy(function(event) {
			event.preventDefault();
			$("#sidebar-wrapper").toggleClass("active");
	},this));

	$("#menu-toggle").on('click.CARNIX',$.proxy(function(event) {
			event.preventDefault();
			$("#sidebar-wrapper").toggleClass("active");
	},this));


	$('a[href*=#]:not([href=#])').on('click.CARNIX',$.proxy(function(event) {
			if (location.pathname.replace(/^\//,'') == event.target.pathname.replace(/^\//,'') || location.hostname == event.target.hostname){
				var target = $(event.target.hash);
				target = target.length ? target : $('[name=' + event.target.hash.slice(1) +']');
				if (target.length){
					$('html,body').animate({ scrollTop: target.offset().top }, 1000);
					return false;
				}
			}
	},this));

	$(".clickme").on('click.CARNIX',$.proxy(function(event){
		event.preventDefault();
		$this = $(event.target);
		var currentText = $this.html();
		if(currentText != "See?"){
			$this.html("See?");
		}else{
			$this.html("Click Me!");
		}
	},this));
}