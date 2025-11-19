
const API_KEY = 'cc399dd7';
        const API_BASE_URL = 'https://www.omdbapi.com/';
        
        const searchInput = document.getElementById('searchInput');
        const searchDropdown = document.getElementById('searchDropdown');
        const movieDetails = document.getElementById('movieDetails');
        const movieCard = document.getElementById('movieCard');
        
        let searchTimeout;
        let currentSearchTerm = '';

        // Search functionality with debouncing
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            currentSearchTerm = searchTerm;
            
            clearTimeout(searchTimeout);
            
            if (searchTerm.length === 0) {
                hideDropdown();
                return;
            }
            
            searchTimeout = setTimeout(() => {
                searchMovies(searchTerm);
            }, 300);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) {
                hideDropdown();
            }
        });

        async function searchMovies(searchTerm) {
            showDropdown();
            showMessage('Loading...');
            
            try {
                const response = await fetch(`${API_BASE_URL}?s=${encodeURIComponent(searchTerm)}&page=1&apikey=${API_KEY}`);
                const data = await response.json();
                
                if (data.Response === 'True') {
                    displaySearchResults(data.Search);
                } else {
                    showMessage(data.Error || 'No results found');
                }
            } catch (error) {
                showMessage('Failed to fetch movies. Please try again.');
                console.error('Search error:', error);
            }
        }

        function displaySearchResults(movies) {
            searchDropdown.innerHTML = '';
            
            movies.forEach(movie => {
                const item = document.createElement('div');
                item.className = 'search-item';
                item.dataset.imdbid = movie.imdbID;
                
                const posterHtml = movie.Poster !== 'N/A' 
                    ? `<img src="${movie.Poster}" alt="${movie.Title}">`
                    : `<div class="search-item-poster-placeholder">🎬</div>`;
                
                item.innerHTML = `
                    <div class="search-item-poster">
                        ${posterHtml}
                    </div>
                    <div class="search-item-info">
                        <h3>${movie.Title}</h3>
                        <p>${movie.Year}</p>
                    </div>
                `;
                
                item.addEventListener('click', () => {
                    fetchMovieDetails(movie.imdbID);
                });
                
                searchDropdown.appendChild(item);
            });
            
            showDropdown();
        }

        async function fetchMovieDetails(imdbID) {
            hideDropdown();
            searchInput.value = '';
            movieDetails.classList.remove('show');
            
            movieCard.innerHTML = '<div class="loading">Loading movie details...</div>';
            movieDetails.classList.add('show');
            
            try {
                const response = await fetch(`${API_BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
                const movie = await response.json();
                
                if (movie.Response === 'True') {
                    displayMovieDetails(movie);
                } else {
                    movieCard.innerHTML = '<div class="message">Failed to load movie details</div>';
                }
            } catch (error) {
                movieCard.innerHTML = '<div class="message">Failed to fetch movie details. Please try again.</div>';
                console.error('Details error:', error);
            }
        }

        function displayMovieDetails(movie) {
            const posterHtml = movie.Poster !== 'N/A'
                ? `<img src="${movie.Poster}" alt="${movie.Title}">`
                : `<div class="movie-poster-placeholder">🎬</div>`;
            
            const details = [];
            
            if (movie.Genre) {
                details.push(`<div class="movie-detail-item"><span class="movie-detail-label">Genre:</span> <span class="movie-detail-value">${movie.Genre}</span></div>`);
            }
            
            if (movie.Plot && movie.Plot !== 'N/A') {
                details.push(`<div class="movie-detail-item"><span class="movie-detail-label">Plot:</span> <span class="movie-detail-value">${movie.Plot}</span></div>`);
            }
            
            if (movie.Actors) {
                details.push(`<div class="movie-detail-item"><span class="movie-detail-label">Actors:</span> <span class="movie-detail-value">${movie.Actors}</span></div>`);
            }
            
            if (movie.Writer) {
                details.push(`<div class="movie-detail-item"><span class="movie-detail-label">Writer:</span> <span class="movie-detail-value">${movie.Writer}</span></div>`);
            }
            
            if (movie.Language) {
                details.push(`<div class="movie-detail-item"><span class="movie-detail-label">Language:</span> <span class="movie-detail-value">${movie.Language}</span></div>`);
            }
            
            if (movie.Awards && movie.Awards !== 'N/A') {
                details.push(`<div class="movie-detail-item"><span class="movie-detail-label">🏆 Awards:</span> <span class="movie-detail-value">${movie.Awards}</span></div>`);
            }
            
            movieCard.innerHTML = `
                <div class="movie-content">
                    <div class="movie-poster">
                        ${posterHtml}
                    </div>
                    <div class="movie-info">
                        <h2>${movie.Title}</h2>
                        <div class="movie-meta">
                            <div class="movie-meta-item">📅 ${movie.Year}</div>
                            ${movie.Rated ? `<div class="movie-meta-item">⭐ ${movie.Rated}</div>` : ''}
                            ${movie.Released ? `<div class="movie-meta-item">Released: ${movie.Released}</div>` : ''}
                        </div>
                        <div class="movie-details-list">
                            ${details.join('')}
                        </div>
                    </div>
                </div>
            `;
            
            movieDetails.classList.add('show');
        }

        function showMessage(message) {
            searchDropdown.innerHTML = `<div class="message">${message}</div>`;
        }

        function showDropdown() {
            searchDropdown.classList.add('show');
        }

        function hideDropdown() {
            searchDropdown.classList.remove('show');
        }

        const toggle = document.querySelector(".switch input");
        let savedTheme= localStorage.getItem("theme")
        if (!savedTheme){
            savedTheme="light-mode";
            localStorage.setItem("theme","light-mode");
        }
        document.body.classList.add(savedTheme);

        toggle.checked = savedTheme==="dark-mode";



        toggle.addEventListener("change", () =>{
        if (toggle.checked) {
            document.body.classList.add("dark-mode");

            document.body.classList.remove("light-mode");
            localStorage.setItem("theme","dark-mode")
        }else{
            document.body.classList.add("light-mode");

            document.body.classList.remove("dark-mode");

            localStorage.setItem("theme","light-mode");
        }
        });