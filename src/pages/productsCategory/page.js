import { ProductData } from "../../data/product.js";
import { ProductView } from "../../ui/product/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
// import { HeaderView } from "../../ui/header/index.js";


let M = {
    products: []
};

// M.productsByCategory = async function(categoryId){
//     if (categoryId === 1){
//         M.products = await ProductData.fetchAll();
//     } else {
//         M.products = await ProductData.fetchByCategory(categoryId);
//     }
//     return M.products;
// }
M.cats = await ProductData.fetchCategories();

let C = {};

C.handler_clickOnProduct = function(ev){
    if (ev.target.dataset.buy!==undefined){
        let id = ev.target.dataset.buy;
        alert(`Le produit d'identifiant ${id} ? Excellent choix !`);
    }
}

// C.handler_clickOnCategory = async function(ev){
//     console.log("Category ID:", id);
//     if (ev.target.dataset.category !== undefined){
//         let id = ev.target.dataset.id;
        
//         const products = await M.productsByCategory(id);
//         const root = document.querySelector('#app');
//         const newContent = await V.renderCat(products);
//         root.replaceChildren(newContent);
//     }
// }

C.init = async function(param){
    
    for (let cat of M.cats){
        if (cat.name == param.category){
            console.log("Cat found:", cat);

            M.products = await ProductData.fetchByCategory(cat.id);
            console.log(M.products);
        }
    }

    return V.init( M.products );
}



let V = {};

V.init = function(data){
    let fragment = V.createPageFragment(data);
    V.attachEvents(fragment);
    return fragment;
}
// V.renderCat = async function(data){
    
    
//     let newFragment = V.createPageFragment(data);
//     V.attachEvents(newFragment);
//     return newFragment;

// }

V.createPageFragment = function( data ){
   // Créer le fragment depuis le template
   let pageFragment = htmlToFragment(template);
   
   // Générer les produits
   let productsDOM = ProductView.dom(data);
   
   // Remplacer le slot par les produits
   pageFragment.querySelector('slot[name="products"]').replaceWith(productsDOM);
   
   return pageFragment;
}

V.attachEvents = function(pageFragment) {
    let root = pageFragment.firstElementChild;
    root.addEventListener("click", C.handler_clickOnProduct);
    // root.addEventListener("click", C.handlerRetrieveId);
    // let header = HeaderView.dom();
    // header.addEventListener("click", C.handler_clickOnCategory);
    return pageFragment;
}

export function ProductsCategoryPage(params) {
    console.log("ProductsCategoryPage", params);
    return C.init(params);
}

