//hakua varten
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'API TÄHÄN'
    }
};

//kuuntelija napille
document.querySelector('button').addEventListener('click', () => {
    //luetaan annetut valinnat:
    const yearU = document.getElementById('year').value;
    const langU = document.querySelector('input[name="kieli"]:checked').value;
    const genreU = document.getElementById('genre').value;
    const pointsU = document.querySelector('input[name="points"]:checked').value;
    //tehdään vielä muuttujat valintojen käsittelylle
    let releaseYearStart = 1970;
    let releaseYearEnd = 2020;
    let spokenLanguage = '';  // fi tai tyhjä
    let minRating = 4;
    let maxRating = 7;

    //kielen käsittely
    if (langU == 'kotimainen') {
        spokenLanguage = "fi"
    } else {
        spokenLanguage = ''
    }

    switch (yearU) { //vuosikymmenen aloitus ja lopetusvuodet
        case '1':
            releaseYearStart = 1850;
            releaseYearEnd = 1959;
            break;
        case '2':
            releaseYearStart = 1960;
            releaseYearEnd = 1969;
            break;
        case '3':
            releaseYearStart = 1970;
            releaseYearEnd = 1979;
            break;
        case '4':
            releaseYearStart = 1980;
            releaseYearEnd = 1989;
            break;
        case '5':
            releaseYearStart = 1990;
            releaseYearEnd = 1999;
            break;
        case '6':
            releaseYearStart = 2000;
            releaseYearEnd = 2009;
            break;
        case '7':
            releaseYearStart = 2010;
            releaseYearEnd = 2019;
            break;
        case '8':
            releaseYearStart = 2020;
            releaseYearEnd = 2024;
            break;

        default:
            releaseYearStart = 1850;
            releaseYearEnd = 2024;
            break;
    }
    //arvioinnit:
    switch (pointsU) {
        case 'Huono':
            minRating = 0
            maxRating = 3
            break;
        case 'OK':
            minRating = 4
            maxRating = 7
            break;
        case 'Hyvä':
            minRating = 8
            maxRating = 10
            break;

        default:
            minRating = 0
            maxRating = 10
            break;
    }

    fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fi-FI&include_image_language=fi,en&page=1&sort_by=popularity.desc&primary_release_date.gte=' + releaseYearStart + '-01-01&primary_release_date.lte=' + releaseYearEnd + '-12-31&with_original_language=' + spokenLanguage + '&with_genres=' + genreU + '&vote_average.gte=' + minRating + '&vote_average.lte=' + maxRating, options)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            console.log(data.total_results)
            const totalResults = data.total_results;

            // Tarkista, että saadut tulokset eivät ole tyhjiä
            if (totalResults > 0) {
                // Arvotaan satunnainen sivu
                const randomPage = Math.floor(Math.random() * (Math.ceil(totalResults / 20))) + 1;

                // Hae elokuvat valitulta sivulta
                fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fi-FI&page=' + randomPage + '&sort_by=popularity.desc&primary_release_date.gte=' + releaseYearStart + '-01-01&primary_release_date.lte=' + releaseYearEnd + '-12-31&with_original_language=' + spokenLanguage + '&with_genres=' + genreU + '&vote_average.gte=' + minRating + '&vote_average.lte=' + maxRating, options)

                    .then(response => response.json())
                    .then(data => {
                        // Varmista, että saadut tulokset eivät ole tyhjiä
                        if (data.results && data.results.length > 0) {
                            //arvotaan elokuva saadusta max 20 elokuvasta
                            let random_number = Math.floor(Math.random() * data.results.length);
                            console.log(random_number);
                            console.log(data.results);
                            const selectedMovie = data.results[random_number];

                            document.querySelector('#title').innerHTML = selectedMovie.title;

                            // Tarkista, onko elokuvalla kuvaa
                            if (selectedMovie.poster_path) {
                                document.querySelector('#kuva').src = `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`;
                            } else {
                                // Käytä oletuskuvaa, jos elokuvalla ei ole kuvaa
                                document.querySelector('#kuva').src = '../images/No-Image-Placeholder.svg.png';
                            }

                            document.querySelector('#linkki').innerHTML = `<a href="https://www.themoviedb.org/movie/${selectedMovie.id}" target="_blank">TheMovieDatabase-linkki</a>`;
                        } else {
                            alert('Ei tuloksia valituilla suodattimilla.');
                        }
                    })
                    .catch(error => console.error('Virhe:', error));
            } else {
                alert('Ei tuloksia valituilla suodattimilla.');
            }
        })
        .catch(error => console.error('Virhe:', error));

})