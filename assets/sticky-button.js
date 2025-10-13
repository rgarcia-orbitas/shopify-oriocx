function handleStickyButtonOnScroll() {
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) return;
  
  const productForm = document.querySelector('product-form');
  
  if (!productForm) return;
  
  const offset = 300;
  let isSticky = false;
  let lastScrollY = window.scrollY;
  const productFormTop = productForm.getBoundingClientRect().top + window.scrollY;
  
  function toggleStickyClass() {
    const shouldBeSticky = window.scrollY > productFormTop + offset;
    
    if (shouldBeSticky !== isSticky) {
      isSticky = shouldBeSticky;
      
      if (shouldBeSticky) {
        productForm.classList.add('sticky-button');
      } else {
        productForm.classList.remove('sticky-button');
      }
    }
  }
  
  toggleStickyClass();
  
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        toggleStickyClass();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  window.addEventListener('resize', function() {
    toggleStickyClass();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleStickyButtonOnScroll);
} else {
  handleStickyButtonOnScroll();
}