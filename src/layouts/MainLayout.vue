<template>
    <div class="player-container">
        <div class="content-container">
            <div class="lateral-container">
                <div class="search-box-container">
                    <input v-model="searchDataStore.searchText" placeholder="Buscar" type="text" name="searchQuery" class="search-box">
                    <i class="bi bi-search"></i>
                </div>
                
                <!-- Caja de últimas canciones reproducidas -->
                <div class="recent-songs-container">
                    <h3>Últimas Reproducidas</h3>
                    <ul>
                        <li v-for="(song, index) in recentSongs" :key="index">
                            <span @click="playRecentSong(song)">{{ song }}</span>
                            <i class="bi bi-play-circle" @click.stop="playSong(song)"></i>
                        </li>
                    </ul>
                </div>
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
    import { useTemplateRef, ref, onMounted, watch } from 'vue';
    import { useSoundDataStore } from '../stores/soundData';
    import { useSearchStore } from '@/stores/search';

    const searchDataStore = useSearchStore();
    const soundDataStore = useSoundDataStore();
    
    let currentButtonIcon = ref("bi bi-play-circle");
    const reproductor = useTemplateRef("reproductor");
    let currentTime = ref("0:00");
    let endTime = ref("0:00");
    let songCurrentTime = ref(0);
    let songFullTime = ref(0);
    
    // Lista de últimas canciones reproducidas
    let recentSongs = ref([]);

    watch(soundDataStore, () => {
        reproductor.value.load();
        reproductor.value.play();
        currentButtonIcon.value = "bi bi-pause-circle";

        // Agregar canción a la lista de recientes
        if (soundDataStore.soundName) {
            if (!recentSongs.value.includes(soundDataStore.soundName)) {
                recentSongs.value.unshift(soundDataStore.soundName);
                if (recentSongs.value.length > 5) {
                    recentSongs.value.pop();
                }
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
        if(e.target.value == Math.floor(reproductor.value.currentTime)) return;
        reproductor.value.currentTime = e.target.value;
        currentTime.value = "0:" + Math.floor(reproductor.value.currentTime);
    }

    const toggleReproduction = () => {
        if(reproductor.value.paused){
            currentButtonIcon.value = "bi bi-pause-circle";
            reproductor.value.play();
        } else {
            currentButtonIcon.value = "bi bi-play-circle";
            reproductor.value.pause();
        }
    };

    const playRecentSong = (song) => {
        soundDataStore.soundName = song;
        // Aquí puedes añadir la lógica para obtener la URL de la canción en base a su nombre si es necesario
        reproductor.value.load();
        reproductor.value.play();
    };

    const playSong = (song) => {
        // Lógica para reproducir la canción específica desde la lista
        soundDataStore.soundName = song;
        reproductor.value.load();
        reproductor.value.play();
    };
</script>

<style>
.recent-songs-container {
    margin-top: 20px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 8px;
}
.recent-songs-container h3 {
    margin-bottom: 10px;
    font-size: 16px;
}
.recent-songs-container ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.recent-songs-container li {
    font-size: 14px;
    margin-bottom: 5px;
    cursor: pointer;
    color: blue;
    text-decoration: underline;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.recent-songs-container li:hover {
    color: darkblue;
}
.recent-songs-container i {
    cursor: pointer;
    font-size: 20px;
    color: #007BFF;
}
.recent-songs-container i:hover {
    color: #0056b3;
}
</style>
