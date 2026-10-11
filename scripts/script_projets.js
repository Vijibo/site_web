const projectFilters = document.querySelectorAll('[data-project-filter]');
const projectCards = document.querySelectorAll('.project-link[data-category]');
const projectFilterStatus = document.getElementById('project-filter-status');

if (projectFilters.length && projectCards.length && projectFilterStatus) {
  let activeProjectFilter = 'all';

  function updateProjectFilter(filter) {
    activeProjectFilter = filter;
    let visibleCount = 0;

    projectCards.forEach(card => {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible) visibleCount++;
    });

    projectFilters.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.projectFilter === filter));
    });

    const countKey = visibleCount === 1 ? 'projects.filter.count.one' : 'projects.filter.count';
    const countTemplate = I18N[currentLang][countKey];
    projectFilterStatus.textContent = countTemplate.replace('{count}', visibleCount);
  }

  projectFilters.forEach(button => {
    button.addEventListener('click', () => updateProjectFilter(button.dataset.projectFilter));
  });

  document.addEventListener('siteLanguageChanged', () => {
    updateProjectFilter(activeProjectFilter);
  });

  updateProjectFilter(activeProjectFilter);
}
