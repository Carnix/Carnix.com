`use strict`

class Playlist {

    constructor(config){
        this.config = config;
        if(config.autorun === true){
            this.init();
        }
    }

    init(){

        this.tracks = {};

        this.SetEvents();

    }


    SetEvents(tracks){
        let items = [...document.querySelectorAll(`div#tracks a`)];

        items.forEach( item => {

            item.addEventListener("click", (event) => {
                event.preventDefault();

                
                items.forEach( item => {
                    delete item.dataset.playing;
                    if(document.getElementById('player-control')){
                        document.getElementById('player-control').remove();
                    }
                });



                item.dataset.playing = true;
                let mp3file = item.href;
                let player = `<div id="player-control"><audio controls autoplay="true"><source src="${mp3file}" type="audio/mpeg"></audio></div>`;
                item.insertAdjacentHTML('afterend', player);

            });

        });

    }

}

window.playlist = new Playlist({ 'autorun': true });