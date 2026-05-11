const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');


// MAIN TABS

tabs.forEach(tab => {

  tab.addEventListener('click', () => {

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');

    const target = tab.dataset.tab;

    document
      .getElementById(target)
      .classList.add('active');

  });

});


// STATS SUB TABS

const statsButtons = document.querySelectorAll('.stats-btn');

statsButtons.forEach(btn => {

  btn.addEventListener('click', () => {

    statsButtons.forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    // nanti bisa dihubungkan ke API statistik

  });

});
