import { capitalize } from '../library';

export function buildBreadcrumb(pages, small?, sep?, formatter?) {
    let breadcrumb = '';
    let last = pages.length - 1;
    sep = sep || '-';
    formatter = formatter || (item => capitalize(item.match(/([A-Z]|^[a-z])[a-z]+/g).join(' ')));
    if (pages.length === 1)
        breadcrumb += '<li class="breadcrumb-icon"><i class="float-start fas fa-cogs" style="padding: 2px;margin-right: 2px;"></i></li>';
    else
        breadcrumb += '<li class="breadcrumb-icon"><a href="#' + pages.slice(0, 1).join('-') + '"><i class="float-start fas fa-cogs" style="padding: 2px;margin-right: 2px;"></i></a></li>';
    for (let p = 0, pl = pages.length; p < pl; p++) {
        let title = formatter(pages[p], p,  last);
        if (p === last)
            breadcrumb += '<li class="breadcrumb-item active">' + title + '</li>';
        else
            breadcrumb += '<li class="breadcrumb-item" aria-current="page"><a href="#' + pages.slice(0, p + 1).join(sep) + '">' + title + '</a></li>';
    }
    if (small)
        `<ol class="breadcrumb${this._small ? ' breadcrumb-sm' : ''}" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;flex-wrap: nowrap;">${breadcrumb}</ol>`;
    return '<ol class="float-start breadcrumb">' + breadcrumb + '</ol>';
}