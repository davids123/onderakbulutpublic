/* filter start */

if (document.querySelector('.open-filter')) {
    let openFilter = document.querySelector('.open-filter');
    openFilter.addEventListener('click', function (e) {
        let filter = document.querySelector('.filter-inner');
        let collapse = document.querySelector('.collapse');
        filter.querySelectorAll('.collapse').forEach((item) => {

            if (item.classList.contains('show')) {
                collapse = item;
            }
        });

        const bsCollapse = new bootstrap.Collapse(collapse);

        bsCollapse.show();

    });

    document.querySelector('#filterAcc').addEventListener('show.bs.collapse', function (e) {
        openFilter.classList.add('-active');
    });

    document.querySelectorAll('.filter-items .btn').forEach((item) => {
        item.addEventListener('click', function (e) {
            if (document.querySelector('.filter-items .btn[aria-expanded="true"]') == null) {
                openFilter.classList.remove('-active');
            }
        });
    });

}

if (document.querySelector('.select2')) {
    NiceSelect.bind(document.querySelector(".select2"));
}


if (document.querySelector('select.select2')) {
    document.querySelector('select.select2').addEventListener('change', function (e) {
        let value = e.target.value;
        setParams('sort', value);
    });
}


// if (document.querySelector('#duration-range')) {
//     var slider = document.getElementById('duration-range');

//     noUiSlider.create(slider, {
//         start: [2.07, 5.00],
//         connect: true,
//         margin: .2,
//         range: {
//             'min': 2.07,
//             'max': 5.00
//         }
//     });

//     // get slider start values
//     var values = slider.noUiSlider.get();

//     document.querySelector('#duration-range .noUi-handle-lower').innerHTML = values[0];
//     document.querySelector('#duration-range .noUi-handle-upper').innerHTML = values[1];

//     slider.noUiSlider.on('change', function (values, handle) {
//         setParams('duration', values.join('-'));
//         if (values[0] == 2.07 && values[1] == 5.00) {
//             removeParams('duration');
//             document.querySelector('[data-bs-target="#duration"').classList.remove('-selected');
//         }
//     });

//     slider.noUiSlider.on('update', function (values, handle) {
//         document.querySelector('#duration-range .noUi-handle-lower').innerHTML = values[0];
//         document.querySelector('#duration-range .noUi-handle-upper').innerHTML = values[1];
//     });
// }


function formatCustomTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return minutes + '.' + (secs < 10 ? '0' + secs : secs); // Format like MM.SS
}

if (document.querySelector('#duration-range')) {
    var slider = document.getElementById('duration-range');

    noUiSlider.create(slider, {
        start: [0.00, 5.00], // Range in minutes
        connect: true,
        margin: 0.2,
        range: {
            'min': 0.00, // 0 minutes
            'max': 5.00  // 5 minutes
        }
    });

    // Initial display values in MM.SS format
    var values = slider.noUiSlider.get();
    const initialLowerFormatted = formatCustomTime(values[0] * 60);
    const initialUpperFormatted = formatCustomTime(values[1] * 60);
    
    // Update display elements
    document.querySelector('#duration-range .noUi-handle-lower').innerHTML = initialLowerFormatted;
    document.querySelector('#duration-range .noUi-handle-upper').innerHTML = initialUpperFormatted;

    // Update URL on slider change
    slider.noUiSlider.on('change', function (values, handle) {
        const lowerValueInSeconds = values[0] * 60; // Convert lower value to seconds
        const upperValueInSeconds = values[1] * 60; // Convert upper value to seconds
        
        // Format the time for display
        const lowerFormatted = formatCustomTime(lowerValueInSeconds);
        const upperFormatted = formatCustomTime(upperValueInSeconds);
        
        // Update URL parameters while maintaining the '.' format
        if (values[0] === 0.07 && values[1] === 5.00) {
            removeParams('duration'); // Clear the parameter from the URL
        } else {
            setParams('duration', `${lowerFormatted}-${upperFormatted}`); // Use formatted values with '.'
        }

        // Update display elements to show the formatted value
        document.querySelector('#duration-range .noUi-handle-lower').innerHTML = lowerFormatted;
        document.querySelector('#duration-range .noUi-handle-upper').innerHTML = upperFormatted;
    });

    // Update slider handle displays on update
    slider.noUiSlider.on('update', function (values, handle) {
        const formattedValue = formatCustomTime(values[0] * 60); // Keep formatted as MM.SS
        const formattedValue2 = formatCustomTime(values[1] * 60); // Keep formatted as MM.SS
        
        // Update both handles to reflect the same formatted value
        document.querySelector('#duration-range .noUi-handle-lower').innerHTML = formattedValue;
        document.querySelector('#duration-range .noUi-handle-upper').innerHTML = formattedValue2; // Same as lower
    });
}




