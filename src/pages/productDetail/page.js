import { ProductData } from "../../data/product.js";
import { ProductGallery } from "../../data/productGallery.js";
import { htmlToFragment } from "../../lib/utils.js";
import { DetailView } from "../../ui/detail/index.js";
import { MignatureView } from "../../ui/mignature/index.js";
import template from "./template.html?raw";



let M = {
    products: [],
    Gall: []
};

M.getProductById = function(id){
    return M.products.find(product => product.id == id);
}

M.getProdGall=async function(productId){
    M.Gall = await ProductGallery.fetchGall(productId);
    
}

M.filterGallById = function(id) {
    // Convertir l'id en nombre car dataset renvoie toujours une chaîne
    const numId = parseInt(id, 10);
    const filteredImages = M.Gall.filter(image => image.id == numId);
    // Retourner le premier élément trouvé ou null
    return filteredImages.length > 0 ? filteredImages[0] : null;
}



let C = {};

C.handler_clickOnProduct = function(ev){
    if (ev.target.dataset.buy!==undefined){
        let id = ev.target.dataset.buy;
        alert(`Produit ajouté au panier ! (Quand il y en aura un)`);
    }
}

C.init = async function(params) {
    // Récupérer l'ID depuis les paramètres de route
    const productId = params.id;
    
    // Charger le produit et sa galerie depuis l'API
    M.products = await ProductData.fetchAll();
    M.Gall = await ProductGallery.fetchGall(productId);
    
    let p = M.getProductById(productId);
    
    let mignatureDOM = "";
    
        for (let image of M.Gall) {
            mignatureDOM += MignatureView.html(image);
        }
    

    

    return V.init(p,htmlToFragment(mignatureDOM));
}

C.handler_clickOnGallery = function(ev) {
    const clickedElement = ev.target.closest('[data-id]');
    if (!clickedElement) {
        console.log("No element with data-id found");
        return;
    }

    const imageId = clickedElement.dataset.id;
    console.log("Clicked image ID:", imageId);
    const gallItem = M.filterGallById(imageId);
    console.log("Gallery item found:", gallItem);

    if (!gallItem) {
        console.error("No gallery item found for ID:", imageId);
        return;
    }

    const mainImage = document.querySelector('#mainImage');
    if (!mainImage) {
        console.error("Main image element not found");
        return;
    }

    try {
        mainImage.src = `../../../public/productsImage/${gallItem.path}/${gallItem.image}.webp`;
        console.log("Updated main image src:", mainImage.src);
    } catch (error) {
        console.error("Error updating image:", error);
    }
}



let V = {};

V.initMobileNavigation = function(container) {
    const galleryContainer = container.querySelector('#migniatureContainer');
    const prevButton = container.querySelector('#prevButton');
    const nextButton = container.querySelector('#nextButton');
    
    if (!galleryContainer || !prevButton || !nextButton) {
        console.log("Missing elements:", { galleryContainer, prevButton, nextButton });
        return;
    }

    // Détermine si on est en mode desktop
    const isDesktop = () => window.innerWidth >= 1024;

    // Scroll par item
    const getScrollAmount = () => {
        const firstItem = galleryContainer.firstElementChild;
        if (!firstItem) return 0;
        // En desktop, utiliser la hauteur + marge, sinon la largeur + marge
        if (isDesktop()) {
            return firstItem.offsetHeight + parseInt(getComputedStyle(firstItem).marginBottom, 10);
        } else {
            return firstItem.offsetWidth + parseInt(getComputedStyle(firstItem).marginRight, 10);
        }
    };

    // Navigation précédente (haut/gauche)
    prevButton.addEventListener('click', () => {
        const scrollAmount = getScrollAmount();
        if (scrollAmount) {
            if (isDesktop()) {
                galleryContainer.scrollBy({
                    top: -scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                galleryContainer.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    });

    // Navigation suivante (bas/droite)
    nextButton.addEventListener('click', () => {
        const scrollAmount = getScrollAmount();
        if (scrollAmount) {
            if (isDesktop()) {
                galleryContainer.scrollBy({
                    top: scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                galleryContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    });

    // Mise à jour de la visibilité des boutons
    const updateButtonsVisibility = () => {
        // Calculer le nombre total d'éléments visibles et leur taille
        const items = galleryContainer.children;
        const itemCount = items.length;
        if (itemCount === 0) return;

        if (isDesktop()) {
            // Mode desktop (vertical)
            const containerHeight = galleryContainer.clientHeight;
            const totalHeight = galleryContainer.scrollHeight;
            const currentScroll = galleryContainer.scrollTop;

            const isAtStart = currentScroll <= 0;
            const isAtEnd = Math.ceil(currentScroll + containerHeight) >= totalHeight;

            prevButton.style.opacity = isAtStart ? '0.5' : '1';
            nextButton.style.opacity = isAtEnd ? '0.5' : '1';
        } else {
            // Mode mobile (horizontal)
            const containerWidth = galleryContainer.clientWidth;
            const totalWidth = galleryContainer.scrollWidth;
            const currentScroll = galleryContainer.scrollLeft;

            const isAtStart = currentScroll <= 0;
            const isAtEnd = Math.ceil(currentScroll + containerWidth) >= totalWidth;

            prevButton.style.opacity = isAtStart ? '0.5' : '1';
            nextButton.style.opacity = isAtEnd ? '0.5' : '1';

            console.log('Scroll state:', {
                containerWidth,
                totalWidth,
                currentScroll,
                isAtStart,
                isAtEnd
            });
        }
    };

    galleryContainer.addEventListener('scroll', updateButtonsVisibility);
    window.addEventListener('resize', () => {
        // Reset scroll position on layout change
        galleryContainer.scrollTop = 0;
        galleryContainer.scrollLeft = 0;
        updateButtonsVisibility();
    });
    updateButtonsVisibility(); // État initial
}

V.init = function(data, gallery) {
    let fragment = V.createPageFragment(data);
    
    // Ajouter les miniatures au conteneur directement dans le fragment
    let mignatureContainer = fragment.querySelector('#migniatureContainer');
    if (mignatureContainer) {
        mignatureContainer.appendChild(gallery);
        // Initialiser la navigation mobile
        V.initMobileNavigation(fragment);
    }
    
    V.attachEvents(fragment);

    return fragment;
}

V.createPageFragment = function(data) {
    // Créer le fragment depuis le template
    let pageFragment = htmlToFragment(template);
    
    // Générer le composant detail
    let detailDOM = DetailView.dom(data);
    
    // Remplacer le slot par le composant detail
    pageFragment.querySelector('slot[name="detail"]').replaceWith(detailDOM);
    
    return pageFragment;
}

V.attachEvents = function(container) {
    // Attacher un event listener au bouton
    const addToCartBtn = container.querySelector('[data-buy]');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', C.handler_clickOnProduct);
    }
    
    const gallery = container.querySelector('#migniatureContainer');
    if (gallery) {
        gallery.addEventListener('click', C.handler_clickOnGallery);
    }
    
    return container;
}

// Helper function to render a single gallery image
V.renderMignature = function(imageData) {
    return MignatureView.html(imageData);
}

export function ProductDetailPage(params) {
    console.log("ProductDetailPage", params);
    return C.init(params);
}
