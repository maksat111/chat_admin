import sound from '../audio/messageSound.mp3';

export const playSound = () => {
    const audio = new Audio(sound);
    audio.play();
}