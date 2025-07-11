// Create image preview block
const imagePreviewElem = document.createElement('div')
imagePreviewElem.innerHTML = '<div class="imagePreview"> <div class="imagePreview-background"></div> <div class="imagePreview-image"> <img class="imagePreview-image-element" style="cursor: pointer"> <a target="_blank" class="imagePreview-image-caption">Open image page</a> </div> </div>'

const bodyElem = document.querySelector('body')
bodyElem.insertBefore(imagePreviewElem.firstChild, bodyElem.firstChild)

initChanges()
window.navigation.addEventListener("navigate", (event) => {
    initChanges()
})

function initChanges() {
    makeImagesClickable()
    //headerStyling()
}

function makeImagesClickable() {
    const background = document.querySelector('.imagePreview-background')
    background.addEventListener('click', hideImagePreview)
    
    const images = document.querySelectorAll("figure[typeof~='mw:File/Thumb'] a, figure[typeof~='mw:File'] a, .hedgedocs-infobox-image a, .gallery .gallerybox .thumb a")
    
    for(let i = 0; i < images.length; i++) {
        const imageClickable = images[i]
        const image = imageClickable.querySelector('img')
        
        let originalLocation = imageClickable.getAttribute('data-image-page')
        if (!originalLocation) {
            originalLocation = imageClickable.href
            imageClickable.removeAttribute('href')
            imageClickable.setAttribute('data-image-page', originalLocation)
        }

        imageClickable.setAttribute('style', 'cursor: pointer')
        imageClickable.addEventListener('click', () => imageClicked(originalLocation, image))
    }
}

function hideImagePreview(event) {
    const imageDiv = document.querySelector('.imagePreview-image')
    imageDiv.classList.add('scaledown')
    imageDiv.classList.remove('scaleup')

    const background = document.querySelector('.imagePreview')
    background.style.opacity = '0%'
    setTimeout(() => {
        background.style.display = 'none'
        const imageElem = document.querySelector('.imagePreview-image-element')
        imageElem.src = ''
    }, 250)
    makeImagesClickable()
}

function imageClicked(originalLocation, image) {
    const background = document.querySelector('.imagePreview')
    background.style.display = 'inherit'
    setTimeout(() => {
        background.style.opacity = '100%'

        const imageDiv = document.querySelector('.imagePreview-image')
        imageDiv.style.display = 'flex'
        imageDiv.classList.add('scaleup')
        imageDiv.classList.remove('scaledown')
        const imageElem = document.querySelector('.imagePreview-image-element')

        // Get non-thumbnail version
        let originalImageSource = image.src
        if (originalImageSource.includes('thumb/')) {
            originalImageSource = image.src.replace('thumb/', '')
            originalImageSource = originalImageSource.substring(0, originalImageSource.lastIndexOf('/'))
        }

        imageElem.src = originalImageSource
        imageElem.alt = image.alt

        const imageCaption = document.querySelector('.imagePreview-image-caption')
        imageCaption.href = originalLocation
    }, 20)
}

function headerStyling() {
    const header = document.querySelector('body > div:nth-child(3) > header > div.vector-header-start > a > span')

    if (header && header.children.length == 1) {
        const div = document.createElement('span')
        div.classList.add('logo-text')
        div.innerHTML = '<span class="md-ellipsis" style="font-weight: 900;">Hedge</span><span class="md-ellipsis" style="font-weight: 100;">Docs</span>'

        header.replaceChildren(div)
    }
}
