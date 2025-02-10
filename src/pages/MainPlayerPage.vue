<template>
    <div class="main-player-container" @scroll="handleScroll" ref="scrollContainer">
        <div v-show="searchDataStore.loadSearch">
            <div v-for="(soundData, key) in soundsData" :key="key" class="song-element">
                <div class="song-img">
                    <img :src="soundData.images ? soundData.images.spectral_m : ''" alt="Sound Image">
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

        <div class="loading-gif-container" v-show="loadingMore">
            <loadingComponent />
        </div>
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
const scrollContainer = ref(null);
const soundsData = ref([]);
let nextResponse = null;
const loadingMore = ref(false);
const loadEnded = ref(false);
let timeOutId = 0;

watch(() => searchDataStore.searchText, () => {
    searchDataStore.loadSearch = false;
    if (timeOutId) clearTimeout(timeOutId);
    
    timeOutId = setTimeout(() => {
        soundsData.value = [];
        nextResponse = null;
        loadEnded.value = false;
        getSoundsData();
    }, 1000);
});

onMounted(() => {
    getSoundsData();
});

const getSoundsData = async (nextUrl = "") => {
    if (loadingMore.value) return;

    loadingMore.value = true;
    try {
        let response = await apiService.getSounds(searchDataStore.searchText, nextUrl);
        if (!response) return;

        nextResponse = response.next;
        loadEnded.value = !nextResponse;

        const newData = await Promise.all(response.results.map(async (element) => {
            let data = await apiService.getsoundData(element.id);
            return { ...data, ...element };
        }));

        soundsData.value = [...soundsData.value, ...newData];

    } catch (error) {
        console.error("Error fetching sounds:", error);
    } finally {
        loadingMore.value = false;
        searchDataStore.loadSearch = true;
    }
};

const handleScroll = async () => {
    if (!scrollContainer.value || loadingMore.value || loadEnded.value) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        await getSoundsData(nextResponse);
    }
};

const changeCurrentSong = (key) => {
    const song = soundsData.value[key];
    soundDataStore.soundName = song.name;
    soundDataStore.soundImg = song.images?.spectral_m || '';
    soundDataStore.soundUrl = song.previews?.["preview-hq-mp3"] || '';
};
</script>
