module.exports = {
    apps: [
        {
            name: 'amplyfy-web',
            script: '.next/standalone/server.js',
            args: 'start',
            instances: 'max',
            exec_mode: 'cluster',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};
