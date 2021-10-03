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
            models: ['articles', 'galleries', 'models']
        }
    }
}
