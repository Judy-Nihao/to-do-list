const container = document.querySelector(".container");
const inputBox = document.querySelector("#input-box");
const listContainer = document.querySelector("#list-container");
const addBtn = document.querySelector("#add");
const alert = document.querySelector(".alert");

let items;
let arrItems = [];


addBtn.addEventListener("click", addTask);

// 新增項目：按鈕
function addTask(){
    if(inputBox.value == ""){
        // alert("待辦事項為必填！");
        alert.classList.add("active");
    }else{
        alert.classList.remove("active");
        let li = document.createElement("li");
        li.textContent = inputBox.value;
        // li 添加可拖曳屬性
        li.setAttribute("draggable", "true")
        // 把 li 加入 ul 裡面
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.className = "close";
        li.appendChild(span);
    }
    // 輸入後就清空輸入欄
    inputBox.value= "";
    
    //每次輸入完代辦事項就要存到瀏覽器內
    saveData(); 
};

// input 使用 鍵盤 enter 也能新增項目
// 13 is the keycode for "Enter"
// keydown事件，可避免注音輸入法選字時意外送出的問題，選字完成後，按下去 Enter 才送出
// 如果用 keyup 就會在選字尚未完成就直接送出，所以不適合。
inputBox.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) { 
      event.preventDefault();
      addTask();
    }
});


// 電腦版:監聽點擊事件
// 若點擊到事項，就切換成已經完成，添加 class checked
// span 標籤負責關閉按鈕，而 li 是 span 的直接父層
// 如果點擊到關閉按鈕，就移除它的直接父層元素，也就是移除 li 元素。(被點擊到的)
// 監聽事件的第三個參數寫false代表是使用預設的 冒泡 傳遞機制，由內往外傳遞
listContainer.addEventListener("click", function(e){
        if(e.target.tagName == "LI"){
            e.target.classList.toggle("checked");
            saveData();
        }
        else if(e.target.tagName == "SPAN"){
            e.target.parentElement.remove();
            saveData();
        }
},false);


// 手機版:監聽觸控事件
// 手指碰到項目就切換清單完成/未完成
listContainer.addEventListener("touchstart", function(e){
    if(e.target.tagName == "LI"){
        e.target.classList.toggle("checked");
    }
},false);


// 因為一旦碰觸就會觸發打勾，但是有些項目只是要拖移並非打勾
// 所以在讓手指在螢幕上面滑動時，取消打勾，這樣移動後項目就不會有打勾
listContainer.addEventListener("touchmove", function(e){
    if(e.target.tagName == "LI"){
        e.target.classList.remove("checked");
        e.target.style.backgroundColor = "gainsboro";
    }
},false);

// 刪除功能只有在手指碰觸按鈕後離開之時，才觸發
// 刪除按鈕一定要用 "end"
// 測試發現，如果用 "start"監聽，點擊刪除時清單項目會閃一下跑到最上面，又被 localStorage 記錄到這個位置，導致後續渲染時畫面出現殘像。
listContainer.addEventListener("touchend", function(e){
     if(e.target.tagName == "SPAN"){
        e.target.parentElement.remove();
    }else if(e.target.tagName == "LI"){
        e.target.style.backgroundColor = "transparent";
    }
},false);

// 將待辦事項存在瀏覽器內，即使頁面重整，資料還是能從儲存庫裡面調出來
// data存起來後再抓出，用innerHTML放進去呈現資料，就能包含排版和勾選狀態等，全部保留在頁面上
// 注意：saveData()的listContainer.innerHTML會對應到showTask()的listContainer.innerHTML
// 兩邊要一模一樣
function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

// 把存在瀏覽器內的資料，全部放到 ul 裡面
function showTask(){
    listContainer.innerHTML =  localStorage.getItem("data");
}


// 記得呼叫函式才會執行
showTask();

// 拖曳套件
// 建立 Sortable 實體 create sortable and save instance
new Sortable(listContainer,{
    animation: 200,
});

// 電腦版：只要整個DOM有發生 drag 事件，就記錄當下的清單項目狀態，存進瀏覽器裡面
// 這樣一來，就能記錄到拖曳後的最新排序清單
// 手機版：由於任何更動，最終肯定都有手指離開螢幕的階段，監聽 "touchend" 記錄當下清單狀態。（測試發現手機版無法偵測到drag事件)
if (window.innerWidth > 767){
    window.addEventListener("drag", function(){
        saveData();
})
}else{
    window.addEventListener("touchend", function(){
        saveData();
})
}

//localStorage.clear(); //可以清除資料


// 更換背景
// 在 8 張 圖片中隨機取出其中一張
// 此function 執行完畢，會 return 一個圖片網址字串
// 把此圖片網址賦予給 container 的 CSS background-image 屬性，改變背景圖片
function generateRandom(){
    const str = [
        "url('img/45degreee_fabric.webp')",
        "url('img/beige-tiles.webp')",
        "url('img/blue-snow.webp')",
        "url('img/email-pattern.webp')",
        "url('img/floor-tile.png')",
        "url('img/herringbone.webp')",
        "url('img/more-leaves.png')",
        "url('img/watercolor.webp')",
    ];
    
    
    // 星號乘法符號後面寫8，表示最大值不超過8，有可能是 7.999999之類
    /* 0~8 (包含 0 不包含 8)之間，取隨機浮點數，再轉換成「小於等於」的最接近整數*/
    // 隨機浮點數若為 7.9999 會被轉換為 7
    // 隨機浮點數若為 1.9999 會被轉換為 1
    // 隨機浮點數若為 0.9999 會被轉換為 0
    // 所以換算出來的結果就會在陣列索引 0, 1, 2, 3, 4, 5, 6, 7 之間隨機抽一個

    let mathRandom = Math.floor(Math.random()*(str.length));
    let res = "";
    return str[mathRandom];
}

// 重整頁面就出現一個隨機背景圖
window.onload = function ()
{
    container.style.backgroundImage = generateRandom();
}