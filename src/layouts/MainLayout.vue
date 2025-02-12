

<template>
    <div class="player-container">

        <div class="content-container">
            <div class="lateral-container">
                <div class="search-box-container">
                    <input v-model="searchDataStore.searchText" placeholder="Buscar" type="text" name="searchQuery" class="search-box">
                    <i class="bi bi-search"></i>
                </div>

                <div class="history-container">
                    <h4>Historial</h4>
                    <div v-for="(song, index) in soundDataStore.history" :key="index" class="history-item" @click="playFromHistory(song)">
                        <img :src="song.soundImg" alt="cover" class="history-img">
                        <div class="history-info">
                            <label>{{ song.soundName }}</label>
                        </div>
                    </div>
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


    watch(soundDataStore, () => {
        reproductor.value.load();
        reproductor.value.play();
        currentButtonIcon.value = "bi bi-pause-circle";
    });


    onMounted(async () => {
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
</script>

<style scoped>
.lateral-container {
    padding: 1rem;
}

.history-container {
    margin-top: 1rem;
}

.history-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    cursor: pointer;
}

.history-img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 0.5rem;
}

.history-info label {
    font-size: 0.9rem;
}
</style>