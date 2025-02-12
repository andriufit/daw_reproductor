<template>
<<<<<<< HEAD
    <div class="main-player-container">
        <div v-show="searchDataStore.loadSearch == true">
            <div v-for="(soundData, key) in soundsData" class="song-element">
=======
    <div class="main-player-container" @scroll="handleScroll">
        <div v-show="searchDataStore.loadSearch">
            <div v-for="(soundData, key) in soundsData" :key="key" class="song-element">
>>>>>>> 8f91dc52b4a588b14295ab2b8bdca47b262dd479
                <div class="song-img">
                    <img :src="soundData.images ? soundData.images.spectral_m : ''">
                </div>
                <div class="song-info">
                    <div class="song-info-name">
                        <label>{{ soundData.name }}</label>
                    </div>
                    <div class="song-info-data">
                        <label>{{ soundData.username }}</label>
                        <label>{{ soundData.duration }}s</label>
                        <label>{{ soundData.created }}</label>
                    </div>
                </div>
                <div class="song-buttons">
                    <i class="bi bi-info-circle btn-song-info"></i>
                    <i class="bi bi-play-circle btn-song-play" @click="setCurrentSong(key)"></i>
                </div>
            </div>
<<<<<<< HEAD

            <div ref="loadTrigger" v-if="nextPage">Cargando más sonidos...</div>
=======
>>>>>>> 8f91dc52b4a588b14295ab2b8bdca47b262dd479
        </div>
        <div class="loading-gif-container" v-show="!searchDataStore.loadSearch">
            <loadingComponent></loadingComponent>
        </div>
        Asensio
    </div>
</template>

<script setup>
<<<<<<< HEAD
import { onMounted, ref, watch, nextTick } from 'vue';
=======
import { onMounted, ref, watch } from 'vue';
>>>>>>> 8f91dc52b4a588b14295ab2b8bdca47b262dd479
import { useSoundDataStore } from '../stores/soundData';
import { useSearchStore } from '@/stores/search';
import loadingComponent from '@/components/loadingComponent.vue';
import apiService from '../services/apiService';

const searchDataStore = useSearchStore();
const soundDataStore = useSoundDataStore();

<<<<<<< HEAD
let soundsData = ref({});
let timeOutId = 0;
let nextPage = ref(null);
const loadTrigger = ref(null);
=======
let soundsData = ref([]);
let nextUrl = ref(null);
let cargaNextUrl = ref(false);
let timeOutId = 0;
>>>>>>> 8f91dc52b4a588b14295ab2b8bdca47b262dd479

watch(
    () => searchDataStore.searchText,
    () => {
        searchDataStore.loadSearch = false;
<<<<<<< HEAD
        if(timeOutId != 0){
            clearTimeout(timeOutId)
            timeOutId = 0;
        }
        timeOutId = setTimeout(fetchSounds, 1000);
    }
);

onMounted(async () => {  
    fetchSounds().then(() => initializeObserver());
});

const fetchSounds = async (url = null) => {
    let response = await apiService.getSounds(url || searchDataStore.searchText);
    if (!url) {
        soundsData.value = response.results;
    } else {
        soundsData.value.push(...response.results);
    }
    nextPage.value = response.next;

    soundsData.value.forEach(async (element, key) => {
        let data = await apiService.getsoundData(element.id);
        soundsData.value[key] = {
            ...data,
            ...soundsData.value[key]
        };
    });

    timeOutId = 0;
    searchDataStore.loadSearch = true;
};

const initializeObserver = () => {
    nextTick(() => {
        if (!loadTrigger.value) return;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextPage.value) {
                fetchSounds(nextPage.value);
            }
        }, { rootMargin: "100px" });
        observer.observe(loadTrigger.value);
    });
};

const setCurrentSong = (key) => {
    soundDataStore.soundName = soundsData.value[key].name;
    soundDataStore.soundImg = soundsData.value[key].images.spectral_m;
    soundDataStore.soundUrl = soundsData.value[key].previews["preview-hq-mp3"];
};
</script>
=======
        if (timeOutId) {
            clearTimeout(timeOutId);
        }
        timeOutId = setTimeout(getSoundsData, 1000);
    }
);

onMounted(() => {
    getSoundsData();
});

const getSoundsData = async () => {
    let response = await apiService.getSounds(searchDataStore.searchText);
    soundsData.value = response.results || [];
    nextUrl.value = response.next || null;
    
    await Promise.all(
        soundsData.value.map(async (element, key) => {
            let data = await apiService.getsoundData(element.id);
            soundsData.value[key] = { ...data, ...soundsData.value[key] };
        })
    );
    
    searchDataStore.loadSearch = true;
};

const getSoundsDataNext = async () => {
    if (cargaNextUrl.value || !nextUrl.value) return;
    
    cargaNextUrl.value = true;
    let response = await apiService.getSounds(nextUrl.value);
    if (response && response.results) {
        let newSounds = response.results;
        nextUrl.value = response.next || null;
        
        await Promise.all(
            newSounds.map(async (element) => {
                let data = await apiService.getsoundData(element.id);
                Object.assign(element, data);
            })
        );
        
        soundsData.value = [...soundsData.value, ...newSounds];
    }
    cargaNextUrl.value = false;
};

const handleScroll = (event) => {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        getSoundsDataNext();
    }
};

const changeCurrentSong = (key) => {
    soundDataStore.soundName = soundsData.value[key].name;
    soundDataStore.soundImg = soundsData.value[key].images?.spectral_m || '';
    soundDataStore.soundUrl = soundsData.value[key].previews?.["preview-hq-mp3"] || '';
};
</script>

<style scoped>
</style>
>>>>>>> 8f91dc52b4a588b14295ab2b8bdca47b262dd479