// remove filter
function removeFilter() {
    document.querySelectorAll('.selected-filters > ul > li > button').forEach((item) => {
        item.addEventListener('click', function (e) {
            let filter = item.getAttribute('data-filter');
            let value = item.getAttribute('data-value');
            document.querySelector('[data-bs-target="#' + filter + '"').classList.remove('-selected');
            removeParams(filter, value);
        });
    });

    document.querySelectorAll('.remove-filters,.remove-filters-mobile').forEach((item) => {
        item.addEventListener('click', function (e) {
            removeParams('genres');
            removeParams('moods');
            removeParams('vocals');
            removeParams('duration');
            removeParams('bpm');
            document.querySelectorAll('.remove-filters').forEach((item) => {
                item.setAttribute('hidden', true);
            });
            document.querySelectorAll('.filter-items li .btn').forEach((item) => {
                item.classList.remove('-selected');
            });
        });
    });
}



function setParams(key, value) {
    let params = [];
    const urlSearchParams = new URLSearchParams(window.location.search);

    urlSearchParams.set(key, value);
    params.push(urlSearchParams.toString());

    const query = `${location.pathname}?${params.join('&')}`;
    history.pushState(null, document.title, query);
    if (key != 'sort') {
        renderSelectedFilters();
    }
}


function addParams(key, value) {
    let params = [];
    const urlSearchParams = new URLSearchParams(window.location.search);
   
    if (urlSearchParams.has(key)) {
        let values = urlSearchParams.getAll(key);
        if (!values.includes(value)) {
            values.push(value);
        }
        urlSearchParams.delete(key);
        values.forEach((value) => {
            urlSearchParams.append(key, value);
        });
    } else {
        urlSearchParams.append(key, value);
    }

    params.push(urlSearchParams.toString());
    

    const query = `${location.pathname}?${params.join('&')}`;
    history.pushState(null, document.title, query);

    if (key != 'sort') {
        renderSelectedFilters();
    }
}


function removeParams(key, value) {
    if (value) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        let values = urlSearchParams.getAll(key);
        values = values.filter(item => item !== value);
        
        if (values.length) {
            urlSearchParams.delete(key);
            values.forEach((value) => {
                urlSearchParams.append(key, value);
            });
            const query = `${location.pathname}?${urlSearchParams}`;
            history.replaceState(null, document.title, query);
        } else {
            removeParams(key);
        }
    }
    else {
        const urlSearchParams = new URLSearchParams(window.location.search);
        if (urlSearchParams.has(key)) {
            urlSearchParams.delete(key);
            const query = `${location.pathname}?${urlSearchParams}`;
            history.replaceState(null, document.title, query);
        }
    }
    renderSelectedFilters();
}

function renderSelectedFilters() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    let selectedFilters = '';

    urlSearchParams.forEach((value, key) => {
        let bpm = key == 'bpm' ? 'BPM' : '';
        if (key != 'sort') {

            selectedFilters += `<li>
                <button class="btn btn-light fs-14 fw-semibold px-13" data-filter="${key}" data-value="${value}">
                    <span>${value} ${bpm}</span>
                    <span><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="var(--es-color-icon-primary)" class="_close_8bn3v_44"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5868 12.0028L4.00444 18.5894L5.4182 20.0041L12.0009 13.4172L18.5831 20.0009L19.9972 18.5865L13.4147 12.0025L19.9983 5.41467L18.5845 4L12.0006 10.5882L5.41406 4.00015L4 5.41452L10.5868 12.0028Z"></path></svg></span>
                </button>
            </li>`;

            document.querySelector('[data-bs-target="#' + key + '"').classList.add('-selected');
        }
        if (key == 'duration') {
            let duration = value.split('-');
            document.querySelector('#duration-range .noUi-handle-lower').innerHTML = duration[0];
            document.querySelector('#duration-range .noUi-handle-upper').innerHTML = duration[1];
            var slider = document.getElementById('duration-range');
            slider.noUiSlider.set([duration[0], duration[1]]);
        }
        if (key == 'bpm') {
            let bpm = value.split('-');
            document.querySelector('#bpm-range .noUi-handle-lower').innerHTML = bpm[0] + ' BPM';
            document.querySelector('#bpm-range .noUi-handle-upper').innerHTML = bpm[1] + ' BPM';
            var slider = document.getElementById('bpm-range');
            slider.noUiSlider.set([bpm[0], bpm[1]]);
        }
    });


    let template = `
    <ul class="d-flex flex-wrap mb-0 list-unstyled gap-1">
        ${selectedFilters}
    </ul>
    <button class="remove-filters btn btn-black-200 fs-14 fw-semibold py-10 px-13 d-none d-lg-block">
        <span>Remove filters</span>
    </button>`;

    if (selectedFilters == '') {
        template = '';
    }


    document.querySelectorAll('.selected-filters').forEach((item) => {
        item.innerHTML = template;
    });

    removeFilter();
}

