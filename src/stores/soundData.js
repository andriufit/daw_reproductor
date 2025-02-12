import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSoundDataStore = defineStore('soundDataStore', () => {
    const soundName = ref('');
    const soundUrl = ref('');
    const soundImg = ref('');
    const history = ref([]);  // Historial de las últimas canciones reproducidas

    const resetSound = () => {
        soundName.value = '';
        soundUrl.value = '';
        soundImg.value = '';
    };

    const addToHistory = (song) => {
        history.value.unshift(song); // Agregar la canción al principio del historial
        if (history.value.length > 5) {
            history.value.pop(); // Mantener solo las últimas 5 canciones
        }
    };

    return { soundUrl, soundName, soundImg, resetSound, history, addToHistory };
});
