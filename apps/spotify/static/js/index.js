$(document).ready(function(){
    var song = $('data').val();
    var genres = ['g.21', 'g.5', 'g.394', 'g.156', 'g.146']
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
    console.log(song)
    for (let index=0; index<genres.length; index++) {
        $.get(`http://api.napster.com/v2.2/genres/${genres[index]}/tracks/top?apikey=${key}&limit=5`).done(function(res) {
            for(let i=0; i < res.tracks.length; i++){
                var item = res.tracks            
                $.get(`https://api.napster.com/v2.2/albums/${item[i]['albumId']}/images?apikey=${key}`).done(function(imageRes) {
                    $.get(`/spotify/tracks/index/${item[i].id}/likebutton`).done(function(likebutton){
                        let htmlString = ""
                        htmlString+="<div class='column'>"
                        htmlString+=`<div class='ui center aligned segment'><a href="/spotify/tracks/${item[i].id}"><img src=${imageRes.images[0].url}></a></div>`
                        htmlString+="<div class='track_data'>"
                        htmlString+="<div class='item'>Name: " + item[i]['name'] + '</div>'
                        htmlString+="<div class='item'>Album: " + item[i]['albumName'] + '</div>'
                        htmlString+="<div class='item'>Artist: " + item[i]['artistName'] + ' </div>'
                        htmlString+="</div>"
                        htmlString+= likebutton
                        htmlString+="</div>"
                        $(`#genre${index}`).append(htmlString);
                    })
                });
            }
        });
    }       
})