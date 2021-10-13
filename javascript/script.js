const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

//allMusic為陣列[0~5]

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);  //musicIndex 歌曲清單1～6
isMusicPaused = true;

//事件-----頁面載入完成時,
window.addEventListener("load", ()=>{
  loadMusic(musicIndex);  //根據loadMusic(musicIndex)隨機(因為musicIndex是亂數產生)載入一首歌曲,
  playingSong();          //並根據playingSong播放歌曲
});


//方法-----載入歌曲資訊(歌名、歌手、圖片、mp3檔案)
function loadMusic(indexNumb){                                //此時載入的變數為musicIndex 1～6
  musicName.innerText = allMusic[indexNumb - 1].name;         //載入歌名
  musicArtist.innerText = allMusic[indexNumb - 1].artist;     //載入歌手
  musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`; //載入圖片
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`; //載入音樂檔案
}

//方法-----音樂播放時要載入的介面方法(暫停ing)
function playMusic(){
  wrapper.classList.add("paused"); //加入paused的calss屬性
  playPauseBtn.querySelector("i").innerText = "pause"; //顯示暫停icon
  mainAudio.play();
}

//方法-----音樂暫停時要載入的方法(播放ing)
function pauseMusic(){ 
  wrapper.classList.remove("paused"); //移除paused的calss屬性
  playPauseBtn.querySelector("i").innerText = "play_arrow"; //顯示播放icon
  mainAudio.pause();
}

//方法-----回上一首歌曲
function prevMusic(){
  musicIndex--; //musicIndex 歌曲清單1～6  觸發一次就減1
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex; //到第一首歌後 按下prev 會變成1-1所以等於0,0就跳到最後一首
  loadMusic(musicIndex); //根據loadMusic(musicIndex)載入歌曲,
  playMusic();  //方法-----音樂播放時要載入的介面方法
  playingSong(); 
}

//方法-----到下一首歌曲
function nextMusic(){
  musicIndex++; //musicIndex 歌曲清單1～6  觸發一次就加1
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex; //現在的這首歌是不是最後一首(6>5)?是的話,就回到第一首,不是的話就繼續播放當前歌曲
  loadMusic(musicIndex); //根據loadMusic(musicIndex)載入歌曲,
  playMusic();  //方法-----音樂播放時要載入的介面方法
  playingSong(); 
}

//事件-----按下播放/暫停按鈕會觸發的事件
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused"); //宣告 包含paused這個class 為isMusicPlay
  isMusicPlay ? pauseMusic() : playMusic();//如果isMusicPlay為真 就載入音樂暫停時要載入的方法(播放ing),否則就載入音樂播放時要載入的介面方法(暫停ing)
  playingSong();
});


//事件-----按下回上一首歌按鈕會觸發的事件
prevBtn.addEventListener("click", ()=>{
  prevMusic(); //方法-----回上一首歌曲
});

//事件-----按下到下一首歌按鈕會觸發的事件
nextBtn.addEventListener("click", ()=>{
  nextMusic(); //方法-----到下一首歌曲
});

//事件-----根據當前播放時間,更新音樂秒數
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; //當前播放時間
  const duration = e.target.duration; //歌曲總長
  let progressWidth = (currentTime / duration) * 100;
  
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
  musicDuartion = wrapper.querySelector(".max-duration");

  mainAudio.addEventListener("loadeddata", ()=>{
    
    let mainAdDuration = mainAudio.duration;
    console.log(mainAudio);
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ //秒數小於10數字加0
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // 更新當前播放歌曲時間
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ //秒數小於10數字加0
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// //事件-----根據當前播放時間,更新音樂長度拉桿的寬度 
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; 
  let clickedOffsetX = e.offsetX; 
  let songDuration = mainAudio.duration; 
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); 
  playingSong();
});

//循環播放歌單/單曲循環播放/隨機播放的按鈕切換
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText;
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//歌曲結束後觸發事件
mainAudio.addEventListener("ended", ()=>{
  
  let getText = repeatBtn.innerText; 
  switch(getText){
    case "repeat": //循環播放歌單
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //單曲循環播放
      playMusic(); 
      break;
    case "shuffle": //隨機播放
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); 
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); 
      musicIndex = randIndex; 
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//歌曲清單按鈕切換
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});



// 根據歌曲數產生列表
const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); 

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ 
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; 
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); 
  });
}

//點選列表中的歌曲觸發播放
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}


function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; 
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}