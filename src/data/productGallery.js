import {getRequest} from '../lib/api-request.js';


let ProductGallery = {};

let fakeGallery = [
    {
        id: 1,
        idProd: 1,
        image: "marteau1",
    },
    {
        id: 2,
        idProd: 1,
        image: "marteau2",
    },
    {
        id: 3,
        idProd: 1,
        image: "marteau3",
    },
    {
        id: 4,
        idProd: 2,
        image: "tournevis1",
    },
    {
        id: 5,
        idProd: 2,
        image: "tournevis2",
    },
    {
        id: 6,
        idProd: 3,
        image: "cle1",
    },
    {
        id: 7,
        idProd: 3,
        image: "cle2",
    },
    {
        id: 8,
        idProd: 3,
        image: "cle3",
    },
    {
        id: 9,
        idProd: 4,
        image: "pince1",
    }
]

ProductGallery.fetch = async function(id){
    let data = await getRequest('productgalleries/'+id);
    return data==false ? fakeGallery.find(g => g.id === id) : data;
}

ProductGallery.fetchAll = async function(){
    let data = await getRequest('productgalleries');
    return data==false ? fakeGallery : data;
}

ProductGallery.fetchGall = async function(idProd){
    let data = await getRequest('productgalleries?idProd='+idProd);
    return data==false ? fakeGallery.filter(g => g.idProd === parseInt(idProd)) : data;
}

export {ProductGallery};