renderSelectedFilters();

if (document.querySelector('.show-filter')) {
    document.querySelector('.show-filter').addEventListener('click', function (e) {
        document.querySelector('.filter').classList.add('-active');
    });
}

if (document.querySelector('.close-filter')) {
    document.querySelector('.close-filter').addEventListener('click', function (e) {
        document.querySelector('.filter').classList.remove('-active');
    });
}

/* filter end */

/* track list start */

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))



document.addEventListener('DOMContentLoaded', function () {
    const waveSurferInstances = [];
    let currentlyPlayingInstance = null;

    function stopAllOtherWaveSurferInstances(currentInstance) {
        waveSurferInstances.forEach(instance => {
            if (instance !== currentInstance && instance.isPlaying()) {
                instance.stop();
            }
        });
    }

    document.querySelectorAll('.track-item').forEach((item) => {
        const wavesurfer = WaveSurfer.create({
            container: item.querySelector('.waveform'),
            waveColor: '#404249',
            progressColor: '#ffffff',
            cursorWidth: 0,
            height: 56,
            plugins: [
                WaveSurfer.Hover.create({
                    lineColor: '#fff',
                    lineWidth: 2,
                    labelBackground: '#555',
                    labelColor: '#fff',
                    labelSize: '11px',
                }),
            ],
        });

        wavesurfer.load(item.getAttribute('data-track'));

        const btnPlay = item.querySelector('[data-action="play"]');
        const btnPause = item.querySelector('[data-action="pause"]');

        btnPlay.addEventListener('click', () => {
            wavesurfer.play()
        });

        btnPause.addEventListener('click', () => {
            item.classList.remove('-playing');
            wavesurfer.pause()
        });

        waveSurferInstances.push(wavesurfer);


        wavesurfer.on('play', () => {
            stopAllOtherWaveSurferInstances(wavesurfer);
            currentlyPlayingInstance = wavesurfer; // Track the currently playing instance
            item.classList.add('-playing');
            document.querySelectorAll('.track-item').forEach((track) => {
                if (track != item) {
                    track.classList.remove('-playing');
                }
            });

        });

        wavesurfer.on('pause', () => {
            if (currentlyPlayingInstance === wavesurfer) {
                currentlyPlayingInstance = null;
            }
        });

        wavesurfer.on('interaction', () => {
            wavesurfer.play()
            stopSingle();
        })
    });


    
    if (document.querySelector('.single-track-item')) {
        const singleTrack = WaveSurfer.create({
            container: document.querySelector('.single-track-item .waveform'),
            waveColor: '#404249',
            progressColor: '#ffffff',
            cursorWidth: 0,
            height: 56,
            plugins: [
                WaveSurfer.Hover.create({
                    lineColor: '#fff',
                    lineWidth: 2,
                    labelBackground: '#555',
                    labelColor: '#fff',
                    labelSize: '11px',
                }),
            ],
        });
        singleTrack.load(document.querySelector('.single-track-item ').getAttribute('data-track'));
        
        const btnPlay = document.querySelector('.single-track-item .btn-play');
        const btnPause = document.querySelector('.single-track-item .btn-pause');
        btnPlay.addEventListener('click', () => {
            singleTrack.play()
        });

        btnPause.addEventListener('click', () => {
            singleTrack.pause()
        });
      
        singleTrack.on('play', () => {
            document.querySelector('.single-track-item').classList.add('-playing');
           
            waveSurferInstances.forEach(instance => {
                if (instance.isPlaying()) {
                    instance.stop();
                }
            }); 
            document.querySelectorAll('.track-item').forEach((track) => {
                track.classList.remove('-playing');
            });
            
        });
       
        singleTrack.on('pause', () => {
            document.querySelector('.single-track-item').classList.remove('-playing');
        });

        document.querySelectorAll('.track-item .btn-play').forEach((item) => {
            item.addEventListener('click', function (e) {
                document.querySelector('.single-track-item').classList.remove('-playing');
                singleTrack.stop();
            });
        });

        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60)
            const secondsRemainder = Math.round(seconds) % 60
            const paddedSeconds = `0${secondsRemainder}`.slice(-2)
            return `${minutes}:${paddedSeconds}`
        }

        const timeEl = document.querySelector('#time')

        singleTrack.on('timeupdate', (currentTime) => (timeEl.textContent = formatTime(currentTime)))

        function stopSingle() {
            singleTrack.stop();
        }

    }

    // single-track-mobile
    if (document.querySelector('.single-track-mobile')) {

        var container = document.createElement('div');
        container.id = 'waveform';
        container.classList.add('d-none');
        document.body.appendChild(container);

        // Initialize WaveSurfer
        var singleTrackMobile = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'violet',
            progressColor: 'purple'
        });

        singleTrackMobile.load(document.querySelector('.single-track-mobile ').getAttribute('data-track'));

        const btnPlay = document.querySelector('.single-track-mobile .btn-play');
        const btnPause = document.querySelector('.single-track-mobile .btn-pause');
        btnPlay.addEventListener('click', () => {
            singleTrackMobile.play()
        });

        btnPause.addEventListener('click', () => {
            singleTrackMobile.pause()
        });

        singleTrackMobile.on('play', () => {
            document.querySelector('.single-track-mobile').classList.add('-playing');
            waveSurferInstances.forEach(instance => {
                if (instance.isPlaying()) {
                    instance.stop();
                }
            });
            document.querySelectorAll('.track-item').forEach((track) => {
                track.classList.remove('-playing');
            });
        });

        singleTrackMobile.on('pause', () => {
            document.querySelector('.single-track-mobile').classList.remove('-playing');
        });

        document.querySelectorAll('.track-item .btn-play').forEach((item) => {
            item.addEventListener('click', function (e) {
                document.querySelector('.single-track-mobile').classList.remove('-playing');
                singleTrackMobile.stop();
            });
        });
    }
    

});



