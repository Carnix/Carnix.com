const fmtQty = ({ amount, unit }) =>
    unit ? `${amount} ${unit}` : amount;

const renderIngredient = (ing) => `
    <li>
        <span class="ing-qty">${fmtQty(ing)}</span>
        <span class="ing-item">${ing.item}</span>
        ${ing.notes ? `<span class="ing-note">${ing.notes}</span>` : ''}
    </li>`;

const renderBody = (recipe) => {
    const hasDetail = recipe.ingredients.length > 0;

    const notesHtml = recipe.notes
        ? `<p class="recipe-notes">${recipe.notes}</p>`
        : '';

    const detailHtml = hasDetail ? `
        <div class="section-ingredients">
            <h3>ingredients</h3>
            <ul class="ingredients-list">
                ${recipe.ingredients.map(renderIngredient).join('')}
            </ul>
        </div>
        <div class="section-instructions">
            <h3>instructions</h3>
            <ol class="instructions-list">
                ${recipe.instructions.map(s => `<li>${s}</li>`).join('')}
            </ol>
        </div>` : `<p class="stub-notice">full recipe not yet documented</p>`;

    const oqHtml = recipe.open_questions?.length ? `
        <div class="open-questions">
            <p>open questions</p>
            <ul>${recipe.open_questions.map(q => `<li>${q}</li>`).join('')}</ul>
        </div>` : '';

    return `${notesHtml}${detailHtml}${oqHtml}`;
};

const renderRecipe = (recipe, i) => {
    const meta = [
        recipe.category,
        recipe.contributor ? `by ${recipe.contributor}` : null,
        recipe.week_logged ? `week of ${recipe.week_logged}` : null,
    ].filter(Boolean).map(s => `<span>${s}</span>`).join('');

    return `
    <article class="recipe" data-status="${recipe.status}" data-index="${i}">
        <div class="recipe-header">
            <span class="status-badge ${recipe.status}">${recipe.status}</span>
            <h2>${recipe.title}</h2>
            <div class="recipe-meta">${meta}</div>
            <span class="expand-hint">[+]</span>
        </div>
        <div class="recipe-body" hidden>
            ${renderBody(recipe)}
        </div>
    </article>`;
};

const updateCount = (filter) => {
    const total = document.querySelectorAll('.recipe').length;
    const visible = document.querySelectorAll(`.recipe:not(.hidden)`).length;
    const el = document.getElementById('recipe-count');
    el.textContent = filter === 'all'
        ? `${total} recipes`
        : `${visible} of ${total} recipes`;
};

const applyFilter = (filter) => {
    document.querySelectorAll('.recipe').forEach(el => {
        const match = filter === 'all' || el.dataset.status === filter;
        el.classList.toggle('hidden', !match);
    });
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    updateCount(filter);
};

const init = async () => {
    const res = await fetch('./data/data.json');
    const data = await res.json();

    const list = document.getElementById('recipe-list');
    list.innerHTML = data.recipes.map(renderRecipe).join('');

    list.addEventListener('click', e => {
        const header = e.target.closest('.recipe-header');
        if (!header) return;
        const recipe = header.closest('.recipe');
        const body = recipe.querySelector('.recipe-body');
        const hint = header.querySelector('.expand-hint');
        const isOpen = recipe.classList.toggle('open');
        body.hidden = !isOpen;
        hint.textContent = isOpen ? '[-]' : '[+]';
    });

    document.getElementById('filters').addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (btn) applyFilter(btn.dataset.filter);
    });

    applyFilter('all');
};

init();
