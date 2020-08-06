var Carnix = {}; Carnix.Classes = {};

Carnix.Classes.AutoPlayer = function(config){
	this.Class={
		static: {
			playlist: [],
			currentSong: 0
		},

		init: function(config){
			this.config = $.extend(true,this.config,config);
			this.config = $.extend(true,this.static,config);
			return this; // return a reference to the Class.
		},

		resetPlaylist: function(){
			this.config.playlist = [];
			$(".playlist-list").empty();
			$(".playlist-selector").each(function(index,element){
				$(this).prop('checked', false);
			});
		},

		savePlaylist: function(){
			localStorage["carnixPlaylist"] = "";
			localStorage["carnixPlaylist"] = JSON.stringify(this.config.playlist);
		},

		loadPlaylist: function(){
			this.config.playlist = JSON.parse(localStorage["carnixPlaylist"]);
			$.each(this.config.playlist, $.proxy(function(index,item){
				$(".track[data-play='" + item +"']").prev().prop('checked', true);
				this.UpdatePlaylist(item);
			},this));
		},

		loadRecommendedPlaylist: function(){
			this.resetPlaylist();
			
			$(".track.recommended").each($.proxy(function(item,element){
				this.config.playlist.push($(element).data("play"));
			},this));
			
			$.each(this.config.playlist, $.proxy(function(index,item){
				$(".track[data-play='" + item +"']").prev().prop('checked', true);
				this.UpdatePlaylist(item);
			},this));
		},

		Player: function(){

			$('.playlist-list li').on('dragover.Carnix.PlaylistDragOver',function(event){
				console.log("dragover! ", event.target);
				event.preventDefault();
				event.stopPropagation();
			});

			$('.playlist-list li').on('dragenter.Carnix.PlaylistDragEnter',function(event){
				console.log("dragenter! ", event.target);

				event.preventDefault();
				event.stopPropagation();
			});

			$('.playlist-list li').on('dragstart.Carnix.PlaylistDrop',function(event){
				console.log("dragstart! ", event.target);
				event.dataTransfer.effectAllowed = 'move';
				event.dataTransfer.setData('text/html', event.target.innerHTML);
				event.preventDefault();
				event.stopPropagation();
			});

			$('.playlist-list li').on('drop.Carnix.PlaylistDrop',function(event){
				console.log("Drop! ", event.target);
				event.preventDefault();
				event.stopPropagation();
			});


			$(".savePlaylist").on("click.Carnix.SavePlaylistButton",$.proxy(function(event){
				this.savePlaylist();
			},this));

			$(".loadPlaylist").on("click.Carnix.LoadPlaylistButton",$.proxy(function(event){
				this.resetPlaylist();
				this.loadPlaylist();
			},this));

			$(".loadRecommendedPlaylist").on("click.Carnix.LoadRecommendedPlaylistButton",$.proxy(function(event){
				this.resetPlaylist();
				this.loadRecommendedPlaylist();
			},this));

			$(".resetPlaylist").on("click.Carnix.ResetPlaylistButton", $.proxy(function(event){
				this.resetPlaylist();
			},this));
			$(".resetPlaylist").trigger("click.Carnix.ResetPlaylistButton");

			$(".track").on("click.Carnix.PlayIndiviualFile", $.proxy(function(event){
				var mp3file = $(event.target)[0].href;
				$(".player-control").remove();
				$(event.target).after('<div class="player-control"><audio controls autoplay="true"><source src="'+mp3file+'" type="audio/mpeg"></audio></div>');
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

					$(".playlistPlayer-control audio").on("ended.HTML5PlaylistPlay.songEnded",$.proxy(function(event){
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
					},this));
				}
				return false;			
			},this));

			$(".playlist-selector").change($.proxy(function(event){
				var songURL = $(event.target).next().data("play");
				if(event.target.checked){
					this.config.playlist.push(songURL);
					this.UpdatePlaylist(songURL);
				}
				else{
					var index = this.config.playlist.indexOf(songURL);
					this.config.playlist.splice(index, 1);
				}
			},this));
		},

		UpdatePlaylist:  function(){
			$(".playlist-list").empty();
			$.each(this.config.playlist,function(index,item){
				$(".playlist-list").append('<li class="list-group-item" draggable="true">' + item + '</li>');
			});
		}
	};
	return this.Class.init(config);
};

Carnix.Classes.Base = function(config){
	this.Class={
		config:{},

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
