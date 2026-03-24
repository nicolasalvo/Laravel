<template>
    <div class="hud">
        <div class="row">
            <div>Vidas:</div>
            <div class="lives-container">
                <svg v-for="n in lives" :key="n" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="24"
                    height="24" fill="red" class="heart-icon">
                    <path
                        d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z" />
                </svg>
            </div>
        </div>
        <div class="row">
            <div><b>Puntuación:</b> {{ score }}</div>
            <div><b>Récord:</b> {{ best }}</div>
            <div><b>Velocidad:</b> {{ speed.toFixed(1) }}</div>
        </div>

        <div v-if="isGameOver" class="gameover">
            <h2>Game Over</h2>
            <button @click="$emit('restart')">Reiniciar</button>
            <button class="small" @click="goToDashboard" style="margin-left: 10px;">Volver al Dashboard</button>
            <p class="hint">Controles: ← → o A/D para moverte · Espacio para saltar</p>
        </div>

        <div v-else class="hint">
            Controles: ← → o A/D para moverte · Espacio para saltar
            <button class="small" @click="$emit('restart')">Reiniciar</button>
            <button class="small" @click="goToDashboard">Volver al Dashboard</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    score: { type: Number, required: true },
    best: { type: Number, required: true },
    speed: { type: Number, required: true },
    isGameOver: { type: Boolean, required: true },
    lives: { type: Number, required: true }
})

const goToDashboard = () => {
    if (window.parent && window.parent !== window) {
        window.parent.location.href = '/dashboard'
    } else {
        window.location.href = '/dashboard'
    }
}
</script>

<style scoped>
.hud {
    position: absolute;
    left: 12px;
    bottom: 12px;
    color: white;
    font-family: system-ui, Arial;
    text-shadow: 0 1px 2px rgba(0, 0, 0, .6);
    user-select: none;
}

.row {
    margin-bottom: 10px;
    display: flex;
    gap: 16px;
    align-items: center;
    background: rgba(0, 0, 0, .35);
    padding: 8px 10px;
    border-radius: 10px;
}

.gameover {
    margin-top: 10px;
    background: rgba(0, 0, 0, .55);
    padding: 12px 12px;
    border-radius: 12px;
    max-width: 360px;
}

button {
    margin-top: 6px;
    padding: 8px 10px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}

button.small {
    margin-left: 10px;
    margin-top: 0;
    padding: 6px 10px;
}

.hint {
    margin-top: 10px;
    background: rgba(0, 0, 0, .35);
    padding: 8px 10px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.lives-container {
    display: flex;
    gap: 4px;
}

.heart-icon {
    fill: #ff4444;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
}
</style>