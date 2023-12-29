const fetch_API = async (api) => {//async có nhiệm vụ: biến hàm này thành hàm promise de chờ đợi
    let response = await fetch(api);//await: chờ cho fetch thực hiện xong thì mới sử dụng cho các lệnh phía dưới
    //console.log(response);// trả ra {pending} vì fetch là hàm bdb nó khg chờ fetch xong mà gán liển ngay lập tức
    let result = await response.json();//await: chờ cho response.json() thực hiện xong thì mới sử dụng cho các lệnh phía dưới
    return result;
};


//queries
const queries={
    totalPage:0,
    keyword:"",
    page: 1,
    limit: 4,
    sort:"",
    order:"",
    category:""
};
//End queries


//ẩn hiện nút prev next
const AnHienNut=()=>{
    if(queries.page<=1)
        NutBamPrve.classList.add("hidden");
    else
        NutBamPrve.classList.remove("hidden");

    if(queries.page>=queries.totalPage)
        NutBamNext.classList.add("hidden");
    else
        NutBamNext.classList.remove("hidden");
}
//

// tính sô lượng page
const drawPagination=()=>{
    let stringCategory="";
    if(queries.category)
        stringCategory=`&category=${queries.category}`;

    const api = `http://localhost:3000/products?q=${queries.keyword}&_sort=${queries.sort}&_order=${queries.order}${stringCategory}`;
    fetch_API(api)
    .then((data) =>{
        const n=Math.ceil(data.length/queries.limit);
        queries.totalPage=n;
        //console.log(queries.totalPage);

        AnHienNut();
    });
}

//

//xây dựng hàm để gọn code

//hàm 1: vẽ ra danh sách sản phẩm
const drawProducts = () => {
    let stringCategory="";
    if(queries.category)
        stringCategory=`&category=${queries.category}`;
    const api = `http://localhost:3000/products?q=${queries.keyword}&_page=${queries.page}&_limit=${queries.limit}&_sort=${queries.sort}&_order=${queries.order}${stringCategory}`;

    fetch_API(api)
        .then((data) => { //mục địch của .then là chờ đợi thằng fetch api xong
            //console.log(data);
            const arrayHTML = data.map(item => (
                `
            <div class="products__item">
            <div class="products__image">
                <img src="${item.thumbnail}" alt="${item.title}">
                <div class="products__discount">
                ${item.discountPercentage}%
                </div>
            </div>
            <div class="products__content">
                <div class="products__title">
                ${item.title}
                </div>
                <div class="products__info">
                    <div class="products_price">
                    ${item.price} $
                    </div>
                    <div class="products__stock">
                    ${item.stock} SP
                    </div>
                </div>
            </div>
        </div>
            `
            ))

            //console.log(arrayHTML);//30 cái chuỗi string
            const elementProducts = document.querySelector("#products");

            if(data.length){
                //console.log(elementProducts);
                //console.log(typeof(elementProducts));  //object
                elementProducts.innerHTML = arrayHTML.join("");//quăng content(arrayHTML.join("")) vào bên trong tag div(elementProducts)
            }
            else{
                elementProducts.innerHTML=`<div class="not-found">khong tim thay bae à</div>`;
            }
                

            
            drawPagination();
        });
}


//

//display list product
drawProducts();
//End display list product



//tìm kiếm
const timKiem = document.querySelector("#form-search");
timKiem.addEventListener("submit", (event) => {
    event.preventDefault();//chống load lại trang khi submit
    //console.log(event);
    const noidungtrongInput = event.target.elements.keywordCanTim.value;
    console.log(noidungtrongInput);

    queries.keyword=noidungtrongInput;
    drawProducts();
})
//End tìm kiếm


//phân trang pagination
const NutBamNext=document.querySelector("#pagination-next");
const NutBamPrve=document.querySelector("#pagination-prev");

const paginationNumber=document.querySelector("#pagination-number");

NutBamNext.addEventListener("click",()=>{
    if(queries.page<queries.totalPage) 
    {
        ++queries.page;
        drawProducts();
        paginationNumber.innerHTML=queries.page;
    }
});

NutBamPrve.addEventListener("click",()=>{
    if(queries.page>1)
    {
        --queries.page;
        drawProducts();
        paginationNumber.innerHTML=queries.page;
    }
});
//End phân trang pagination


//sort
const sapXep=document.querySelector("#sort");
sapXep.addEventListener("change",(e) =>{
    const giaTri=e.target.value;
    const [a,b]=giaTri.split("-");

    console.log(a);
    console.log(b);
    
    queries.sort=a;
    queries.order=b;
    drawProducts();
})
//end sort



//in ra Category
const drawCategory = () => {
    const api = `http://localhost:3000/category`;

    fetch_API(api)
        .then((data) => { //mục địch của .then là chờ đợi thằng fetch api xong
            const arrayHTML = data.map(item => (
                `
                <div class="category__item" button-category="${item}">
                    ${item}
                </div>
                `
            ))

            const elementCategory = document.querySelector("#category");
            elementCategory.innerHTML = arrayHTML.join("");

            const nutBamcategory=document.querySelectorAll("[button-category]")
            //console.log(nutBamcategory);
            nutBamcategory.forEach(ItemNutBam => {
                ItemNutBam.addEventListener("click",()=>{
                    //console.log(ItemNutBam);
                    const giaTri=ItemNutBam.getAttribute("button-category");
                    console.log(giaTri);
                    queries.category=giaTri;
                    drawProducts();
                });
            });
        });
}

drawCategory();
//End in ra Category