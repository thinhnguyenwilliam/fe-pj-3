const fetch_API = async (api) => {//async có nhiệm vụ: biến hàm này thành hàm promise de chờ đợi
    let response = await fetch(api);//await: chờ cho fetch thực hiện xong thì mới sử dụng cho các lệnh phía dưới
    //console.log(response);// trả ra {pending} vì fetch là hàm bdb nó khg chờ fetch xong mà gán liển ngay lập tức
    let result = await response.json();//await: chờ cho response.json() thực hiện xong thì mới sử dụng cho các lệnh phía dưới
    return result;
};


//queries
const queries={
    keyword:""
};
//End queries



//xây dựng hàm để gọn code

//hàm 1: vẽ ra danh sách sản phẩm
const drawProducts = () => {
    const api=`http://localhost:3000/products?q=${queries.keyword}`;
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
            //console.log(elementProducts);
            //console.log(typeof(elementProducts));  //object
            elementProducts.innerHTML = arrayHTML.join("");//quăng content(arrayHTML.join("")) vào bên trong tag div(elementProducts)
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