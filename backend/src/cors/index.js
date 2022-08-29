const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE'
    ],

    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'storeId'
    ],
};

module.exports = corsOpts;
