$(document).ready(function() {
    var song = $('data').val();
    var user = $('#user').val();
    var genres = ['g.21', 'g.5', 'g.394', 'g.156', 'g.146']
    var key = 'NjY4YzkwMWUtNGIzMS00ZGZmLWE2NGQtMTJhNWI5MTFhYzhk'
    $('.ui.search').search({
        type: 'category',
        minCharacters: 1,
        apiSettings: {
            url: `https://cors-anywhere.herokuapp.com/http://api.napster.com/v2.2/search?apikey=${key}&query={query}&type=track`,
            onResponse: function(napsterResponse) {
                var response = {
                    results: {}
                };

                if (!napsterResponse || !napsterResponse.search.data.tracks) {
                    return;
                }
                $.each(napsterResponse.search.data.tracks, function(index, item) {
                    var
                        artist = item.artistName || 'Unknown',
                        maxResults = 8;
                    if (index >= maxResults) {
                        return false;
                    }
                    // create new language category
                    if (response.results[artist] === undefined) {
                        response.results[artist] = {
                            name: artist,
                            results: []
                        };
                    }
                    // add result to category
                    response.results[artist].results.push({
                        title: item.name,
                        url: '/spotify/tracks/' + item.id
                    });
                });
                return response;
            }
        }
    })
    console.log(song)
    var test = song.split(' ', )
    console.log(test)
    console.log(typeof(song))
    for (let i = 0; i < test.length; i++) {
        $.get(`http://api.napster.com/v2.2/tracks/${test[i]}?apikey=${key}`).done(function(info) {
            $.get(`https://api.napster.com/v2.2/albums/${info.tracks[0].albumId}/images?apikey=${key}`).done(function(album) {
                $.get(`/spotify/tracks/user/${test[i]}/likebutton`).done(function(likebutton) {
                    let htmlString = ""
                    if (user.id == song.liked_others) {
                        htmlString += '<div id=likedprofiles>'
                        htmlString += `<div class='column'><div class='ui center aligned segment'>`
                        htmlString += `<div class='image'><a href='/spotify/tracks/${test[i]}/'><img src=${album.images[0].url}></a></div>`
                        htmlString += `<div class='content'><div class='header'>${info.tracks[0].artistName}</div>`
                        htmlString += `<div ='header'>${info.tracks[0].name}</div>`
                        htmlString += `<div ='header'>${info.tracks[0].albumName}</div>`
                        htmlString += likebutton
                        htmlString += '</div></div></div>'
                    }
                    $('#likedsongs').append(htmlString)
                })
            })
        })
    }
})