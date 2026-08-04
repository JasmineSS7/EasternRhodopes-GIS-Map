/**
 * Lightbox Gallery Modal Controller
 */
export class Gallery {
  constructor() {
    this.modal = document.getElementById('gallery-modal');
    this.imgEl = document.getElementById('gallery-current-img');
    this.captionEl = document.getElementById('gallery-caption');
    this.images = [];
    this.currentIndex = 0;

    document.getElementById('modal-close').addEventListener('click', () => this.close());
    document.getElementById('gallery-prev').addEventListener('click', () => this.prev());
    document.getElementById('gallery-next').addEventListener('click', () => this.next());
  }

  open(images, caption = '') {
    if (!images || images.length === 0) return;
    this.images = images;
    this.currentIndex = 0;
    this.captionEl.textContent = caption;
    this.updateImage();
    this.modal.classList.remove('hidden');
  }

  close() {
    this.modal.classList.add('hidden');
  }

  updateImage() {
    this.imgEl.src = this.images[this.currentIndex];
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }
}