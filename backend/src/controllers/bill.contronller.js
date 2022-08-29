const { HTTP_STATUS, HTTP_TEXT, ACTION } = require('../constant');
const { error } = require('../interfaces');
const { Bill, Merchandise, Warehouse, Store, History } = require('../models');
const moment = require('moment');

async function getAllBill(request, response) {
    try {
        const { storeid } = request.headers;
        const {code, day, storeId} = request.query
        let bills;
        if (storeid) {
            bills = Bill.find({ store: storeid });
        } else {
            bills = Bill.find();
        }
        if(code){
            bills = bills.where('code').equals({ $regex: new RegExp(code, 'i') })
        }
        if (day) {
            const start = moment(day).startOf('day');
            const end = moment(day).startOf('day').add(1, 'day');
            bills = bills
              .where('createdAt')
              .equals({ $gte: start, $lt: end });
          }
        if(storeId){
            bills = bills.where('store').equals(storeId)
        }
        bills = await bills
            .sort({ createdAt: 1 })
            .populate(['store', 'merchandises.merchandise', 'cashier']);
        return response.status(200).json(bills);
    } catch (error) {
        console.log(error);
        return response.status(500).json('ERROR');
    }
}
async function getAllBillOfStore(request, response) {
    try {
        const { store } = request.params;
        let bills;
        bills = Bill.find({ store: store });

        bills = await bills
            .sort({ createdAt: 1 })
            .populate(['store', 'merchandises.merchandise', 'cashier']);
        return response.status(200).json(bills);
    } catch (error) {
        console.log(error);
        return response.status(500).json('ERROR');
    }
}
async function getDetailBill(request, response) {
    try {
        const { id } = request.params;

        const bill = await Bill.findById(id);

        return response.status(200).json(bill);
    } catch (error) {
        console.log(error);
        return response.status(500).json('ERROR');
    }
}

async function createBill(request, response) {
    try {
        const { storeid } = request.headers;
        const { merchandises_detail, store } = request.body;
        const user = request.user;
        const code = 'HD' + moment().format('MMDDYYYYHHmmss');
        let total = 0;
        let arrMer = [];
        for (let i = 0; i < merchandises_detail.length; i++) {
            const warehouse = await Warehouse.findOne({
                merchandise: merchandises_detail[i].merchandise_id,
            }).populate('merchandise');
            if (merchandises_detail[i].quantity > warehouse.quantity) {
                return response
                    .status(404)
                    .json(
                        `Số lượng hàng hóa ${warehouse.merchandise.name} chỉ còn ${warehouse.quantity}. Vui lòng thử lại!`
                    );
            } else {
                warehouse.quantity -= merchandises_detail[i].quantity;
                await warehouse.save();
                total += warehouse.price * merchandises_detail[i].quantity;
                arrMer.push({
                    merchandise: warehouse.merchandise,
                    price: warehouse.price,
                    quantity: merchandises_detail[i].quantity,
                });
            }
        }
        const storeBill = await Store.findById({ _id: storeid || store });
        const bill = new Bill({
            code,
            merchandises: [...arrMer],
            cashier: user._id,
            total,
            store: storeBill,
        });
        await bill.save();
        History.saveHistory(user._id, ACTION.CREATE_BILL, bill?.store, `Tạo hóa đơn ${bill.code}`);
        return response.status(200).json('OK');
    } catch (error) {
        console.log(error);
        return response.status(500).json('Có lỗi xảy ra');
    }
}
async function deleteBill(request, response) {
    try {
        const user = request.user;
        const { id } = request.params;

        const bill = await Bill.findById(id);
        const { merchandises } = bill;

        for (let i = 0; i < merchandises.length; i++) {
            const warehouse = await Warehouse.findOne({
                merchandise: merchandises[i].merchandise,
            }).populate('merchandise');
            warehouse.quantity += merchandises[i].quantity;
            await warehouse.save();
        }
        await bill.delete();
        History.saveHistory(user._id, ACTION.DELETE_BILL, user?.store, `Xóa hóa đơn ${bill.code}`);
        return response.status(200).json('OK');
    } catch (err) {
        console.log(err);
        return response.status(500).json('Có lỗi xảy ra');
    }
}
module.exports = {
    getAllBill,
    createBill,
    getDetailBill,
    getAllBillOfStore,
    deleteBill,
};
