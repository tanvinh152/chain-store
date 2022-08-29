function getDocs(request, response) {
    console.log('HELLO LEDUTU')
    return response.render('openapi/index');
}

module.exports = {
    getDocs,
}