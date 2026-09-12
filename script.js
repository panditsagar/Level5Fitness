// Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
  console.log('Level 5 Fitness initialized.');

  // Interactive Before/After Image Comparison Slider
  const sliders = document.querySelectorAll('.ba-slider-container');

  sliders.forEach(slider => {
    const rangeInput = slider.querySelector('.ba-range-input');
    const afterLayer = slider.querySelector('.ba-after-layer');
    const handle = slider.querySelector('.ba-handle');

    if (rangeInput && afterLayer && handle) {
      const updateSlider = (val) => {
        afterLayer.style.clipPath = `inset(0 0 0 ${val}%)`;
        handle.style.left = `${val}%`;
      };

      // Native range drag event
      rangeInput.addEventListener('input', (e) => {
        updateSlider(e.target.value);
      });

      // Initialize default position
      updateSlider(rangeInput.value || 50);
    }
  });
});
