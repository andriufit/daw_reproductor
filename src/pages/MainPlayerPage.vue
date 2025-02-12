<template>
    <div class="main-player-container">
        <div v-show="searchDataStore.loadSearch == true">
            <div v-for="(soundData, key) in soundsData" class="song-element">
                <div class="song-img">
                    <img :src="soundData.images ? soundData.images.spectral_m : ''">
                </div>
                <div class="song-info">
                    <div class="song-info-name">
                        <label>{{  soundData.name }}</label>
                    </div>

                    <div class="song-info-data">
                        <label>{{ soundData.username }}</label>
                        <label>{{ soundData.duration }}s</label>
                        <label>{{ soundData.created }}</label>
                    </div>
                </div>
                <div class="song-buttons">
                    <i class="bi bi-info-circle btn-song-info"></i>
                    <i class="bi bi-play-circle btn-song-play" @click="changeCurrentSong(key)"></i>
                </div>
            </div>

            <div ref="loadTrigger" v-if="nextPage">Cargando más sonidos...</div>
        </div>

        <div class="loading-gif-container" v-show="searchDataStore.loadSearch == false">
            <loadingComponent></loadingComponent>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import { useSoundDataStore } from '../stores/soundData';
import { useSearchStore } from '@/stores/search';
import loadingComponent from '@/components/loadingComponent.vue';
import apiService from '../services/apiService';

const searchDataStore = useSearchStore();
const soundDataStore = useSoundDataStore();

let soundsData = ref({});
let timeOutId = 0;
let nextPage = ref(null);
const loadTrigger = ref(null);

watch(
    () => searchDataStore.searchText,
    () => {
        searchDataStore.loadSearch = false;
        if(timeOutId != 0){
            clearTimeout(timeOutId)
            timeOutId = 0;
        }
        timeOutId = setTimeout(getSoundsData, 1000);
    }
);

onMounted(async () => {  
    getSoundsData().then(() => setupObserver());
});

const getSoundsData = async (url = null) => {
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

const setupObserver = () => {
    nextTick(() => {
        if (!loadTrigger.value) return;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextPage.value) {
                getSoundsData(nextPage.value);
            }
        }, { rootMargin: "100px" });
        observer.observe(loadTrigger.value);
    });
};

const changeCurrentSong = (key) => {
    soundDataStore.soundName = soundsData.value[key].name;
    soundDataStore.soundImg = soundsData.value[key].images.spectral_m;
    soundDataStore.soundUrl = soundsData.value[key].previews["preview-hq-mp3"];
};
</script>