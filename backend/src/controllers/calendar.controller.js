const { Calendar, History } = require("../models");

const createCalendar = async (request, response) => {
    try {
        const { startTime, endTime, slot, subscriber  } = request.body;
        const { storeid } = request.headers;
        const calendar = new Calendar({
            startTime,
            endTime,
            slot,
            subscriber,
            store: storeid,
        })
        await calendar.save();
        return response.status(200).json("OK");
    } catch (error) {
        return response.status(500).json(error);
    }
};

const getCalendar = async (request, response) => {
    try {
        const { fromStartTime, toStartTime, userId } = request.query;
        const { storeid } = request.headers;
        let calendars;
        if (storeid) {
            calendars = Calendar.find({ store: storeid });
        } else {
            calendars = Calendar.find({});
        }
        let startTimeCompare = {};

        if (fromStartTime) {
            startTimeCompare.$gte = new Date(fromStartTime);
        }

        if (toStartTime) {
            startTimeCompare.$lt = new Date(toStartTime);
        }

        if (userId) {
            calendars = calendars.where("subscriber").equals(userId);
        }

        if (Object.keys(startTimeCompare).length > 0) {
            calendars = calendars.where("startTime").equals(startTimeCompare);
        }

        calendars = await calendars
            .sort({ startTime: 1 })
            .populate("subscriber", ["-tokens"]);

        return response.status(200).json(calendars);
    } catch (error) {
        return response.status(500).json("ERROR");
    }
};

const registerCalendar = async (request, response) => {
    try {
        const { id } = request.body;

        const user = request.user;

        const calendar = await Calendar.findById(id);

        if (!calendar) return response.status(404).json("Không tìm thấy lịch");

        if (calendar.slot === calendar.subscriber.length) {
            return response.status(400).json("Full Slot");
        }

        if (calendar.subscriber.includes(user._id)) {
            return response
                .status(400)
                .json("Nhân viên đã đăng kí khung giờ này");
        }

        calendar.subscriber = [...calendar.subscriber, user._id];
        await calendar.save();

        return response.status(200).json("OK");
    } catch (error) {
        console.log(error);
        return response.status(500).json("ERROR");
    }
};

const cancelRegisterCalendar = async (request, response) => {
    try {
        const { id } = request.body;

        const user = request.user;

        const calendar = await Calendar.findById(id);

        if (!calendar) return response.status(404).json("Không tìm thấy lịch");

        if (calendar.slot === calendar.subscriber.length) {
            return response.status(400).json("Full Slot");
        }

        if (!calendar.subscriber.includes(user._id)) {
            return response
                .status(400)
                .json("Nhân viên chưa đăng kí khung giờ này");
        }

        calendar.subscriber = calendar.subscriber.filter(
            (item) => !item.equals(user._id)
        );

        await calendar.save();

        return response.status(200).json("OK");
    } catch (error) {
        console.log(error);
        return response.status(500).json("ERROR");
    }
};

const deleteSpecificCalendar = async (request, response) => {
    try {
        const { id } = request.params;

        const calendar = await Calendar.findById(id);

        if (!calendar) return response.status(404).json("Không tìm thấy lịch");

        await calendar.delete();

        return response.status(200).json("OK");
    } catch (error) {
        console.log(error);
        return response.status(500).json("ERROR");
    }
};

module.exports = {
    createCalendar,
    getCalendar,
    registerCalendar,
    cancelRegisterCalendar,
    deleteSpecificCalendar,
};
