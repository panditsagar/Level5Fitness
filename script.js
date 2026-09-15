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

  // Interactive Section 8 Checklist Cards Toggle
  const whoCards = document.querySelectorAll('.who-checklist-card');
  whoCards.forEach(card => {
    const checkbox = card.querySelector('.who-checkbox');
    if (checkbox) {
      const updateState = () => {
        if (checkbox.checked) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      };

      checkbox.addEventListener('change', updateState);
      updateState();
    }
  });
});