/* step form start */
if(document.querySelector('.quote-sidebar')) {
    document.querySelectorAll('.btn-next').forEach((item) => {
        item.addEventListener('click', function(e) {
            let flag = true;
            let currentStep = document.querySelector('.step-form-item.-active');
            let nextStep = currentStep.nextElementSibling;
            if(nextStep == null) {
                return;
            }
            // validate
            let template= '';
            currentStep.querySelectorAll('.validate').forEach((item) => {
                let el = item.querySelector('input');
                if(el.value == '') {
                    item.classList.add('-error');
                    flag = false;
                    template = '<li>Please fill in all required fields</li>';
                }
                else if(el.getAttribute('type') == 'email') {
                    if(!validateEmail(el.value)) {
                        item.classList.add('-error');
                        flag = false;
                        template = '<li>Please enter a valid email address</li>';
                    }
                }
                document.querySelector('.error-list').innerHTML = template;
            });
            if(flag) {
                currentStep.classList.remove('-active');
                nextStep.classList.add('-active');
            }
        });
    });
    document.querySelectorAll('.btn-prev').forEach((item) => {
        item.addEventListener('click', function(e) {
            let currentStep = document.querySelector('.step-form-item.-active');
            let prevStep = currentStep.previousElementSibling;
            if(prevStep == null) {
                return;
            }
            currentStep.classList.remove('-active');
            prevStep.classList.add('-active');
        });
    });

    const stepFormItems = document.querySelectorAll('.step-form-item');
    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if(mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if(mutation.target.classList.contains('-active')) {
                    let index = Array.from(stepFormItems).indexOf(mutation.target);
                    if (index == 3){
                        document.querySelector('.btn-next').innerText = 'Send';
                        document.querySelector('.btn-next').removeAttribute('data-bs-dismiss');
                    }
                    else if (index == 4){
                        document.querySelector('.btn-next').innerText = 'Close';
                        document.querySelector('.btn-next').setAttribute('data-bs-dismiss', 'offcanvas');
                        
                        setTimeout(() => {
                            var offcanvasElement = document.getElementById('offcanvasQuote');
                            let openedCanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                            openedCanvas.hide();    
                            let currentStep = document.querySelector('.step-form-item.-active');
                            let firstStep = document.querySelector('.step-form-item');
                            
                            if(firstStep == null) {
                                return;
                            }
                            currentStep.classList.remove('-active');
                            firstStep.classList.add('-active');

                            document.querySelectorAll('.form-check .form-check-input').forEach((item) => {
                                item.checked = false;
                            });

                            document.querySelectorAll('.step-form input, .step-form textarea').forEach((item) => {
                                item.value = '';
                            });
                           
                            document.querySelectorAll('.request-list li').forEach((item) => {
                                item.classList.remove('-active');
                            });

                        }, 2000);
                    }
                    else {
                        document.querySelector('.btn-next').innerText = 'Next';
                        document.querySelector('.btn-next').removeAttribute('data-bs-dismiss');
                    }
                }
            }
        }
    });
    stepFormItems.forEach((item) => {
        observer.observe(item, {attributes: true});
    });

    if(document.querySelector('.request-list')){
        document.querySelectorAll('.request-list .form-check-input').forEach((item) => {
            item.addEventListener('change', function(e) {
                if(e.target.checked) {
                    item.closest('li').classList.add('-active');
                }
                else {
                    item.closest('li').classList.remove('-active');
                }
            });
        })
    }


    document.querySelectorAll('.validate input').forEach((item) => {
        item.addEventListener('focus', function(e) {
            item.parentElement.classList.remove('-error');
        });
    });

    
    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}
