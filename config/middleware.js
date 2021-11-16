module.exports = {
    settings: {
        gzip: {
            enabled: true,
            options: {
                br: true,
                threshold: 2048
            }
        },
	cache: {
            enabled: true,
            models: ['articles', 'article-tags', 'galleries', 'gallery-categories', 'gallery-images', 'gallery-tags', 'manufacturers', 'models', 'model-tags', 'pages', 'scales']
        }
    }
}
