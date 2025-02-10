<template>
    <div class="main-player-container" @scroll="handleScroll">
        <div v-show="searchDataStore.loadSearch == true">
            <div v-for="(soundData, key) in soundsData" class="song-element" :key="key">
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
            <loadingComponent class="wrapper_cargar_mas" v-if="abajo"/>
        </div>
        <div class="loading-gif-container" v-show="searchDataStore.loadSearch == false">
            <loadingComponent class="wrapper_carga_total"/>
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

    let soundsData = ref([]);
    let timeOutId = 0;
    let abajo = ref(true);
    let page = ref(1);

    watch(
        () => searchDataStore.searchText, 
        () => {
            searchDataStore.loadSearch = false;
            if(timeOutId != 0){
                clearTimeout(timeOutId)
                timeOutId = 0;
            }
            timeOutId = setTimeout(() => {
                page.value = 1;
                soundsData.value = [];
                getSoundsData();
            }, 1000);
        }
    );

    onMounted(async () => {  
        getSoundsData();
    });

const getSoundsData = async () => {
    let response = await apiService.getSounds(searchDataStore.searchText, page.value);
    console.log("Datos recibidos de la API:", response.results);

    soundsData.value = [...soundsData.value, ...response.results];

    for (let key in soundsData.value) {
        let element = soundsData.value[key];
        let data = await apiService.getSoundData(element.id);
        console.log("Datos completos del sonido:", data);

        soundsData.value[key] = {
            ...data,
            ...soundsData.value[key]
        };
    }
    abajo.value = false;
    timeOutId = 0;
    searchDataStore.loadSearch = true;
};


    const changeCurrentSong = (key) => {
        console.log("URL del sonido:", soundsData.value[key].previews?.["preview-hq-mp3"]);
        soundDataStore.soundName = soundsData.value[key].name;
        soundDataStore.soundImg = soundsData.value[key].images.spectral_m;
        soundDataStore.soundUrl = soundsData.value[key].previews["preview-hq-mp3"];
    }

    const handleScroll = (event) => {
        let bottomOfWindow = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
        if (bottomOfWindow) {
            page.value++;
            abajo.value = true;
            getSoundsData();
        }
    }
</script>