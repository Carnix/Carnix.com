Carnix.AutoPlayer = function(config){
	this.static = {
		playlist: [],
		currentSong: 0		
	};
	this.config = {};
	this.config = $.extend(true,this.config,config);
	this.config = $.extend(true,this.config,this.static);
};


Carnix.AutoPlayer.prototype.resetPlaylist = function(){
	console.log(this);
	this.config.playlist = [];
	$(".playlist-list").empty();
	$(".playlist-selector").each(function(index,element){
		$(this).prop('checked', false);
	});
};

Carnix.AutoPlayer.prototype.savePlaylist = function(){
	localStorage["carnixPlaylist"] = "";
	localStorage["carnixPlaylist"] = JSON.stringify(this.config.playlist);
};

Carnix.AutoPlayer.prototype.loadPlaylist = function(){
	this.config.playlist = JSON.parse(localStorage["carnixPlaylist"]);
	$.each(this.config.playlist, $.proxy(function(index,item){
		$(".track[data-play='" + item +"']").prev().prop('checked', true);
		this.UpdatePlaylist(item);
	},this));
};

Carnix.AutoPlayer.prototype.loadRecommendedPlaylist = function(){
	$(".track.recommended").each($.proxy(function(item,element){
		this.config.playlist.push($(element).data("play"));
	},this));
	
	$.each(this.config.playlist, $.proxy(function(index,item){
		$(".track[data-play='" + item +"']").prev().prop('checked', true);
		this.UpdatePlaylist(item);
	},this));
};

Carnix.AutoPlayer.prototype.resetPlaylist = function(){
	$(".playlist-list").empty();
	this.config.playlist = [];
	$(".track").prev().prop('checked', false);
};

Carnix.AutoPlayer.prototype.UpdatePlaylist = function(){
	$(".playlist-list").empty();
	$.each(this.config.playlist,function(index,item){
		$(".playlist-list").append('<li class="list-group-item" draggable="true">' + item + '</li>');
	});
};

Carnix.AutoPlayer.prototype.Player = function(){
	this.PlayerEvents();
	$(".resetPlaylist").trigger("click.Carnix.ResetPlaylistButton");
};

Carnix.AutoPlayer.prototype.PlayerEvents = function(){
	this.Save();
	this.Load();
	this.Clear();
	this.PlayTrack();
	this.PlayList();
	this.RecommendedList();
	this.Check();
	this.DragEvents();
};

Carnix.AutoPlayer.prototype.PlayTrack = function(){
	$(".track").on("click.Carnix.PlayIndiviualFile", $.proxy(function(event){
		var mp3file = this.config.mp3prefix + $(event.target).data("play");
		var wmafile = $(event.target).attr("href");
		$(".player-control").remove();
		$(event.target).after('<div class="player-control"><audio controls autoplay><source src="'+mp3file+'" type="audio/mpeg"></audio></div>');
		return false;
	},this));
};

Carnix.AutoPlayer.prototype.Save = function(){
	$(".savePlaylist").on("click.Carnix.SavePlaylistButton",$.proxy(function(event){
		this.savePlaylist();
	},this));
};

Carnix.AutoPlayer.prototype.Load = function(){
	$(".loadPlaylist").on("click.Carnix.LoadPlaylistButton",$.proxy(function(event){
		this.resetPlaylist();
		this.loadPlaylist();
	},this));
};

Carnix.AutoPlayer.prototype.RecommendedList = function(){
	$(".loadRecommendedPlaylist").on("click.Carnix.LoadRecommendedPlaylistButton",$.proxy(function(event){
		this.resetPlaylist();
		this.loadRecommendedPlaylist();
	},this));
};

Carnix.AutoPlayer.prototype.Clear = function(){
	$(".resetPlaylist").on("click.Carnix.ResetPlaylistButton", $.proxy(function(event){
		this.resetPlaylist();
	},this));
};

Carnix.AutoPlayer.prototype.DragEvents = function(){
	$('.playlist-list li').on('dragover.Carnix.PlaylistDragOver',function(event){
		event.preventDefault();
		event.stopPropagation();
	});

	$('.playlist-list li').on('dragenter.Carnix.PlaylistDragEnter',function(event){
		event.preventDefault();
		event.stopPropagation();
	});

	$('.playlist-list li').on('dragstart.Carnix.PlaylistDrop',function(event){
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/html', event.target.innerHTML);
		event.preventDefault();
		event.stopPropagation();
	});

	$('.playlist-list li').on('drop.Carnix.PlaylistDrop',function(event){
		event.preventDefault();
		event.stopPropagation();
	});
};

Carnix.AutoPlayer.prototype.PlayList = function(){
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
};

Carnix.AutoPlayer.prototype.Check = function(){
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
};
