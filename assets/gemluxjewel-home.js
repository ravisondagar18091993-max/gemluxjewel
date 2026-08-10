document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.gemluxjewel-hero__media-wrap video').forEach(function (video) {
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  });
});
