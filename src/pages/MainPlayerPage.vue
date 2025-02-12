<template>
    <div class="main-player-container" @scroll="handleScroll">
        <div v-show="searchDataStore.loadSearch">
            <div v-for="(soundData, key) in soundsData" :key="key" class="song-element">
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
                    <i class="bi bi-play-circle btn-song-play" @click="changeCurrentSong(key)"></i>
                </div>
            </div>
        </div>
        <div class="loading-gif-container" v-show="!searchDataStore.loadSearch">
            <loadingComponent></loadingComponent>
        </div>
        Asensio
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useSoundDataStore } from '../stores/soundData';
import { useSearchStore } from '@/stores/search';
import loadingComponent from '@/components/loadingComponent.vue';
import apiService from '../services/apiService';

const searchDataStore = useSearchStore();
const soundDataStore = useSoundDataStore();

let soundsData = ref([]);
let nextUrl = ref(null);
let cargaNextUrl = ref(false);
let timeOutId = 0;

watch(
    () => searchDataStore.searchText,
    () => {
        searchDataStore.loadSearch = false;
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