const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const fetchadmin = require('../middleware/fetchadmin');
const UserOrders = require('../models/UserOrders');
const AdminProducts = require('../models/AdminProducts');
const User = require('../models/User');


// ROUTE 1:--> Get all the ordered products using: GET "/api/userorder/fetchorder". Login required.
router.get('/fetchorder', fetchuser, async (req, res) => {
    try {
        const order = await UserOrders.find({ user: req.user.id }); // It finds orders of the corresponding user.
        res.json(order); // It send cart as a response.
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
});

// ROUTE 2:--> Add ordered product using POST "/api/userorder/addorder". Login required.
router.post("/addorder/:id/:shoesize/:contact/:address", fetchuser, [
], async (req, res) => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let product = await AdminProducts.findById(req.params.id);
        if (!product) {
            return res.status(401).send("Not found !!"); // Return not found if product not found.
        }

        // let alreadyInCart = await UserCart.find

        let delivInfo = await User.findById(req.user.id).select('-password');
        let userdetail = await User.findById(req.user.id);

        let ordContact, ordAddress;
        if (delivInfo.contact === null) {
            ordContact = req.params.contact;
            ordAddress = req.params.address;

            let updated_contact_info = {}
            updated_contact_info.contact = ordContact;
            updated_contact_info.address = ordAddress;

            userdetail = await User.findByIdAndUpdate(req.user.id, { $set: updated_contact_info }, { new: true });
            console.log("New Customer"); // This is for testing only.
        } else {
            ordContact = delivInfo.contact;
            ordAddress = delivInfo.address;
            console.log("Old Customer"); // This is for testing only.
        }

        const order = new UserOrders({
            // Note:-> This way of creating object used when data is not de-structured.
            name: delivInfo.name,
            image: product.image,
            brand: product.brand,
            description: product.description,
            price: product.price,
            size: req.params.shoesize,
            user: req.user.id,
            contact: ordContact,
            address: ordAddress,
        });

        const savedorder = await order.save();
        // res.json({ savedorder });


        // res.json({"Delivery Info: ": delivInfo}); // This is for testing only.
        // res.json({ "Contact: ": ordContact, "Address: ": ordAddress }); // This is for testing only.

        // res.json({"ID of Product": req.params.id}); // This is for testing only.
        res.json({ "Product": product, savedorder, delivInfo }); // This is for testing only.
        // res.json({ "ID: ": req.params.id, "Size: ": req.params.size }); // This is for testing only.

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
});

// // ROUTE 3:--> Update the track message using: PUT "/api/userorder/:id". Login required.
router.put('/trackupdate/:id', fetchadmin, async (req, res) => {
    try {
        const { track } = req.body; // Here, we get the data using de-structuring.

        // Finds the validation errors in this request and wraps them in an object with handy functions.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let updated = {};

        if (track) {
            updated.track = track;
        }

        // Find the order to be update and update it.
        let updateTrack = await UserOrders.findById(req.params.id); // It finds the order with params's order id.

        // Below code will check the 
        if (!updateTrack) {
            return res.status(401).send("Not found !!"); // Return not found if product not found.
        }

        // Below code verify the admin belongs to logged in admin or not.
        // if (updateTrack.admin.toString() !== req.admin.id) { // Here, we match the existing admin id with the logged in admin id.
        //     return res.status(404).send("Unauthorised access !!");
        // }


        // -------------------------------------- Note For {new:true} ----------------------------------------
        // By default, findOneAndUpdate() returns the document as it was before update was applied.
        // If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
        // ---------------------------------------------------------------------------------------------------

        // Note:-> Below line is without {new: true} so it shows "res.json" without updated. With {new:true} it shows updated "res.json(cart)".
        // cart = await UserCart.findByIdAndUpdate(req.params.id, {$set: updated_cart}); // Cart Updated.

        updateTrack = await UserOrders.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true }); // Track Updated.
        res.json(updateTrack);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
});

// ROUTE 4:--> Delete the order using: DELETE "/api/userorder/deleteorder/:id". Login required.
router.delete("/cancelorder/:id", fetchuser, async (req, res) => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array()); // This is for testing only.
            return res.status(400).json({ errors: errors.array() });
        }

        let order = await UserOrders.findById(req.params.id);

        if (!order) {
            return res.status(401).send("Not Found"); // It means 404 "Not Found".
        }
        // Below code will verify the admin belongs to the logged in admin or not.
        if (order.user.toString() !== req.user.id) {
            return res.status(404).send("Unauthorised access !!");
        }

        order = await UserOrders.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Order has been cancelled successfully.", order: order });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
});

// ROUTE 5:--> Get all the Customer's Orders using: GET "/api/userorder/customerorders". Login required.
router.get('/customerorders', fetchadmin, async (req, res) => {
    try {
        const order = await UserOrders.find(); // It finds orders of the corresponding user.        
        res.json(order); // It send cart as a response.
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
});

module.exports = router;