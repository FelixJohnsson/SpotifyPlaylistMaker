const key = 'BQBGO1oPZzQcFb2BR5quBw0ie_6gC_uWEuyEztiQ3GtUGLBbg7nV_JVIfGgdlxlRkQB_ZZ_pAU0p3RR2jhFe1eYXyjcD_mP_BcYIAil7t8YzKZobZFpFEezC8uryBConxGcmGeW7DCTbIl0nJKL2ZCs0I6fiTz8DJ_YqXdX3_yiX9fuyNmddC1JNUWMemakQyjgxxznOnPoxXrtLgExb8yhDROjMaLNFRQk5nJkJV8IY1YwMfrZND6npL0dYATawZwBG7_TfRU1NrRc'


const getUserId = () => fetch("https://api.spotify.com/v1/me", {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + key,
      "Content-Type": "application/json"
    }
  })
  .then(data => data.json())
  .then(function appendGenre(res) {
    let input = document.getElementById('input').value;

    const genreChecked = document.getElementById('genre').checked; 
    let checked = ""

    if (genreChecked === true) {checked = "genre:"}
    if (!res.error) {
      let maxOffset = Math.floor(Math.random() * 1000 + 1) - 50;
      searchSongs(res.id, input, maxOffset, checked)
    } else if (res.error.status === 401) {
      console.log(res.error.status + '  Update your access token!')
    }
  });

const searchSongs = (userId, input, maxOffset, checked) => fetch(`https://api.spotify.com/v1/search?q=${checked}${input}&type=track&limit=50&offset=${maxOffset}`, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + key,
      "Content-Type": "application/json"
    }
  })
  .then(data => data.json())
  .then(function foundSongs(res) {
    let allSongs = [];
    if (res.tracks.total !== 0) {
      res.tracks.items.forEach(el => allSongs.push(el.uri))
      createEmptyPlaylist(userId, allSongs, input)
    } else {
      console.log("Can't find that genre!")
      return;
    }
  });

const createEmptyPlaylist = (userId, allSongs, input) => fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    body: `{
    "name":"50 songs of ${input}",
    "description":"Made possible by Felix J",
    "public":false
  }`,
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + key,
      "Content-Type": "application/json"
    },
    method: "POST"
  })
  .then(data => data.json())
  .then(res => createUrlToInsertSongs(allSongs, res.id, res.external_urls.spotify));

function createUrlToInsertSongs(allSongs, playlistId, playlistURL) {
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${allSongs[0]}`

  for (let i = 1; i < allSongs.length; i++) {
    url += ',' + allSongs[i];
  }
  insertSongs(url, playlistURL)
}


const insertSongs = (url, playlistURL) => fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + key,
      "Content-Type": "application/json"
    },
    method: "POST"
  })
  .then(data => data.json())
  .then(function success(res) {
    if (res.snapshot_id) {
      const playAnchor = document.getElementById('play_button');
      playAnchor.href = playlistURL;
      const playButton = document.createElement("img");
      playButton.src = "./images/spotify-button-2.png";
      playButton.setAttribute('id', 'play_button');
      playAnchor.appendChild(playButton);
      document.getElementById('genre').value = '';
    }
  });

