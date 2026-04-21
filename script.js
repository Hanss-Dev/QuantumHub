(function() {
  // Page loader hide
  var pageLoader = document.getElementById('page-loader');
  
  function hidePageLoader() {
    if (pageLoader && !pageLoader.classList.contains('hide')) {
      pageLoader.classList.add('hide');
      setTimeout(function() {
        pageLoader.style.display = 'none';
      }, 450);
    }
  }
  
  if (document.readyState === 'complete') {
    setTimeout(hidePageLoader, 300);
  } else {
    window.addEventListener('load', function() {
      setTimeout(hidePageLoader, 300);
    });
  }

  // Routing for loader/tester paths
  function handleRouting() {
    var path = window.location.pathname;
    var hash = window.location.hash;
    var appLanding = document.getElementById('app-landing');
    var appLoader = document.getElementById('app-loader');

    var isLoaderOrTester =
      path.includes('/loader') ||
      path.includes('/tester') ||
      hash.includes('#/loader') ||
      hash.includes('#/tester') ||
      hash === '#loader' ||
      hash === '#tester';

    if (isLoaderOrTester) {
      appLanding.style.display = 'none';
      appLoader.style.display = 'flex';
      document.title = 'Access Denied';

      var statusElement = document.getElementById('status');
      statusElement.textContent = 'Checking access for loader and tester...\nAccess denied. Please contact support.';
    } else {
      appLanding.style.display = 'block';
      appLoader.style.display = 'none';
    }
  }

  window.addEventListener('load', handleRouting);
  window.addEventListener('hashchange', handleRouting);

  // Intersection Observer for reveal animations
  var revealElements = document.querySelectorAll('.sec');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px' });
  
  revealElements.forEach(function(el) {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();