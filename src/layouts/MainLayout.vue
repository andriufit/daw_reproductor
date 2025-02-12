<template>
    <div class="player-container">
        <div class="content-container">
            <div class="lateral-container">
                <div class="search-box-container">
                    <input v-model="searchDataStore.searchText" placeholder="Buscar" type="text" name="searchQuery" class="search-box">
                    <i class="bi bi-search"></i>
                </div>
                
                <div class="recently-played">
                    <h3>Últimas Reproducidas</h3>
                    <ul>
                        <li v-for="(song, index) in recentSongs" :key="index" class="recent-song" @click="playRecentSong(song)">
                            <img :src="song.image" alt="song image" class="song-thumbnail" />
                            <span>{{ song.name }}</span>
                        </li>
                    </ul>
                </div>
                
                <nav>
                    
                </nav>
            </div>
            <div class="data-container">
                <RouterView />
            </div>
        </div>

        <div class="reproductor-container">
            <audio ref="reproductor" id="Reproductor" controls>
                <source :src="soundDataStore.soundUrl" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>

            <div class="sound-data-container">
                <label>{{ soundDataStore.soundName }}</label>
            </div>

            <div class="control-box">
                <div class="buttons-container">
                    <i class="bi bi-skip-backward"></i>
                    <i :class="currentButtonIcon" @click="toggleReproduction"></i>
                    <i class="bi bi-skip-forward"></i>
                </div>
                <div class="range-container">
                    <input :disabled="soundDataStore.soundUrl == ''" @input="changeAudioTime" type="range" :value="songCurrentTime" min="0" :max="songFullTime">
                </div>
                <div class="range-time-container">
                    <label class="start">{{ currentTime }}</label>
                    <label class="end">{{ endTime }}</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useSoundDataStore } from '../stores/soundData';
import { useSearchStore } from '@/stores/search';

const searchDataStore = useSearchStore();
const soundDataStore = useSoundDataStore();

let currentButtonIcon = ref("bi bi-play-circle");
const reproductor = ref(null);

let currentTime = ref("0:00");
let endTime = ref("0:00");
let songCurrentTime = ref(0);
let songFullTime = ref(0);

let recentSongs = ref([]);

watch(soundDataStore, () => {
    reproductor.value.load();
    reproductor.value.play();
    currentButtonIcon.value = "bi bi-pause-circle";
    
    // Agregar la canción actual a la lista de recientes
    if (soundDataStore.soundUrl) {
        recentSongs.value.unshift({
            name: soundDataStore.soundName,
            image: soundDataStore.soundImg,
            url: soundDataStore.soundUrl
        });
        
        if (recentSongs.value.length > 5) {
            recentSongs.value.pop();
        }
    }
});

onMounted(() => {
    reproductor.value.addEventListener('loadedmetadata', () => {
        let duration = Math.floor(reproductor.value.duration);
        songFullTime.value = duration;
        endTime.value = "0:" + duration;
    });

    reproductor.value.addEventListener("timeupdate", () => {
        let duration = Math.floor(reproductor.value.currentTime);
        currentTime.value = "0:" + duration;
        songCurrentTime.value = duration;
    });
});

const changeAudioTime = (e) => {
    if (e.target.value == Math.floor(reproductor.value.currentTime)) return;
    reproductor.value.currentTime = e.target.value;
    currentTime.value = "0:" + Math.floor(reproductor.value.currentTime);
};

const toggleReproduction = () => {
    if (reproductor.value.paused) {
        currentButtonIcon.value = "bi bi-pause-circle";
        reproductor.value.play();
    } else {
        currentButtonIcon.value = "bi bi-play-circle";
        reproductor.value.pause();
    }
};

const playRecentSong = (song) => {
    soundDataStore.soundName = song.name;
    soundDataStore.soundImg = song.image;
    soundDataStore.soundUrl = song.url;
};
</script>