//hakua varten
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'API TÄHÄN'
    }
};

//pakotetaan aloituskieleksi englanti
document.getElementById('language').value = "en";

//peliasetukset alussa
const peliAsetukset = {
    pisteet: 0,
    name: '',
    genreU: "",
    year: 1950,
    spokenLanguage: "en",
    totalResults: 0,
    fetchData: null,
    randomPage: 1,
    arvottuElokuva: null
};

//odotellaan käyttäjän syötettä nimensä osalta, olisi varmaan voinut tehdä fiksumminkin.. :D
if (peliAsetukset.name == '') {
    //piilotetaan alkunäkymästä pisteet, kuva ja vastaus divit
    document.querySelector('div#pisteOutput').style.display = "none";
    document.getElementById('kuva').src = '../images/cartoon-movie-poster-8101696_1280.png';
    document.querySelector('div#vastausInput').style.display = "none";
    //jos kieli valitaan suomeksi, piilotetaan genrevalikko, muutoin näytetään se
    document.querySelector('select#language').addEventListener('change', () => {
        const selectedValue = document.querySelector('select#language').value;
        if (selectedValue === "fi") {
            peliAsetukset.spokenLanguage = document.getElementById('language').value;
            document.querySelector('div#genreInput').style.display = "none";
        } else {
            peliAsetukset.spokenLanguage = document.getElementById('language').value;
            document.querySelector('div#genreInput').style.display = "block";
        }
    });
    //kun painetaan lähetä nappia, tallennetaan pelaajan nimi ja aloitetaan peli.
    document.querySelector('#lähetäNimi').addEventListener('click', () => {
        peliAsetukset.name = document.querySelector('#nimi').value
        peliAsetukset.genreU = document.getElementById('genre').value;
        startGame();
    })
}

const startGame = () => {
    //aloitus näkymä pois ja muut esille.
    document.querySelector('div#nimiInput').style.display = "none"
    document.querySelector('div#genreInput').style.display = "block"
    document.querySelector('div#pisteOutput').style.display = "block"
    document.querySelector('div#vastausInput').style.display = "block"
    document.querySelector('div#aloitusTeksti').innerHTML = "Noniin, " + peliAsetukset.name + " aloitetaan peli."
    document.querySelector('#pisteet').innerHTML = peliAsetukset.pisteet

    //jos kieli oli suomi, asetetaan genre tyhjäksi(hakee kaikki)
    if (peliAsetukset.spokenLanguage == 'fi') {
        peliAsetukset.genreU = ''
        console.log('genre=' + peliAsetukset.genreU)
    }

    haeData()//hakemisen lisäksi arvotaan sivu, elokuva ja tulostetaan kuva.

    //kuuntelija napille(toiminnot käyttäjän vastauksen perusteella)
    document.querySelector('#arvaa').addEventListener('click', () => {
        const arvattuVuosikymmen = parseInt(document.querySelector('#vuosikymmen').value)
        if (Math.floor(peliAsetukset.year / 10) * 10 === arvattuVuosikymmen) {
            console.log('Oikein!')
            peliAsetukset.pisteet++
            document.querySelector('div#aloitusTeksti').innerHTML = "Oikein meni, " + peliAsetukset.name + " jatketaan peliä."
            document.querySelector('#pisteet').innerHTML = peliAsetukset.pisteet
            haeData()
        } else {
            console.log('Väärin. Peli päättyi, pisteitä: ' + peliAsetukset.pisteet)
            gameover()
        }
    })
}

//datan hakeminen
const haeData = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fi-FI&vote_average.gte=5&primary_release_date.gte=1960-01-01&with_original_language=' + peliAsetukset.spokenLanguage + '&page=' + peliAsetukset.randomPage + '&sort_by=popularity.desc&with_genres=' + peliAsetukset.genreU, options);
        const data = await response.json();
        peliAsetukset.fetchData = data;
        peliAsetukset.totalResults = data.total_results;
        arvoSivu()
        arvoElokuva()
        näytäKuva()
    } catch (error) {
        alert('Ei tuloksia valituilla suodattimilla.', error);
        console.error('Virhe fetch-pyynnössä:', error);
        location.reload();
    }
}

//vastaus väärin, tulostetaan alertilla käyttäjälle ja päivitetään sivu.
const gameover = () => {
    alert("Väärin meni. Sait pisteitä: " + peliAsetukset.pisteet + ". Aloitetaan alusta!")
    location.reload();
}

//sivun arpominen datan perusteella.
const arvoSivu = () => {
    const maxPages = 500; // TMDB:n maksimisivujen määrä
    const resultsPerPage = 20; // Tulosten määrä per sivu TMDB:ssä   
    if (peliAsetukset.totalResults / resultsPerPage > maxPages) {
        peliAsetukset.randomPage = Math.floor(Math.random() * maxPages) + 1;
    } else {
        peliAsetukset.randomPage = Math.floor(Math.random() * (Math.ceil(peliAsetukset.totalResults / resultsPerPage))) + 1;
    }
}

//elokuvan arpominen kyseiseltä sivulta(20 elokuvaa/sivu.)
const arvoElokuva = () => {
    let randomIndex = Math.floor(Math.random() * 20);
    while (peliAsetukset.fetchData.results[randomIndex].poster_path == null) {
        randomIndex = Math.floor(Math.random() * 20);
    }
    peliAsetukset.arvottuElokuva = peliAsetukset.fetchData.results[randomIndex]
}

//kuvan Tulostus
const näytäKuva = () => {
    let selectedMovie = peliAsetukset.arvottuElokuva;
    peliAsetukset.year = parseInt(selectedMovie.release_date.split('-')[0]);
    //Alempaa poistamalla //-merkit saa huijauskoodit päälle(tulostaa elokuvan valmistumisvuoden konsoliin)
    //console.log(peliAsetukset.year);
    document.querySelector('#kuva').src = `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`;
}