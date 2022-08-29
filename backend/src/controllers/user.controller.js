const { HTTP_STATUS, HTTP_TEXT } = require('../constant');
const { error } = require('../interfaces');
const { User } = require('../models');
const bcrypt = require('bcrypt');

function me(request, response) {
    try {
        const user = request.user;
        delete user._doc.tokens;
        return response.status(HTTP_STATUS.OK).json(user);
    } catch (err) {
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
}

async function logout(request, response) {
    try {
        let user = request.user;
        const token = request.token;
        user.tokens = user.tokens.filter((item) => item.token !== token);
        await user.save();

        return response.status(HTTP_STATUS.OK).json('OK');
    } catch (err) {
        console.log(err);
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
}

async function setRole(request, response) {
    try {
        const { id } = request.params;
        const { role } = request.body;

        const user = await User.findById(id);

        if (request.user._id.equals(user._id)) {
            return response
                .status(HTTP_STATUS.INVALID_INPUT)
                .json('Bạn không thể tự gán quyền chính mình');
        }

        if (!user) {
            return response
                .status(HTTP_STATUS.NOT_FOUND)
                .json(HTTP_TEXT.NOT_FOUND);
        }

        user.role = role;
        await user.save();

        return response.status(HTTP_STATUS.OK).json('OK');
    } catch (err) {
        console.log(err);
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
}

async function getAllUser(request, response) {
    try {
        const { storeid } = request.headers;
        const { storeId, staffName, is_hide} = request.query

        let users = User.find({});;
        if(storeid){
            users = users.where('store').equals(storeid)
        }
        if(storeId){
            users = users.where('store').equals(storeId)
        }
        if(staffName){
            users = users.where('profile.full_name').equals({ $regex: new RegExp(staffName, 'i') });    
        }
        if(is_hide){
            users = users.where('is_hide').equals(is_hide);    
        }
        users = await users
        .sort({ createdAt: 1 })
        .populate('store')
        .select('-createdAt -updatedAt -__v');
        if (storeid) {
            users = users.filter((arr) => arr.role === 0);
        } else {
            users = users.filter((arr) => arr.role !== 2);
        }
        return response.status(HTTP_STATUS.OK).json(users);
    } catch (err) {
        console.log(err);
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
}
async function getAllUserOfStore(request, response) {
    try {
        const { store } = request.params;

        let users;

        users = await User.find({store})
            .populate('store')
            .select(['profile', '_id', 'username', 'store', 'role', 'is_hide']);
        users = users.filter((arr) => arr.role !== 2);

        return response.status(HTTP_STATUS.OK).json(users);
    } catch (err) {
        console.log(err);
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
}
async function getUserDetail(request, response) {
    try {
        const { id } = request.params;

        const user = await User.findById(id);

        if (!user) {
            return response
                .status(HTTP_STATUS.NOT_FOUND)
                .json(HTTP_TEXT.NOT_FOUND);
        }

        return response.status(HTTP_STATUS.OK).json(user);
    } catch (err) {
        console.log(err);
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
}

async function editUserDetail(request, response) {
    try {
        const { id } = request.params;
        const { profile, is_hide } = request.body;

        const user = await User.findById(id);

        if (!user) {
            return response
                .status(HTTP_STATUS.NOT_FOUND)
                .json(HTTP_TEXT.NOT_FOUND);
        }


        user.profile = { ...user.profile, ...profile };
        user.is_hide = is_hide;

        await user.save();
        return response.status(HTTP_STATUS.OK).json(HTTP_TEXT.OK);
    } catch (err) {
        console.log(err);
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
}

async function deleteUserDetail(request, response) {
    try {
        const { id } = request.params;

        const user = await User.findById(id);

        if (!user) {
            return response
                .status(HTTP_STATUS.NOT_FOUND)
                .json(HTTP_TEXT.NOT_FOUND);
        }

        await user.delete();

        return response.status(HTTP_STATUS.OK).json(HTTP_TEXT.OK);
    } catch (err) {
        console.log(err);
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
}

module.exports = {
    me,
    logout,
    setRole,
    getAllUser,
    getUserDetail,
    editUserDetail,
    deleteUserDetail,
    getAllUserOfStore,
};
