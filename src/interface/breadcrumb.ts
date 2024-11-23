import { capitalize } from '../core/library';

export interface breadcrumbOptions {
    small?;
    sep?;
    formatter?;
    icon?;
}

export function buildBreadcrumb(pages, options?: breadcrumbOptions) {
    let breadcrumb = '';
    let last = pages.length - 1;
    options = Object.assign({
        sep: '-',
        formatter: (item => capitalize(item.match(/([A-Z]|^[a-z])[a-z]+/g).join(' '))),
        icon: '<i class="bi bi-question-circle"></i>'
    }, options || {})

    if (pages.length === 1)
        breadcrumb += `<li class="breadcrumb-icon">${options.icon}</li>`;
    else
        breadcrumb += `<li class="breadcrumb-icon"><a href="#${pages.slice(0, 1).join('-')}">${options.icon}</a></li>`;
    for (let p = 0, pl = pages.length; p < pl; p++) {
        let title = options.formatter(pages[p], p, last);
        if (p === last)
            breadcrumb += '<li class="breadcrumb-item active">' + title + '</li>';
        else
            breadcrumb += '<li class="breadcrumb-item" aria-current="page"><a href="#' + pages.slice(0, p + 1).join(options.sep) + '">' + title + '</a></li>';
    }
    if (options.small)
        return `<ol class="breadcrumb${this._small ? ' breadcrumb-sm' : ''}" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;flex-wrap: nowrap;">${breadcrumb}</ol>`;
    return '<ol class="float-start breadcrumb">' + breadcrumb + '</ol>';
}