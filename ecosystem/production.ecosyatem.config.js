module.exports = {
  apps: [
    {
      name: 'instructorattendanceservice-production',
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
