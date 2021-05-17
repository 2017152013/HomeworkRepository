// start with first post
var counter = 1;
window.onload = firstLoad();
// when DOM loads, render the first posts
//document.addEventListener('DOMContentLoaded', firstLoad);
// If scrolled to bottom, load next posts
window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= 
        document.getElementById("index-content").offsetHeight){
        load();
    }
}
// 처음엔 4개 띄우고
function firstLoad(){
    counter += 4;
    // Get new posts and add posts
    fetch("./product.json")
    .then(response => {
        return response.json()
    })
    .then(data => {
        let newData = [];
        for(let i = 0; i < 4; i ++){
            newData.push(data[i]);
        }
        return newData;
    })
    .then(data => makeHTML(data))
    .catch(error => {
        alert(error);
    });
}
// 인피니트 스크롤로 2개씩 띄우기
function load(){
    // set four post IDs in order to load posts at a time
    let start = counter;
    let end = start + 1;
    counter = end + 1;
    // Get new posts and add posts
    fetch("./product.json")
    .then(response => {
        return response.json()
    })
    .then(data => {
        if (counter > data.length){
            return false;
        }

        let newData = [];
        
        data.forEach(function(element){
            if ( start <= element['id'] && element['id'] <= end){
                newData.push(element);
            }
        })
        return newData;
    })
    .then(data => makeHTML(data))
    .catch(error => {
        alert(error);
    });
}
/*
// Load next set of posts
function load(){
    // set four post IDs in order to load posts at a time
    let start = counter;
    let end = start + 3;
    counter = end + 1;
    // Get new posts and add posts
    fetch("./product.json")
    .then(response => {
        return response.json()
    })
    .then(data => {
        let newData = [];
        data.forEach(function(element){
            if ( start <= element['id'] && element['id'] <= end){
                newData.push(element);
            }
        })
        return newData;
    })
    .then(data => makeHTML(data))
    .catch(error => {
        alert(error);
    });
    return false;
}
*/

/*
window.onload = function (){
    fetch("./product.json")
    .then(response => {
        return response.json()
    })
    .then(data => makeHTML(data))
    .catch(error => {
        alert(error);
    });
    return false;
}
*/
function emptyTable(){
    let table = document.getElementById("products-table");
    // table 초기화
    table.innerHTML = '';
}
function makeHTML(data){
    const num = data.length;
    let table = document.getElementById("products-table");
    for(let i = 0; i < num; i ++){
        let name = document.createElement("p");
        let image = document.createElement("img");
        name.innerHTML = data[i]['name'];
        image.src = data[i]['image'];
        
        let detail_div = document.createElement("div");
        let detail = document.createElement("ul");
        detail.innerHTML += "<li>종류: " + data[i]['category'] + "</li>"
        detail.innerHTML += "<li>가격: " + data[i]['price'] + "</li>"
        detail.innerHTML += "<li>설명: " + data[i]['info'] + "</li>"
        detail.innerHTML += "<li>칼로리: " + data[i]['kcal'] + "kcal</li>"
        detail_div.appendChild(detail);
        detail_div.setAttribute("class", "detail-container");

        let td = document.createElement("td");
        
        td.appendChild(image);
        td.innerHTML += "<p class='click'>click to see more</P>"
        td.appendChild(name);
        td.appendChild(detail_div);
        td.setAttribute("onclick", "productclick(this);")

        if(i%2 == 0){
            let tr = document.createElement("tr");
            tr.appendChild(td);
            table.appendChild(tr);
        }

        else{
            let tr = document.querySelector("#products-table tr:last-child");
            tr.appendChild(td);
        }
    }
}

function productclick(target){
    let childnodes = target.childNodes;
    let detail_container = childnodes[childnodes.length-1];
    
    if (detail_container.style.visibility == "visible"){
        detail_container.style.visibility = "hidden";
    }
    else{
        detail_container.style.visibility = "visible";
    }
}

document.getElementById('filterForm').onsubmit = function(){
    // 메인에서 스크롤 끝까지 안내리면 filter 이후에도 계속
    // infinite scroll 딸려오는 문제 있어서 counter 수정!
    // 가져오는 데이터가 없게 data의 개수보다 매우 크게 설정해줬다.
    counter = 1000;
    
    let category = this.elements[0].value;
    let keyword = this.elements[1].value;

    fetch("./product.json")
    .then(emptyTable())
    .then(response => {
        return response.json()
    })
    .then(data => dataFiltering(data, category, keyword))
    .then(data => makeHTML(data))
    .catch(error => {
        alert(error);
    });
    return false;
}

function dataFiltering(data, category, keyword){
    category_data = []

    // 전체 상품 카테고리이고, 검색어 따로 없으면
    if(category == 'all' && keyword == ""){
        // 로컬 서버 새로고침! 그러면 전체 상품에 무한스크롤 쓸 수 있다!
        window.location.reload();
        return false;
    }

    if(category == 'all'){
        category_data = JSON.parse(JSON.stringify(data));
    }
    else{
        data.forEach(function(element){
            if (element['category'] == category){
                category_data.push(element);
            }
        });
    }
    
    keyword_data = []
    if(keyword == ""){
        return category_data;
    }else{
        category_data.forEach(function(element){
            if (element['name'].includes(keyword) || element['info'].includes(keyword)){
                keyword_data.push(element);
            }
        });
        
    }

    return keyword_data;
}