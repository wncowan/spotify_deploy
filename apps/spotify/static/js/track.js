$(document).ready(function() {
    var key = 'NjY4YzkwMWUtNGIzMS00ZGZmLWE2NGQtMTJhNWI5MTFhYzhk'
    $('.ui.search').search({
        type          : 'category',
        minCharacters : 1,
        apiSettings   : {
            url        : `https://cors-anywhere.herokuapp.com/http://api.napster.com/v2.2/search?apikey=${key}&query={query}&type=track`,
            onResponse : function(napsterResponse) {
            var response = {
                results : {}
            };
            
            if(!napsterResponse || !napsterResponse.search.data.tracks) {
                return;
            }
            $.each(napsterResponse.search.data.tracks, function(index, item) {
                var
                artist   = item.artistName || 'Unknown',
                maxResults = 8
                ;
                if(index >= maxResults) {
                return false;
                }
                // create new language category
                if(response.results[artist] === undefined) {
                response.results[artist] = {
                    name    : artist,
                    results : []
                };
                }
                // add result to category
                response.results[artist].results.push({
                title       : item.name,
                url         : '/spotify/tracks/' + item.id
                });
            });
            return response;
            }
        }
    });
    var track_id = $("data").val();
    var key = 'NjY4YzkwMWUtNGIzMS00ZGZmLWE2NGQtMTJhNWI5MTFhYzhk'
    $.get(`http://api.napster.com/v2.2/tracks/${track_id}?apikey=${key}`, function(track) {
        $.get(`https://api.napster.com/v2.2/albums/${track.tracks[0].albumId}/images?apikey=${key}`, function(album) {
            $("#album-picture").attr("src",album.images[2].url);
            $("#artist-name").html(`<a href='/spotify/${track.tracks[0].artistId}/artist'>${track.tracks[0].artistName}</a>`)
            $("#track-title").text(track.tracks[0].name)
            $("#album-title").text(track.tracks[0].albumName)
            console.log(track.tracks[0].previewURL)
            $.get(`/spotify/tracks/tracks/${track_id}/likebutton`).done(function(likebutton){
                let htmlString = ""
                htmlString+= likebutton
                $('#likebutton').append(htmlString)
            })
        });
        
        $("#audio").html(`<source src='${track.tracks[0].previewURL}' type='audio/mp3'> Your browser does not support the audio element.'`)
        $.get(`http://api.napster.com/v2.2/artists/${track.tracks[0].artistId}/similar?apikey=${key}` , function(similar){
            for(let i=0; i < 25; i++){
                $.get(`${similar.artists[i].links.images.href}?apikey=${key}`, function(ArtistImage){
                    console.log(similar)
                    let str = ''
                    str+="<div class='column'>"
                    str +=`<div class='ui center aligned segment'><a href='/spotify/${similar.artists[i].id}/artist'><img src=${ArtistImage.images[2].url}></a></div>`
                    str+="<div class='item'>" + similar.artists[i].name + '</div>'
                    str += "</div>"
                    $("#similar-artists").append(str)
                })
             }
        });
    });
})
