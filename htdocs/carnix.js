var Carnix = {}; Carnix.Classes = {};

Carnix.Classes.AutoPlayer = function(config){
	this.Class={
			config:{
			playlist: [],
			currentSong: 0
		},

		init: function(config){
			this.config = $.extend(true,this.config,config);
			this.config = $.extend(true,this.static,config);
			return this; // return a reference to the Class.
		},

		Player: function(){
			$(".track").on("click", $.proxy(function(event){
				var mp3file = this.config.mp3prefix + $(event.target).data("play");
				var wmafile = $(event.target).attr("href");
				$(".player-control").remove();
				$(event.target).after('<div class="player-control"><audio controls autoplay><source src="'+mp3file+'" type="audio/mpeg"></audio></div>');
				return false;
			},this));

			$(".startPlaylist").on("click.HTML5PlaylistPlay.ButtonClick",$.proxy(function(event){
				if(this.config.currentSong >= this.config.playlist.length){
					$(".playlistPlayer").empty().append("<strong>ERROR:	nothing on playlist.</strong>");
					this.config.currentSong = 0;
				}
				else{
					$(".playlistPlayer").empty().append("<div><strong>Now Playing:</strong> <span class='now-playing'></span></div>");
					var currentSongUrl = this.config.mp3prefix + this.config.playlist[this.config.currentSong];
					$(".now-playing").html(currentSongUrl.split("/").pop());
					$(".player-control, .playlistPlayer-control").remove();
					$(".playlistPlayer").append('<div class="playlistPlayer-control"><audio controls autoplay><source src="'+ currentSongUrl +'" type="audio/mpeg"></audio></div>');
					this.config.currentSong++;

					$(".playlistPlayer-control audio").on("ended.HTML5PlaylistPlay.songEnded",function(event){
						if(this.config.currentSong >= this.config.playlist.length){
							$(".playlistPlayer").empty();
							this.config.playlist = [];
							$(".playlist-selector:checked").prop('checked', false);
							this.config.currentSong = 0;
						}
						else{
							$(".playlistPlayer-control audio source").remove();
							var currentSongUrl = this.config.mp3prefix + this.config.playlist[this.config.currentSong];
							$(".now-playing").html(currentSongUrl.split("/").pop());
							$(".playlistPlayer-control audio").get(0).src = currentSongUrl;
							$(".playlistPlayer-control audio").get(0).load();
							$(".playlistPlayer-control audio").get(0).play();
							this.config.currentSong++;
						}
					});
				}
				return false;			
			},this));;

			$(".playlist-selector").change($.proxy(function(){
				var songURL = $(this).next().data("play");
				if(this.checked){
					this.config.playlist.push(songURL);
				}
				else{
					var index = playlist.indexOf(songURL);
					this.config.playlist.splice(index, 1);
				}
			},this));
		}
	};
	return this.Class.init(config);
};

Carnix.Classes.Base = function(config){
	this.Class={
			config:{
			playlist: [],
			currentSong: 0
		},

		init: function(config){
			this.config = $.extend(true,this.config,config);
			return this;
		},

		PageActions: function(){
			$("#menu-close").on('click.CARNIX.menuclose',$.proxy(function(event) {
					event.preventDefault();
					$("#sidebar-wrapper").toggleClass("active");
			},this));

			$("#menu-toggle").on('click.CARNIX.menutoggle',$.proxy(function(event) {
					event.preventDefault();
					$("#sidebar-wrapper").toggleClass("active");
			},this));


			$('a[href*=#]:not([href=#])').on('click.CARNIX.animate',$.proxy(function(event) {
					if (location.pathname.replace(/^\//,'') == event.target.pathname.replace(/^\//,'') || location.hostname == event.target.hostname){
						var target = $(event.target.hash);
						target = target.length ? target : $('[name=' + event.target.hash.slice(1) +']');
						if (target.length){
							$('html,body').animate({ scrollTop: target.offset().top }, 1000);
							return false;
						}
					}
			},this));

			$(".clickme").on('click.CARNIX.clickme',$.proxy(function(event){
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
	};
	return this.Class.init(config);
};
