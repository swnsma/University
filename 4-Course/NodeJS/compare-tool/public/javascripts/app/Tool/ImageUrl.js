function ImageUrls(url, component)
{
    this.url = url;
    this.baseUrl = 'baseLine/' + component + '/' + url;
    this.currentUrl = 'currentLine/' + component + '/' + url;
}
