# 實作紀錄：可拖曳與紀錄的 To Do List

## 實作網址
gh-pages
https://judy-nihao.github.io/to-do-list

GitHub Repo
https://github.com/Judy-Nihao/to-do-list

## 實作功能

- 待辦項目順序可拖曳調換
- 重整頁面仍可保持清單狀態(拖曳後的順序依然保存)
- 若新增內容為空會跳出提醒
- 鍵盤 Enter 可新增項目 (注音選字完成後才送出)
- 重整頁面隨機切換背景圖提供好心情

![image](https://hackmd.io/_uploads/HyLwiX8L2.png)
![image](https://hackmd.io/_uploads/H1a92rLUh.jpg)

## 筆記

To-Do-List 最基礎的功能是，新增與刪除事項，即使畫面重整仍保留待辦紀錄，才符合「待辦清單」的意義，看似功能不複雜，但是實際嘗試實作，發現要結合視覺美感、兼顧桌上與行動版的流暢操作體驗、讓清單順序能拖曳改序，並紀錄順序調換後的清單內容，其實有很多知識點需要一一突破。

我試著把自己的碰壁過程與解決後的驚呼與碎念筆記起來，也許某一天，像我當初一樣，網路上某位頭痛到跟可達鴨一樣的人，這篇文章能發揮些許幫助。

### 好看的的輸入欄：讓按鈕看起來像在 input 裡面
一個 row 容器包著 input 和 button 元素。

```htmlembedded!
<div class="row">
    <input type="text" id="input-box" placeholder="新增待辦事項...">                
    <button type="button" id="add"><span>新增</span><i class="bx bx-plus-circle"></i></button> 
</div>
```

![image](https://hackmd.io/_uploads/rkGFAVUI2.png)
![image](https://hackmd.io/_uploads/ByBYAVIL3.png)
![image](https://hackmd.io/_uploads/SykY1BUI3.png)


input 和 button 實際上是鄰居，button 並不在 input 裡面，而是在隔壁。

但是畫面上看起來 button 卻像是鑲嵌在 input 之中，視覺關鍵來自於讓 input 背景色是透明色，且消除邊框線條，讓 input 融入在 row 裡面。

輸入欄的灰色底色，其實是來自父層 row 的顏色，由於 input 邊界感消失，和 input 一起被包在 row 裡面的 button 起來就像是包在 input 裡面了。


### `<button type="submit"></button>` 和 `<button type="button"></button>` 和 `<input type="submit">` 的差別

表單元素 `form` 裡面，

- `<button type="submit"></button>`：若沒有特地指定 type，按鈕預設就是 `type="submit"`，點擊按鈕就會觸發表單遞交，並進行頁面跳轉。
- `<button type="button"></button>`：會讓按鈕變成單純的按鈕，頁面不會跳轉。
- `<input type="submit">`：如果要用 input 做按鈕，必須是`type="submit"`，而不是 `type="text"`，若使用 `type="text"`，則 input 欄位內的鍵盤 Enter 按下去後會沒反應，無法觸發遞交。

**阻止表單提交的方式**

- JavaScript：在按鈕的監聽事件 function 中，用`preventDefault()` 方法可以阻止預設的頁面跳轉。
- HTML: 在`<form>` 元素上增添 `onsubmit="return false;"` 屬性，也能阻止表單遞交。

對按鈕進行 click 事件監聽，取得 input 內的 value 並渲染在列表內，是最基本的待辦清單功能實行。

### 鍵盤 Keydown 事件注音選字 Enter 送出
如果想要鍵盤按下 Enter 時也能新增清單項目，必須對 input 欄位進行 `keydown` 事件的監聽，這樣打字時，等注音選好文字，再按下 Enter ，也能新增清單項目。

這邊要注意，註冊的事件是`keydown` 不是 `keyup`！

- `keyup` 事件：雖然也會監聽 input 輸入欄位的異動，但是有個惱人的困擾，它會在注音選字時的第一個 Enter 就直接傳送文字出去，等於字詞還沒打完甚至選錯字，就觸發傳送資料了，非常干擾。如果是用英文輸入法，不會發現這個困擾，但是對於需要選字的輸入法來說，`keyup` 事件很不適合。
- `keydown` 事件：會等選字完成後按下去的 Enter，才會送出資料。待辦清單的表單輸入欄，使用 `keydown` 事件更合適。

補充： 在桌面版 chrome 瀏覽器測試，`keypress` 事件其實也能做到跟`keydown`一樣的效果，但是[`keypress`已經被棄用，MDN 建議要用 `keydown` 替代](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event)。


### 清單事項完成/未完成狀態 icon 切換

**偽元素 與 SVG 製作 icon**

每一條`<li>` 清單項目最前面的未完成空心圈圈，和綠色實心圈圈，是用 `::before` 偽元素的 `background-image` 處理的。

背景圖片裡面放 SVG 圖片，用線上工具把 SVG 轉成 URL，再把 URL 放入 `background-image: url("")` 就能顯示圖片。使用 SVG 而不是 PNG 的好處是，SVG 可以在編碼那邊改 `fill` 顏色，換顏色很方便。

![image](https://hackmd.io/_uploads/B16QAII8h.png)


SVG URL Encoder : https://yoksel.github.io/url-encoder

```css!
/* 事項未完成的圈圈 */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='fill: rgba(0, 0, 0, 0.5);transform: ;msFilter:;'%3E%3Cpath d='M12 2C6.486 2 2 6.486 2 12c.001 5.515 4.487 10.001 10 10.001 5.514 0 10-4.486 10.001-10.001 0-5.514-4.486-10-10.001-10zm0 18.001c-4.41 0-7.999-3.589-8-8.001 0-4.411 3.589-8 8-8 4.412 0 8.001 3.589 8.001 8-.001 4.412-3.59 8.001-8.001 8.001z'%3E%3C/path%3E%3C/svg%3E");
}

```

已完成的事項的樣式，就設定一個 class `.checked`，同樣用`::before` 偽元素的背景圖案給予一個刪除圖案。

```css!
ul li.checked{
    color: hsl(0, 0%, 45%);
    text-decoration: line-through;
}

/* 只在有添加 class checked 的 li 前面，替換「已完成」icon 背景圖 svg */
ul li.checked::before{
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='fill: rgba(46, 139,87, 1);transform: ;msFilter:;'%3E%3Cpath d='M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z'%3E%3C/path%3E%3C/svg%3E");
}
```

**`tagName` 判斷清單內點擊到的元素是誰**

之後用 JS 監聽整區待辦清單，用 `tagName` 屬性判斷，如果點擊到的是 `li` 元素，就增加 class `checked`，如果點擊到的是 `span` 元素，就刪除它父層元素 `li` ，因為刪除按鈕是放在 `li` 裡面。

![image](https://hackmd.io/_uploads/ry81-v8U2.png)


這邊要注意的是，因為 `Element.tagName` 屬性返回的是「大寫」的元素名稱，在進行判斷時，雙引號內必須是大寫英文，比較才會成立。

[MDN Element.tagName 返回當前元素的標籤名](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/tagName)

```javascript!
// 電腦版:監聽點擊事件
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
// 監聽事件的第三個參數寫false代表是使用預設的 冒泡 傳遞機制，由內往外傳遞
```


### 清單拖曳功能 sortable.js

待辦事項一一列出後，有時候會想調換順序，這時候 Sortable.js 這個套件就能派上用場。

[Sortable.js GhitHub](https://github.com/SortableJS/Sortable)

[Sortable.js 官方示範](https://sortablejs.github.io/Sortable/)

安裝方式是去官方 GitHub Repo 下載 「Sortable.js」這支檔案存在本地端資料夾，再將腳本引入 HTML 內。 

```htmlembedded!
//sortable.js
<script src="Sortable.js" defer></script>
//custom js
<script src="all.js" defer></script>
```

**拖曳套件生效有兩個必要條件**
1. 要被拖曳的 HTML 元素上面必須有 `draggable="true"` 屬性
[MDN HTML Drag and Drop API ](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

![image](https://hackmd.io/_uploads/H16INvL83.png)

2. JavaScript 裡面要建立一個 Sortable 實體，第一個參數是「要進行拖曳的元素區域」，這邊是給 `listContainer` ，第二個位置是一個物件，裡面設定 `animation` 屬性，數字表示拖曳速度。


```javascript!

const listContainer = document.querySelector("#list-container");

new Sortable(listContainer,{
    animation: 200,
});

```

之後每次拖曳項目時，拖曳動畫速度、拖曳後的排序與元素插入等麻煩工作，就可以交由套件處理了。


### 紀錄代辦事項 localStorage (包含拖曳後)

紀錄網頁當下畫面特定區塊的資料，存在瀏覽器，之後再撈資料渲染回畫面上，用到的就是 `localStorage.setItem` 和 `localStorage.getItem` 。

![image](https://hackmd.io/_uploads/SySGCuL82.png)


```javascript!
// 儲存目前 ul 元素 (待辦事項顯示區)內的所有資料
function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

// 把存在瀏覽器內的資料，全部放到 ul 裡面
function showTask(){
    listContainer.innerHTML =  localStorage.getItem("data");
}

// 記得呼叫函式才會執行
showTask();

```

`showTask()` 渲染畫面的時機很單純，就是每次頁面刷新的時候。

關鍵在於 `saveData()` 儲存資料的時機：

1. 新增清單項目時 (`addTask()`)
2. 清單項目點擊切換為完成狀態時 (checked)
3. 刪除清單項目時 (remove)
4. 拖曳清單項目之後 (sortable)

前三點時機比較容易判斷，只要在我自己寫的 function 裡面找對地方添加 `saveData()` 即可，

要稍微動腦筋的是第四點，因為拖曳行為是 Sortable.js 套件裡面定義的，那要把 `saveData()` 添加在哪裡呢？

網路上爬文可以看到不少人有相同的煩惱，但是網路上找到的解法，

有些是在固定的清單內，給予每個項目一個 id ，或用 `data-*` 賦予識別碼，再用`toArray()`去處理

有些雖然跟我一樣是做 todolist ，但是寫法實在太～複雜～了，看不出來可以如何應用在我的情況上。

[Saving and resetting order in sortablejs](https://stackoverflow.com/questions/63569279/saving-and-resetting-order-in-sortablejs)
[SortableJS isn't saving my sorted todo list in localStorage](https://stackoverflow.com/questions/60592825/sortablejs-isnt-saving-my-sorted-todo-list-in-localstorage)

研究一下 [DragEvent](https://developer.mozilla.org/zh-TW/docs/Web/API/DragEvent) 後，我想到一個存取資料的時機：

**只要瀏覽器視窗有發生 dragevent，就紀錄當下待辦清單的狀況，是不是也能通？**

**對 `window`  進行 drag 事件的監聽**
```javascript!
 window.addEventListener("drag", function(){
        saveData();
}
```

測試拖曳清單項目且重整刷新頁面，確實有成功渲染出調換順序後的清單狀態！

### 行動版 touch 事件取代 click 事件

本來以為大功告成，殊不知用 android 手機一開，清單項目一個都點擊不了，無法完成，無法刪除，也無法拖曳，完全凍結!

才發現手機對於 click 事件有時候會沒反應，行動版裝置最好改用 touch 事件去監聽。

[MDN Using Touch Event ](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Using_Touch_Events)

#### touchstart
電腦版就走 click 事件，另外為手機版新增一個 touchstart 事件。

```javascript!
// 手機版:監聽觸控事件
// 手指碰到項目就切換清單完成/未完成
listContainer.addEventListener("touchstart", function(e){
    if(e.target.tagName == "LI"){
        e.target.classList.toggle("checked");
    }
},false);

```

可是 click 和 touchstart 有個奇妙的差異，

- click 事件在滑鼠拖曳清單項目時，只會單純拖曳，不會因為滑鼠碰到項目就切換完成與否狀態，
- touchstart 事件卻是手指一碰到項目，就會觸發完成/未完成狀態，看起來不太合理。

#### touchmove

這個現象我目前解法或許沒有很完美，但我的解法是：

在「拖曳途中」移除項目的「完成 checked」狀態，也就是去監聽 touchmove 事件。

```javascript!
// 因為一旦碰觸就會觸發打勾，但是有些項目只是要拖移並非打勾
// 所以在讓手指在螢幕上面滑動時，取消打勾，這樣移動後項目就不會有打勾

listContainer.addEventListener("touchmove", function(e){
    if(e.target.tagName == "LI"){
        e.target.classList.remove("checked");
        e.target.style.backgroundColor = "gainsboro";
    }
},false);
```

#### touchend

然後一波未平一波又起，用 touchstart 事件監聽刪除按鈕時，發現畫面會閃爍，刷新頁面後 localStorage 會記錄到閃爍時的狀態，使畫面上會出現殘像，無法繼續操作待辦清單。

![image](https://hackmd.io/_uploads/ByO4IOLLh.jpg)

反覆測試後發現，刪除按鈕必須改註冊 touchend 事件，才不會在手指一按下去的瞬間就觸發一堆有的沒的。

```javascript!

listContainer.addEventListener("touchend", function(e){
     if(e.target.tagName == "SPAN"){
        e.target.parentElement.remove();
    }else if(e.target.tagName == "LI"){
        e.target.style.backgroundColor = "transparent";
    }
},false);

```


### 監聽 touchend 去紀錄手機版拖曳後的清單狀態

最後的問題是要如何紀錄手機上透過「觸控事件」拖曳調整後的清單順序，原本是讓 window 監聽 drag 事件，但是手機對 drag 事件沒有反應，如果用手機操作，瀏覽器不會去紀錄手機上的拖曳結果。

經過一段跟畫面上的殘像鬼影過招的測試之後，發現適合手機上 window 的監聽事件是 touchend ，因為不管怎麼拖曳，最後手指一定會有離開螢幕的時候，這個時機就是紀錄清單狀態的時機。

最後測試出來，為了確保瀏覽器準確判斷當下是要監聽 drag 還是 touchend 事件，利用瀏覽器視窗的寬度 `window.innerWidth`，來判斷目前是桌上裝置，還是行動裝置。

我用 767px 當作斷點，
螢幕寬度大於 767px 就是電腦，就監聽 drag 事件，
除此之外的就是行動裝置，監聽 touchend 事件。

```javascript!
if (window.innerWidth > 767){
    window.addEventListener("drag", function(){
        saveData();
})
}else{
    window.addEventListener("touchend", function(){
        saveData();
})
}
```

### 附加功能：隨機切換背景圖樣

我想要在每次頁面刷新時，背景都能隨機切換一不同的底色圖樣，讓待辦清單看起來更活潑。

實際做法是，預先準備好 8 張 圖片，將圖片的路徑組成一個陣列，

陣列索引 0~7 就代表每一張圖片，所以重點在於隨機取得 0~7 之間的正整數。

**取得隨機整數的陣列方法**

- `Math.random() * 最大值`：隨機回傳 `0~最大值` 之間的浮點數，包含 0 不 包含「最大值」
- `Math.floor()`：回傳「小於或等於」給定數值的整數。

`Math.random() * 8`，表示最大值不超過8，有可能是 7.999999 之類，

random 若回傳 0.9999，會被 floor 轉換為 0
random 若回傳 1.9999，會被 floor 轉換為 1
random 若回傳 7.9999，會被 floor 轉換為 7

所以換算出來的隨機整數，就會在陣列索引 0, 1, 2, 3, 4, 5, 6, 7 之間隨機抽一個。

把隨機產生的數字，代入圖片路徑陣列中，會隨機抽出一個圖片路徑。

當 function 執行完畢，就會 return 一個圖片路徑。


最後只要每次刷新頁面，待 DOM 準備好，就把隨機取出的圖片網址，套入給網頁最外層的容器的 background-image 屬性之中，改變背景圖片。

```javascript!

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
    

    let mathRandom = Math.floor(Math.random()*(str.length));
    let res = "";
    return str[mathRandom];
}

```

```javascript!
// 重整頁面就出現一個隨機背景圖
window.onload = function ()
{
    container.style.backgroundImage = generateRandom();
}
```